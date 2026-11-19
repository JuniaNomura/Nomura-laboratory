// Markdown の本文に書いた確認用のメモ(<!-- ... -->)を、ページに出力しないようにする。
// メモは原稿のファイルには残るが、公開ページの「ソースを表示」では読めなくなる。

const COMMENT = /<!--[\s\S]*?-->/g;

function strip(node) {
  if (!Array.isArray(node.children)) return;
  node.children = node.children.filter((child) => {
    if (child.type === "comment") return false;
    if (child.type === "raw") {
      // この時点では、本文中の HTML は「生の文字列」のまま残っている
      child.value = String(child.value ?? "").replace(COMMENT, "");
      return child.value.trim() !== "";
    }
    strip(child);
    return true;
  });
}

export default function rehypeStripComments() {
  return (tree) => strip(tree);
}
