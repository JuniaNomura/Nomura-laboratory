# 研究室ウェブサイト(ひな形)

Astro製の軽量な研究室ウェブサイトのひな形です。Markdown/YAMLで書いた内容を
ビルド時にすべて静的なHTMLへ変換するため、公開後はサーバ側で何も実行されません。

## 構成

```
src/
  content.config.ts       コンテンツの型定義(記事・メンバー・業績)
  content/
    news/                 お知らせ・技術紹介の記事 (Markdown, 学生が更新する想定)
    members/               メンバー情報 (YAML)
    publications/           業績 (YAML。通常は researchmap から自動生成)
  pages/                   各ページ (トップ、研究内容、メンバー、業績、ニュース、アクセス)
  components/, layouts/    共通パーツ
  config/site.ts           ラボ名・連絡先などサイト全体の設定
scripts/
  fetch-researchmap.mjs    researchmapの公開APIから業績を取得するスクリプト
public/admin/
  index.html, config.yml   管理画面(Sveltia CMS)。ニュース・メンバーをブラウザから編集できる
.github/workflows/
  deploy.yml               ビルド・researchmap同期・GitHub Pagesへの公開
```

## はじめに直すところ

1. `src/config/site.ts` — ラボ名、所属、連絡先、所在地を実際の内容に書き換える
2. `astro.config.mjs` — 公開先が決まったら `SITE_URL` と `BASE_PATH` を書き換える
3. `src/content/members/` — サンプルを削除し、実際のメンバーを追加する
   (researchmapのpermalinkを入れると業績の自動取得対象になります)
4. `src/content/publications/sample-001.yaml` — サンプルなので、実データが入ったら削除する
5. `src/pages/research.astro` — 研究内容を実際のテーマに書き換える
6. `public/favicon.svg` — 好きなアイコンに差し替える

## ローカルでの動かし方

Node.js 20以上が必要です。

```bash
npm install
npm run dev       # http://localhost:4321 で確認
npm run build     # dist/ に静的ファイルを出力
npm run fetch:researchmap   # researchmapから業績を取得して src/content/publications/ を更新
```

> **注記**: このひな形はコード生成環境のネットワーク制限により、`npm install` や
> `astro build` をその場で実行して検証することができませんでした。GitHub Actions
> (次のステップで設定)上では通常どおりビルドできるはずですが、お手元の環境や
> GitHub Actions で最初に `npm install && npm run build` を実行し、エラーが出ないか
> 確認することをおすすめします。何か問題があれば教えてください。

## 業績データについて

`scripts/fetch-researchmap.mjs` は、`src/content/members/*.yaml` の `permalink`
が設定されているメンバー全員について、researchmapの公開API
(`https://api.researchmap.jp/{permalink}/{業績種別}`) から論文・講演・書籍等の
情報を取得し、`src/content/publications/` にYAMLファイルとして書き出します。
このAPIは公開情報の取得に限れば認証不要なので、機関単位のAPI利用申請は不要です。

この取得処理は `.github/workflows/deploy.yml` から毎日自動実行され、差分があれば
`github-actions[bot]` の名前でコミット・pushされます。

## 公開までの設定手順(GitHub Pages)

1. このプロジェクトをGitHubリポジトリにpushする(リポジトリ名は自由)。
2. リポジトリの **Settings → Actions → General → Workflow permissions** を
   **"Read and write permissions"** にする。
   (researchmap同期の自動コミット・pushに書き込み権限が必要なため)
3. リポジトリの **Settings → Pages → Build and deployment → Source** を
   **"GitHub Actions"** にする。
4. 次の3箇所を、実際のリポジトリ名・公開URLに書き換える。
   - `astro.config.mjs` の `SITE_URL` / `BASE_PATH`
   - `src/config/site.ts` の `githubRepo`
   - `public/admin/config.yml` の `backend.repo`
5. `main` ブランチにpushすると、`.github/workflows/deploy.yml` が自動でビルド・
   公開します(手動実行は Actions タブから "Run workflow" でも可能)。

## 管理画面(Sveltia CMS)について

`https://(公開URL)/admin/` にアクセスすると、ニュース記事とメンバー情報を
ブラウザのフォームから編集できます(GitHubへの書き込み権限を持つアカウントが必要)。

初期設定では **トークンでのサインイン**方式です。追加のサーバ設定は不要で、
編集者がGitHubで発行した Personal Access Token
([Fine-grained token](https://github.com/settings/personal-access-tokens/new)。
対象リポジトリを指定し、Contents権限を "Read and write" にする)を
管理画面のログイン画面に貼り付けて使います。

学生ごとにトークンを発行する運用が面倒に感じる場合は、Sveltia CMS Authenticator
(Cloudflare Workers上で動く無料の中継。常時稼働のサーバではなく、一度デプロイすれば
管理不要)を使うと「GitHubでログイン」ボタンでの認証に切り替えられます。
`public/admin/config.yml` にコメントで手順を記載しています。
詳細: https://github.com/sveltia/sveltia-cms-auth

業績(`src/content/publications/`)はSveltia CMSの編集対象に含めていません。
researchmapからの自動同期に一本化し、二重管理を避けるためです。
