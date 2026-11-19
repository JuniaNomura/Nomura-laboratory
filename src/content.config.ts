import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// お知らせ・技術紹介など、学生が更新する記事
const news = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

// 研究室メンバー(教員・学生・卒業生)
const members = defineCollection({
  loader: glob({ pattern: "**/[^_]*.yaml", base: "./src/content/members" }),
  schema: z.object({
    nameJa: z.string(),
    nameEn: z.string().optional(),
    role: z.enum(["faculty", "staff", "student", "alumni"]),
    // 学年など (例: "M2", "B4")。教員・卒業生は空でよい
    grade: z.string().optional(),
    // 職名など (例: "教授", "助教")。学生は空でよい
    positionJa: z.string().optional(),
    // researchmapのパーマリンク。設定すると業績の自動取得対象になる
    // (例: https://researchmap.jp/taro_yamada なら "taro_yamada")
    permalink: z.string().optional(),
    photo: z.string().optional(),
    email: z.string().email().optional(),
    // 在籍中はfalse、卒業・修了したらtrueにする
    graduated: z.boolean().optional().default(false),
    // メンバー一覧での並び順。小さいほど上に表示
    order: z.number().optional().default(100),
        // 加入年月 (例: "2024-04")
    joinDate: z.string().optional(),
    // 卒業・修了年月 (例: "2026-03")。在籍中は空でよい
    graduationDate: z.string().optional(),
    // 資格 (例: ["危険物取扱者乙種4類", "第二種電気工事士"])
    qualifications: z.array(z.string()).optional().default([]),
    // 表彰・学科HP掲載などの実績 (例: ["〇〇学会 優秀発表賞 (2025)", "学科HPに掲載 (2025)"])
    awards: z.array(z.string()).optional().default([]),
    // 進学先・就職先 (例: "〇〇大学大学院" "〇〇株式会社")。主に卒業生向け
    afterCareer: z.string().optional(),
    // 業種 (例: "半導体", "自動車", "電機")。主に卒業生向け
    industry: z.string().optional(),
    // 経歴(主に教員向け)。古い順に並べる (例: { period: "2024年4月〜", text: "日本大学 生産工学部 助教" })
    career: z
      .array(z.object({ period: z.string(), text: z.string() }))
      .optional()
      .default([]),
  }),
});

// 在学生の声(「研究室で学ぶ」ページに表示)
const voices = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/voices" }),
  schema: z.object({
    // 氏名、またはイニシャル(掲載を希望しない人はイニシャルのみにする)
    displayName: z.string(),
    grade: z.string().optional(),
    // 写真は掲載を希望した人のみ
    photo: z.string().optional(),
    order: z.number().optional().default(100),
    // 本人が内容を確認して同意するまでは true のままにして非公開にする
    draft: z.boolean().optional().default(true),
  }),
});

// 研究内容のページで、テーマの下に表示できるシミュレーター(src/components/sims/)。
// 追加するときは、src/pages/research.astro と public/admin/config.yml も揃える
const themeSimulators = z.enum([
  "modelock",
  "comb",
  "lidar",
  "lock",
  "combine",
  "absorption",
  "amp",
  "eocomb",
  "lif",
  "cooling",
  "hyper",
  "extract",
]);

// 研究テーマ(「研究内容」ページに表示)
const themes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/themes" }),
  schema: z.object({
    title: z.string(),
    // 一覧で題名の下に表示する、1行の紹介(本文は、クリックして開いたときに表示される)
    summary: z.string().optional(),
    // create=光を創る / measure=光で測る / control=光で操る / past=過去の研究
    axis: z.enum(["create", "measure", "control", "past"]),
    order: z.number().optional().default(100),
    // 研究内容のページで、このテーマの下に表示するシミュレーター(src/components/sims/)。
    // 追加するときは、src/pages/research.astro と public/admin/config.yml も揃える
    simulator: themeSimulators.optional(),
    // 2つめのシミュレーター(1つめの下に続けて表示する)
    simulator2: themeSimulators.optional(),
    // 関連するお試し課題のファイル名(例: "tof")。その課題が公開されていれば、リンクを表示する
    challenge: z.string().optional(),
    // 公開してよい状態になったら false にする
    draft: z.boolean().optional().default(true),
  }),
});

// コラム
const columns = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/columns" }),
  schema: z.object({
    title: z.string(),
    // research=研究と社会のつながりを紹介するコラム / essay=教員が日ごろ考えていることを書くコラム
    kind: z.enum(["research", "essay"]).optional().default("research"),
    summary: z.string().optional(),
    order: z.number().optional().default(100),
    draft: z.boolean().optional().default(true),
  }),
});

