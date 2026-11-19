// 連絡先の欄に、メールアドレスそのものが書かれているかどうか。
// 迷惑メール対策で「@を置き換えてください」のような文章を書いた場合は、
// リンクにせず、文章のまま表示する。
export function isEmail(value: string | undefined): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "");
}

// フォームなどのURLとして使えるもの(http/https)だけを通す
export function isHttpUrl(value: string | undefined): boolean {
  return /^https?:\/\/\S+$/.test(value ?? "");
}
