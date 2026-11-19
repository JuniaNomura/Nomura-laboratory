// 教育・アウトリーチのページで使う表示名とリンクの作り方。
// 種類を増やすときは、src/content.config.ts と public/admin/config.yml も揃える。
import { withBase } from "./url";
import { isHttpUrl } from "./contact";

export const kindLabels = {
  course: "学内の講義",
  outreach: "学外講義・出前授業",
} as const;

export const materialLabels = {
  note: "講義ノート",
  slides: "スライド",
  exam: "試験問題",
  video: "動画",
  other: "資料",
} as const;

// 外部のURLはそのまま、サイト内のファイル(/uploads/...)はベースパスを付けて返す
export const materialHref = (file: string): string => (isHttpUrl(file) ? file : withBase(file));

// PDFなどのファイル形式を、リンクの後ろに小さく表示するための文字列
export const fileFormat = (file: string): string => {
  if (isHttpUrl(file)) return "外部サイト";
  const ext = file.split("?")[0].split(".").pop()?.toUpperCase();
  return ext && ext.length <= 5 ? ext : "";
};
