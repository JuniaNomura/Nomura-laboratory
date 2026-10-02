// サイト全体で使う設定値をまとめたファイル。
// ラボ名やロゴ、連絡先などはここを直せば全ページに反映される。
export const siteConfig = {
  labNameJa: "野邑研究グループ（石澤・野邑研究室）",
  labNameEn: "Nomura Group in Ishizawa-Nomura Lab",
  universityJa: "日本大学",
  departmentJa: "生産工学部 電気電子学科",
  descriptionJa: "野邑研究グループのウェブサイトです。「光を創る」「光で測る」「光で操る」3つの軸で研究を行っています。",
  // お問い合わせ先。公開して問題ないアドレスにする
  contactEmail: "nomura.junia(=^・^=), (=^・^=)の部分を@nihon-u.ac.jpに変更してください。",
  // 所在地・アクセスページ用
  addressJa: "275-8575　千葉県習志野市泉町1-2-1 津田沼キャンパス 31号館 3階 314-316号室",
  // GitHubリポジトリ (Sveltia CMSの設定や「編集を提案」リンクなどで使う)
  githubRepo: "JuniaNomura/Nomura-laboratory",
  githubBranch: "main",
} as const;

export const navItems = [
  { href: "/", label: "トップ" },
  { href: "/research/", label: "研究内容" },
  { href: "/members/", label: "メンバー" },
  { href: "/publications/", label: "業績" },
  { href: "/news/", label: "ニュース" },
  { href: "/access/", label: "アクセス" },
] as const;
