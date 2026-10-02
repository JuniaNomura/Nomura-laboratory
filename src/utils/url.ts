// astro.config.mjs の base 設定(例: "/lab-site")を考慮した内部リンクを作るヘルパー。
// GitHub Pagesのプロジェクトページ(https://org.github.io/repo/ 形式)のように
// ルート以外にデプロイする場合でも、リンクが正しく組み立てられるようにする。
export function withBase(pathname: string): string {
  const base = import.meta.env.BASE_URL; // 例: "/" または "/lab-site/"
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;

  if (pathname === "/") {
    return normalizedBase === "" ? "/" : `${normalizedBase}/`;
  }
  return `${normalizedBase}${pathname}`;
}
