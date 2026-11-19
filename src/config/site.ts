// サイト全体で使う設定値をまとめたファイル。
// ラボ名やロゴ、連絡先などはここを直せば全ページに反映される。
export const siteConfig = {
  labNameJa: "野邑研究グループ（石澤・野邑研究室）",
  labNameEn: "Nomura Group in Ishizawa-Nomura Lab",
  universityJa: "日本大学",
  departmentJa: "生産工学部 電気電子工学科",
  // 検索結果などに出る、サイトの短い説明(トップページの導入文は src/data/lab.yaml)
  descriptionJa:
    "日本大学 生産工学部 電気電子工学科 野邑研究グループのウェブサイトです。「光を創る」「光で測る」「光で操る」3つの軸で研究を行い、強靭社会の実現に貢献することを目指しています。",
  // お問い合わせ先。公開して問題ないアドレスにする
  contactEmail: "nomura.junia(=^・^=), (=^・^=)の部分を@nihon-u.ac.jpに変更してください。",
  // 所在地・アクセスページ用
  addressJa: "275-8575　千葉県習志野市泉町1-2-1 津田沼キャンパス 31号館 3階 314-316号室",
  // GitHubリポジトリ (Sveltia CMSの設定や「編集を提案」リンクなどで使う)
  githubRepo: "JuniaNomura/Nomura-laboratory",
  githubBranch: "main",
  // アクセス解析(Cloudflare Web Analytics)のトークン。
  // Cloudflareの管理画面で、サイトを登録したときに表示される32文字の英数字を入れる。
  // 空のときは、計測用のコードを埋め込まない。開発サーバー(npm run dev)では、入れても計測しない
  cloudflareAnalyticsToken: "5a196ab98148409bbfd2e53eb9dfe5da",
} as const;

export const navItems = [
  { href: "/", label: "トップ" },
  { href: "/research/", label: "研究内容" },
  { href: "/members/", label: "メンバー" },
  { href: "/join/", label: "研究室で学ぶ" },
  { href: "/publications/", label: "業績" },
  // 公開できる資料がそろうまでは、開発サーバー(npm run dev)でだけメニューに出す。
  // 公開するときは、この行を { href: "/teaching/", label: "教育・アウトリーチ" }, に書き換える
  ...(import.meta.env.DEV ? [{ href: "/teaching/", label: "教育・アウトリーチ" }] : []),
  { href: "/news/", label: "ニュース" },
  { href: "/access/", label: "アクセス" },
] as const;
