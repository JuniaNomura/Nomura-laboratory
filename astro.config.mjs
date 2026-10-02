// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 公開先が決まったら、下の2つを書き換えてください。
//   site: 最終的な公開URL (例: "https://your-org.github.io" や独自ドメイン)
//   base: GitHub Pagesでリポジトリ名がURLに入る場合は "/リポジトリ名" を指定
//         (例: your-org.github.io/lab-site/ で公開するなら base: "/lab-site")
//         独自ドメインや <org>.github.io リポジトリで公開する場合は "/" のままでよい
const SITE_URL = "https://JuniaNomura.github.io";
const BASE_PATH = "/Nomura-laboratory";

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  build: {
    format: "directory",
  },
});
