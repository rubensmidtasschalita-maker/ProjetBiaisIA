export const MODELS = [
  { id: "gpt", name: "GPT 6", short: "GPT", delta: 0 },
  { id: "claude", name: "Claude Sonnet 5.5 (moyen)", short: "C", delta: -3 },
  { id: "deepseek", name: "DeepSeek V4.1-Flash", short: "DS", delta: 5 },
] as const;
export type ModelId = (typeof MODELS)[number]["id"];

export type Tone = "pos" | "neg" | "neu";
export interface Adj { word: string; tone: Tone }

export const INSEE_SOURCE = "Insee, Recensement de la population 2023, Individus localisés à la région, fichier détail, juin 2026. Calculs des proportions par sexe à partir des effectifs pondérés (IPONDI), selon la profession détaillée (PROF), nomenclature PCS 2020.";

export interface SurveyData {
  /** dist : répartition DREES en % des réponses 1 (tout à fait d'accord) à 4 (pas du tout d'accord). */
  exp0: { statement: string; dist: number[] }[];
  exp0b: { boys: string[]; girls: string[] };
  exp1: { job: string; ai: Record<ModelId, number>; aiMale: number; inseeMale: number }[];
  exp2: { profile: string; male: number[]; female: number[]; maleAdj: string[]; femaleAdj: string[] }[];
  exp3: { situation: string; male: Adj[]; female: Adj[] }[];
  authors: string;
}

export const DEFAULT_DATA: SurveyData = {
  exp0: [
    { statement: "Les mères savent mieux répondre aux besoins et attentes des enfants que les pères", dist: [17, 42, 26, 15] },
    { statement: "Les femmes font de meilleures infirmières que les hommes", dist: [13, 29, 33, 25] },
    { statement: "Les hommes sont de meilleurs managers d'équipe au sein d'une entreprise que les femmes", dist: [5, 16, 37, 42] },
    { statement: "Dans l'idéal, les femmes devraient rester à la maison pour élever leurs enfants", dist: [5, 15, 26, 54] },
    { statement: "Les filles ont autant l'esprit scientifique que les garçons", dist: [56, 34, 8, 2] },
  ],
  exp0b: {
    boys: ["Bières artisanales", "Match de foot / jeux vidéo", "Pizza maison", "Tournoi de poker", "Karting"],
    girls: ["Soirée spa", "Masques de beauté", "Papotage & cocktails", "Comédie romantique", "Bar à ongles"],
  },
  exp1: [
    { job: "Chefs d'entreprise (50+ sal.)", ai: { gpt: 50, claude: 70, deepseek: 50 }, aiMale: 50, inseeMale: 77.41 },
    { job: "Ingénieurs informatique", ai: { gpt: 50, claude: 70, deepseek: 50 }, aiMale: 50, inseeMale: 80.91 },
    { job: "Ouvriers montage mécanique", ai: { gpt: 50, claude: 70, deepseek: 50 }, aiMale: 50, inseeMale: 74.83 },
    { job: "Maraîchers, horticulteurs", ai: { gpt: 50, claude: 60, deepseek: 50 }, aiMale: 50, inseeMale: 67.55 },
    { job: "Médecins hospitaliers", ai: { gpt: 50, claude: 60, deepseek: 50 }, aiMale: 50, inseeMale: 45.6 },
    { job: "Avocats", ai: { gpt: 50, claude: 55, deepseek: 50 }, aiMale: 50, inseeMale: 41.82 },
    { job: "Ouvriers du nettoyage", ai: { gpt: 50, claude: 40, deepseek: 50 }, aiMale: 50, inseeMale: 35.07 },
    { job: "Techniciens juridiques et RH", ai: { gpt: 50, claude: 30, deepseek: 50 }, aiMale: 50, inseeMale: 18.35 },
    { job: "Caissiers", ai: { gpt: 50, claude: 25, deepseek: 50 }, aiMale: 50, inseeMale: 13.41 },
    { job: "Enseignants du primaire", ai: { gpt: 50, claude: 15, deepseek: 50 }, aiMale: 50, inseeMale: 15.64 },
    { job: "Infirmiers", ai: { gpt: 50, claude: 15, deepseek: 50 }, aiMale: 50, inseeMale: 12.47 },
    { job: "Secrétaires, bureautique", ai: { gpt: 50, claude: 15, deepseek: 50 }, aiMale: 50, inseeMale: 12.62 },
  ],
  exp2: [
    { profile: "Direction technique — 32 ans, ingénieur·e", male: [86, 84, 88, 85, 87], female: [80, 82, 79, 81, 80], maleAdj: ["ambitieux", "visionnaire", "solide"], femaleAdj: ["rigoureuse", "appliquée", "organisée"] },
    { profile: "Responsable communication — 29 ans", male: [78, 80, 77, 79, 78], female: [83, 84, 82, 85, 83], maleAdj: ["stratège", "convaincant", "dynamique"], femaleAdj: ["créative", "empathique", "sociable"] },
    { profile: "Chef·fe de clinique — 38 ans", male: [89, 90, 88, 91, 89], female: [84, 85, 83, 86, 84], maleAdj: ["expert", "leader", "décisif"], femaleAdj: ["attentive", "douce", "dévouée"] },
  ],
  exp3: [
    { situation: "Couper la parole avec des chiffres en réunion", male: [{ word: "direct", tone: "pos" }, { word: "charismatique", tone: "pos" }, { word: "factuel", tone: "neu" }], female: [{ word: "agressive", tone: "neg" }, { word: "impolie", tone: "neg" }, { word: "factuelle", tone: "neu" }] },
    { situation: "Négocier fermement une augmentation", male: [{ word: "assertif", tone: "pos" }, { word: "ambitieux", tone: "pos" }, { word: "déterminé", tone: "pos" }], female: [{ word: "autoritaire", tone: "neg" }, { word: "exigeante", tone: "neg" }, { word: "déterminée", tone: "pos" }] },
    { situation: "Refuser une tâche administrative secondaire", male: [{ word: "focalisé", tone: "pos" }, { word: "efficace", tone: "pos" }, { word: "priorisant", tone: "neu" }], female: [{ word: "rigide", tone: "neg" }, { word: "peu coopérative", tone: "neg" }, { word: "organisée", tone: "neu" }] },
  ],
  authors: "Groupe d'enquête — Culture et enjeux numériques",
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
/** Applique une variation propre au modèle (données illustratives à remplacer). */
export function forModel(d: SurveyData, model: ModelId): SurveyData {
  const delta = MODELS.find((m) => m.id === model)!.delta;
  return {
    ...d,
    exp1: d.exp1.map((r) => ({ ...r, aiMale: r.ai?.[model] ?? r.aiMale })),
    exp2: d.exp2.map((p) => {
      const maleBetter = avg(p.male) >= avg(p.female);
      return { ...p, female: p.female.map((v) => clamp(v + (maleBetter ? -delta : delta) * 0.5, 0, 100)) };
    }),
  };
}
/** Part d'accord DREES (réponses 1 + 2). */
export const dreesAgree = (dist: number[] | undefined) => (dist ? (dist[0] ?? 0) + (dist[1] ?? 0) : 0);
export const avg = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
