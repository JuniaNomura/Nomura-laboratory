// 「詳しく知る」の個別ページ(src/content/guides/)の本文を、見出し(##)ごとに折りたたむ。
// 最初の見出しより前の導入文は、そのまま表示する。
// frontmatter に fold: false と書いたページは、折りたたまない。

const el = (tagName, properties, children) => ({ type: "element", tagName, properties, children });

export default function rehypeFoldSections() {
  return (tree, file) => {
    const path = String(file.path ?? "").replace(/\\/g, "/");
    if (!path.includes("/content/guides/")) return;
    if (file.data?.astro?.frontmatter?.fold === false) return;

    const out = [];
    let body = null; // いま中身を集めている折りたたみの本文
    for (const node of tree.children) {
      if (node.type === "element" && node.tagName === "h2") {
        node.properties = { ...node.properties, className: ["fold__title"] };
        body = el("div", { className: ["fold__body"] }, []);
        out.push(el("details", { className: ["fold", "fold--section"] }, [el("summary", {}, [node]), body]));
      } else if (body) {
        body.children.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}
