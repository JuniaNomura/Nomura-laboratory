#!/usr/bin/env node
// researchmapの公開APIから、メンバーごとの業績を取得して
// src/content/publications/ にYAMLファイルとして書き出すスクリプト。
//
// - 認証は不要(公開情報のみを取得する researchmap の公開エンドポイントを使用)
// - メンバー情報(permalink)は src/content/members/*.yaml から読み取る
// - GitHub Actions で定期実行し、差分があればコミットする運用を想定
//
// あわせて、受賞と委員会の情報を src/data/researchmap/<permalink>.yaml に書き出す
// (メンバーのページの、教員の紹介に表示する)。
//
// 実行方法:
//   node scripts/fetch-researchmap.mjs
//   (package.json の "fetch:researchmap" スクリプトからも呼べます)
//   node scripts/fetch-researchmap.mjs --profile-only  … 受賞と委員会だけを取得する

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MEMBERS_DIR = path.join(ROOT, "src/content/members");
const PUBLICATIONS_DIR = path.join(ROOT, "src/content/publications");
const PROFILE_DIR = path.join(ROOT, "src/data/researchmap");
const PROFILE_ONLY = process.argv.includes("--profile-only");

// 取得する業績種別。増やす場合はここに追記する。
// (researchmap.v2 API仕様書「業績種別」の一覧を参照)
const ACHIEVEMENT_TYPES = [
  { type: "published_papers", titleField: "paper_title", authorsField: "authors", venueField: "publication_name" },
  { type: "presentations", titleField: "presentation_title", authorsField: "presenters", venueField: "event" },
  { type: "books_etc", titleField: "book_title", authorsField: "authors", venueField: "publisher" },
];

const REQUEST_LIMIT = 1000; // researchmap APIの最大値
const REQUEST_INTERVAL_MS = 300; // APIへの配慮として、リクエスト間に少し間隔を空ける

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadMembers() {
  const files = (await readdir(MEMBERS_DIR)).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"));
  const members = [];
  for (const file of files) {
    const raw = await readFile(path.join(MEMBERS_DIR, file), "utf-8");
    const data = yaml.load(raw);
    if (data?.permalink) {
      members.push({ file, permalink: String(data.permalink).trim() });
    }
  }
  return members.filter((m) => m.permalink.length > 0);
}

function pickLocalizedText(field) {
  if (!field) return { ja: undefined, en: undefined };
  return { ja: field.ja, en: field.en };
}

function extractNames(namesField) {
  if (!namesField) return [];
  const list = namesField.ja?.length ? namesField.ja : namesField.en ?? [];
  return list.map((entry) => entry?.name).filter(Boolean);
}

function extractYear(publicationDate) {
  const match = publicationDate?.match(/^(\d{4})/);
  return match ? Number(match[1]) : undefined;
}

function extractDoi(item) {
  const doi = item.identifiers?.doi;
  return Array.isArray(doi) && doi.length > 0 ? doi[0] : undefined;
}

function extractUrl(item, doi) {
  if (doi) return `https://doi.org/${doi}`;
  const urlEntry = item.see_also?.find((entry) => entry.label === "url");
  return urlEntry?.["@id"];
}

async function fetchAchievements(permalink, achievementType) {
  const url = `https://api.researchmap.jp/${encodeURIComponent(permalink)}/${achievementType.type}?format=json&limit=${REQUEST_LIMIT}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    console.warn(`  [警告] ${permalink} / ${achievementType.type}: HTTP ${res.status} のため取得をスキップしました`);
    return [];
  }
  const body = await res.json();
  return Array.isArray(body.items) ? body.items : [];
}

// --- 受賞と委員会 ---

// "2022-12" → "2022年12月"、"9999" → "" (終わりがない = 現在も継続)
function formatDate(value) {
  if (!value || String(value).startsWith("9999")) return "";
  const m = String(value).match(/^(\d{4})(?:-(\d{2}))?/);
  if (!m) return String(value);
  return m[2] ? `${m[1]}年${Number(m[2])}月` : `${m[1]}年`;
}

const text = (field) => field?.ja ?? field?.en ?? "";

async function fetchAll(permalink, type) {
  const url = `https://api.researchmap.jp/${encodeURIComponent(permalink)}/${type}?format=json&limit=${REQUEST_LIMIT}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${permalink} / ${type}: HTTP ${res.status}`);
  const body = await res.json();
  return Array.isArray(body.items) ? body.items : [];
}

