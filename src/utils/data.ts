import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

// src/data/ 以下のYAMLを読み込むヘルパー(ビルド時にだけ実行される)。
// ファイルが無いときは fallback を返す。YAMLの書式ミスは例外にして、
// ビルドを失敗させる(気づかないまま空のページが公開されるのを防ぐ)。
export function loadYaml<T>(relativePath: string, fallback: T): T {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) return fallback;
  const parsed = yaml.load(fs.readFileSync(fullPath, "utf8"));
  return (parsed as T) ?? fallback;
}
