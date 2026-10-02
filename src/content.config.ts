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

export const collections = { news, members, publications };