// 新しい順に並べるための、日付の比較用の値
const sortKey = (value) => (String(value ?? "").startsWith("9999") ? "9999" : String(value ?? ""));

async function writeProfile(permalink) {
  let awards;
  let committees;
  try {
    awards = await fetchAll(permalink, "awards");
    await sleep(REQUEST_INTERVAL_MS);
    committees = await fetchAll(permalink, "committee_memberships");
  } catch (err) {
    // 取得に失敗したときは、前回のファイルをそのまま残す(ページから消えないように)
    console.warn(`  [警告] 受賞・委員会の取得に失敗したため、前回のデータを残しました: ${err.message}`);
    return;
  }
  const profile = {
    updated: new Date().toISOString().slice(0, 10),
    awards: awards
      .filter((a) => a.display !== "undisclosed")
      .sort((a, b) => sortKey(b.award_date).localeCompare(sortKey(a.award_date)))
      .map((a) => ({
        date: formatDate(a.award_date),
        name: text(a.award_name),
        association: text(a.association) || undefined,
      }))
      .filter((a) => a.name),
    committees: committees
      .filter((c) => c.display !== "undisclosed")
      .sort((a, b) => sortKey(b.from_date).localeCompare(sortKey(a.from_date)))
      .map((c) => {
        const from = formatDate(c.from_date);
        const to = formatDate(c.to_date);
        return {
          period: from ? `${from}〜${to}` : to,
          name: text(c.committee_name),
          association: text(c.association) || undefined,
        };
      })
      .filter((c) => c.name),
  };
  await mkdir(PROFILE_DIR, { recursive: true });
  await writeFile(
    path.join(PROFILE_DIR, `${permalink}.yaml`),
    "# scripts/fetch-researchmap.mjs が researchmap から自動で作るファイルです。手で編集しないでください\n" +
      yaml.dump(profile, { skipInvalid: true, lineWidth: 200 }),
    "utf-8",
  );
  console.log(`  受賞 ${profile.awards.length} 件、委員会 ${profile.committees.length} 件を書き出しました`);
}

function toYamlRecord(item, achievementType, permalink) {
  const title = pickLocalizedText(item[achievementType.titleField]);
  const venue = pickLocalizedText(item[achievementType.venueField]);
  const authors = extractNames(item[achievementType.authorsField]);
  const publicationDate = item.publication_date;
  const doi = extractDoi(item);

  return {
    titleJa: title.ja,
    titleEn: title.en,
    authors,
    journal: venue.ja ?? venue.en,
    publicationDate,
    year: extractYear(publicationDate),
    doi,
    url: extractUrl(item, doi),
    achievementType: achievementType.type,
    ownerPermalink: permalink,
    sourceId: item["rm:id"] ?? item["@id"],
  };
}

async function main() {
  await mkdir(PUBLICATIONS_DIR, { recursive: true });
  const members = await loadMembers();

  if (members.length === 0) {
    console.log("permalinkが設定されたメンバーが見つかりませんでした。src/content/members/ を確認してください。");
    return;
  }

  let written = 0;
  for (const member of members) {
    console.log(`取得中: ${member.permalink}`);
    await writeProfile(member.permalink);
    await sleep(REQUEST_INTERVAL_MS);
    if (PROFILE_ONLY) continue;
    for (const achievementType of ACHIEVEMENT_TYPES) {
      const items = await fetchAchievements(member.permalink, achievementType);
      for (const item of items) {
        const record = toYamlRecord(item, achievementType, member.permalink);
        if (!record.titleJa && !record.titleEn) continue; // タイトルが無いデータは書き出さない

        const safeId = String(record.sourceId ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
        const fileName = `${member.permalink}-${achievementType.type}-${safeId}.yaml`;
        const filePath = path.join(PUBLICATIONS_DIR, fileName);
        const yamlText = yaml.dump(record, { skipInvalid: true, lineWidth: 100 });
        await writeFile(filePath, yamlText, "utf-8");
        written += 1;
      }
      await sleep(REQUEST_INTERVAL_MS);
    }
  }

  console.log(`完了: ${written} 件の業績ファイルを書き出しました。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
