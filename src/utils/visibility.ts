// 下書き(draft: true)の記事を、いつ表示するかを決めるヘルパー。
// - 開発サーバー(npm run dev)では、下書きも表示して確認できる。
// - 公開用のビルド(npm run build)では、下書きは含めない。
export const isVisible = (data: { draft?: boolean }): boolean =>
  import.meta.env.DEV || !data.draft;