// 学生の記事(レーザー製作記・学会参加記など)。種類は src/utils/posts.ts と揃える
const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    // laser=レーザー製作記 / conference=学会・イベント参加記 / tech=技術メモ / life=研究室の日常
    kind: z.enum(["laser", "conference", "tech", "life"]),
    date: z.coerce.date(),
    // 氏名、またはイニシャル(掲載を希望しない人はイニシャルのみにする)
    author: z.string().optional(),
    grade: z.string().optional(),
    excerpt: z.string().optional(),
    // 教員が内容を確認するまでは true のままにして非公開にする
    draft: z.boolean().optional().default(true),
  }),
});

// お試し課題(「配属前にできること」ページから案内する、配属前の学生向けの小さな課題)
const challenges = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/challenges" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    // 難しさ: 1=やさしい / 2=ふつう / 3=歯ごたえあり (表示は src/utils/challenges.ts)
    level: z.number().int().min(1).max(3).optional().default(1),
    // レーザーを使う部分がある課題は true にする(「研究室での体験がおすすめ」と表示される)
    usesLaser: z.boolean().optional().default(false),
    // ページに表示するシミュレーター。本文中の <div data-sim="grating"></div> のように書いた位置に入る
    // (追加するときは、src/pages/join/challenges/[slug].astro と public/admin/config.yml も揃える)
    simulator: z.enum(["grating", "tof", "michelson", "mic", "bb84", "zeno"]).optional(),
    order: z.number().optional().default(100),
    draft: z.boolean().optional().default(true),
  }),
});

// 配属希望者向けの詳しい説明ページ(研究室の方針・設備・進路など)
const guides = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    order: z.number().optional().default(100),
    // 本文を見出し(##)ごとに折りたたんで表示する。短いページでは false にする
    fold: z.boolean().optional().default(true),
    draft: z.boolean().optional().default(true),
  }),
});

// 教育・アウトリーチ(担当した講義や学外講義と、その資料)。種類の表示は src/utils/teaching.ts と揃える
const teaching = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/teaching" }),
  schema: z.object({
    title: z.string(),
    // course=学内の講義 / outreach=学外講義・出前授業・講演
    kind: z.enum(["course", "outreach"]),
    // 実施時期 (例: "2025年度 前期", "2025年8月")
    period: z.string().optional(),
    // 対象 (例: "学部2年", "高校生", "一般")
    audience: z.string().optional(),
    // 学外講義の開催先・主催 (例: "〇〇高校", "〇〇市 公開講座")
    place: z.string().optional(),
    summary: z.string().optional(),
    // 公開する資料。file は /uploads/teaching/ 以下のファイル、または外部のURL
    materials: z
      .array(
        z.object({
          label: z.string(),
          type: z.enum(["note", "slides", "exam", "video", "other"]).optional().default("other"),
          file: z.string(),
        }),
      )
      .optional()
      .default([]),
    order: z.number().optional().default(100),
    // 資料の公開に問題がないことを確認するまでは true のままにして非公開にする
    draft: z.boolean().optional().default(true),
  }),
});

// 業績。基本的には scripts/fetch-researchmap.mjs が researchmap から
// 自動生成するファイルで、手で編集する運用は想定していない
const publications = defineCollection({
  loader: glob({ pattern: "**/[^_]*.yaml", base: "./src/content/publications" }),
  schema: z
    .object({
      titleJa: z.string().optional(),
      titleEn: z.string().optional(),
      authors: z.array(z.string()).optional().default([]),
      journal: z.string().optional(),
      // researchmapの出版年月(日)の表記をそのまま保持 (例: "2026-03", "2026")
      publicationDate: z.string().optional(),
      year: z.number().optional(),
      doi: z.string().optional(),
      url: z.string().optional(),
      // researchmapの業績種別 (published_papers, presentations, books_etc など)
      achievementType: z.string().optional(),
      // どのメンバーのresearchmapから取得したか (permalink)
      ownerPermalink: z.string().optional(),
      // researchmap側の業績ID。重複除去や再取得時の突き合わせに使う
      sourceId: z.string().optional(),
    })
    .refine((data) => data.titleJa || data.titleEn, {
      message: "titleJa または titleEn のどちらかは必須です",
    }),
});

export const collections = { news, members, voices, themes, columns, posts, challenges, guides, teaching, publications };
