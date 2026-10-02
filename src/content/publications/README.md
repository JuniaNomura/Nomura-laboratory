# このフォルダについて

このフォルダの `.yaml` ファイルは、通常は `scripts/fetch-researchmap.mjs`
(GitHub Actions から定期実行) が researchmap の公開データから自動生成します。
手動で編集する運用は想定していません。

ファイル名は `{researchmapのpermalink}-{researchmap側の業績ID}.yaml` の形式で
自動生成されます。`sample-001.yaml` は表示イメージ確認用のサンプルなので、
実データが入ったら削除して構いません。

このREADME自体は `.yaml` ではないので、サイトの業績一覧には表示されません。
