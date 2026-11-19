// 研究室紹介の導入文と、研究室が大切にしている言葉(src/data/lab.yaml)を読み込む。
// トップページと「研究内容」ページで、同じ文章を使うためのもの。
import { loadYaml } from "./data";

export interface Motto {
  quote: string;
  translation?: string;
  author?: string;
  reference?: string;
  referenceUrl?: string;
  text?: string;
}
export interface LabData {
  intro?: string;
  footnote?: string;
  mottos?: Motto[];
}

export const loadLab = (): LabData => loadYaml<LabData>("src/data/lab.yaml", {});
