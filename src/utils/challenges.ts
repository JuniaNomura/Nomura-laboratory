// お試し課題の難しさ。content.config.ts と public/admin/config.yml の選択肢と揃える。
const levels: Record<number, string> = {
  1: "難しさ ★☆☆ やさしい",
  2: "難しさ ★★☆ ふつう",
  3: "難しさ ★★★ 歯ごたえあり",
};

export const challengeLevelLabel = (level: number): string => levels[level] ?? levels[1];
