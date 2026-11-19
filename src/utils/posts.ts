// 「学生の記事」の種類。content.config.ts と public/admin/config.yml の選択肢と揃える。
// 種類を増やすときは、この3か所に同じ値を追加する。
export const postKinds = [
  {
    value: "laser",
    label: "レーザー製作記",
    lead: "学部4年生が1年かけてつくる「自分のレーザー」の記録です。",
  },
  {
    value: "conference",
    label: "学会・イベント参加記",
    lead: "学会発表や展示会、アウトリーチ活動などに参加した記録です。",
  },
  {
    value: "tech",
    label: "技術メモ",
    lead: "実験や工作、プログラミングで学んだことのメモです。",
  },
  {
    value: "life",
    label: "研究室の日常",
    lead: "研究室での普段の様子を紹介します。",
  },
] as const;

export const postKindLabel = (value: string): string =>
  postKinds.find((k) => k.value === value)?.label ?? value;

export const formatDate = (d: Date): string =>
  d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
