import { useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSurvey } from "@/lib/survey-store";
import { INSEE_SOURCE, type SurveyData, type Tone } from "@/lib/survey-data";

export function Prose({ title, kicker, children }: { title?: string; kicker?: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl space-y-5 px-6 py-10">
      {kicker && <div className="text-xs font-semibold uppercase tracking-widest text-primary">{kicker}</div>}
      {title && <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>}
      <div className="space-y-4 text-[15px] leading-relaxed text-foreground/90 [&_h2]:pt-4 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium">
        {children}
      </div>
    </article>
  );
}

export function IntroPage({ go }: { go: (id: string) => void }) {
  return (
    <>
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
        <div>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight md:text-5xl">
            Les IA conversationnelles ont-elles des préjugés de genre ?
          </h1>
        </div>
        <section className="space-y-4 text-[15px] leading-relaxed">
          <p>
            L'usage de l'intelligence articielle générative s'est généralisé au cours des cinq dernières années. En
            2026, deux tiers des Français déclarent utiliser l'intelligence articficielle, selon un sondage ELABE, et
            13% de la population envisagent de demander à un LLM pour qui voter.
          </p>
          <p>
            Plusieurs travaux se sont concentrés sur les biais de genre de ces systèmes. En 2024, une étude de l'UNESCO
            a montré que les modèles de langage associaient plus souvent les prénoms féminins aux concepts de « maison
            », « famille » et « enfants », et les prénoms masculins à ceux de « carrière », « salaire » et « direction
            ». Dans le même temps, les éditeurs affirment avoir corrigé ces travers par l'alignement (RLHF, filtres de
            sécurité).
          </p>
          <p>
            En effet, des techniques existent pour « cadrer » les LLM. Le Reinforcement Learning from Human Feedback
            (RLHF) consiste ainsi à demander à des salariés humains de comparer et noter les réponses de LLM. Les
            « filtres de sécurité » encadrent quant à eux le comportement du modèle, allant jusqu'à bloquer certaines
            réponses jugées inapropriées.
          </p>
          <p>
            Cette enquête, réalisée en français, cherche à vérifier ce qu'il en est sur trois modèles récents, en
            comparant leurs réponses à des références statistiques françaises (baromètre d'opinion de la DREES,
            recensement de l'INSEE). Nous nous concentrerons sur leurs versions gratuites les plus récentes, étant donné
            qu'il s'agit des versions les plus utilisées.
          </p>
        </section>
        <section className="space-y-4 text-[15px] leading-relaxed [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium">
        <h2>Quatre méthodes d'audit</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Benchmark de questions</b> : interroger directement le modèle sur des stéréotypes (Préambule).
          </li>
          <li>
            <b>Génération libre</b> : laisser le modèle produire sans contrainte et coder ses choix (Expérience 1).
          </li>
          <li>
            <b>Counterfactual testing</b> : prompts identiques où seule la variable genre change (Expériences 2 et 3).
          </li>
          <li>
            <b>Audit expérimental randomisé</b> : répétition des runs pour neutraliser l'aléa de génération.
          </li>
        </ul>
        </section>
        <section>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Organisation de l'enquête
          </div>
          <ol className="mt-3 space-y-1">
            {[
              ["exp0", "Préambule", "Adhésion aux stéréotypes explicites, comparée au baromètre DREES."],
              ["exp1", "Expérience 1", "Genre attribué spontanément à 12 métiers, comparé aux données INSEE."],
              ["exp2", "Expérience 2", "Notation de CV identiques signés Alexandre ou Alexandra."],
              ["exp3", "Expérience 3", "Qualification d'un même comportement selon le genre de la personne."],
            ].map(([id, n, t]) => (
              <li key={id}>
                <button
                  onClick={() => go(id!)}
                  className="flex w-full gap-3 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent"
                >
                  <span className="w-24 shrink-0 font-semibold text-primary">{n}</span>
                  <span>{t}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
export function PendingPage({ title, note = "Résultats en cours de collecte. Cette page sera complétée prochainement." }: { title: string; note?: string }) {
  return (
    <Prose title={title}>
      <p className="text-muted-foreground">{note}</p>
    </Prose>
  );
}

export function MethodPage() {
  return (
    <Prose kicker="Méthodologie" title="Démarche et protocole allégé">
      <p>
        Le protocole a été conçu pour être reproductible avec des moyens étudiants, via les interfaces publiques des
        modèles.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Nouvelle session (historique vidé) pour chaque prompt, afin d'éviter toute contamination contextuelle.</li>
        <li>
          5 runs par condition pour l'audit CV, 20 biographies par métier et par IA pour l'expérience 1 (240 par
          modèle).
        </li>
        <li>
          Codage manuel du genre des prénoms et de la tonalité des adjectifs (positif / neutre / négatif), en double
          aveugle.
        </li>
        <li>Comparaison avec des références externes : baromètre d'opinion DREES, statistiques d'emploi INSEE.</li>
      </ul>
      <h2>Limites</h2>
      <p>
        Échantillon réduit, versions de modèles évolutives, dépendance à la formulation des prompts. Les résultats sont
        exploratoires et ont valeur d'illustration critique, non de mesure définitive.
      </p>
      <h2>Fiche technique des relevés</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-y text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr className="border-b">
              <th className="py-2 pr-4 font-semibold">Modèle</th>
              <th className="py-2 pr-4 font-semibold">Accès</th>
              <th className="py-2 pr-4 font-semibold">Paramètres</th>
              <th className="py-2 font-semibold">Relevés</th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {[
              ["GPT 6", "interface web"],
              ["Claude Sonnet 5.5 (moyen)", "interface web"],
              ["DeepSeek V4.1-Flash", "interface web"],
            ].map(([m, a]) => (
              <tr key={m} className="border-b last:border-0">
                <td className="py-2 pr-4 font-sans text-sm">{m}</td>
                <td className="py-2 pr-4">{a}</td>
                <td className="py-2 pr-4">par défaut, sans historique</td>
                <td className="py-2 text-muted-foreground">à compléter</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Références</h2>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/80">
        <li>
          Bolukbasi T. et al. (2016), « Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word
          Embeddings », <i>NeurIPS</i>.
        </li>
        <li>
          Bender E. M., Gebru T. et al. (2021), « On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?
          », <i>FAccT</i>.
        </li>
        <li>
          Kotek H., Dockum R., Sun D. (2023), « Gender bias and stereotypes in Large Language Models »,{" "}
          <i>ACM Collective Intelligence</i>.
        </li>
        <li>
          UNESCO, IRCAI (2024),{" "}
          <i>
            Challenging Systematic Prejudices: an Investigation into Bias Against Women and Girls in Large Language
            Models
          </i>
          .
        </li>
        <li>
          Bertrand M., Mullainathan S. (2004), « Are Emily and Greg More Employable than Lakisha and Jamal? »,{" "}
          <i>American Economic Review</i>.
        </li>
        <li>DREES, Baromètre d'opinion (édition annuelle).</li>
        <li>{INSEE_SOURCE}</li>
      </ol>
    </Prose>
  );
}
export function BilanPage() {
  return (
    <Prose kicker="Synthèse & Enjeux" title="Alignement de surface, biais latents">
      <p>
        Notre test préliminaire et nos trois expériences dessinent un paradoxe. Face à une question explicite
        (Préambule), les modèles se montrent <b>plus égalitaires que la population française</b>. Mais dès que le genre
        n'est plus l'objet apparent du prompt — une biographie, un CV, un jugement en réunion (Expériences 1 à 3) — les
        stéréotypes réapparaissent, parfois amplifiés.
      </p>
      <h2>Deux couches</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <b>La surface</b> : RLHF et filtres apprennent au modèle à reconnaître les questions sensibles et à y répondre
          de façon normée.
        </li>
        <li>
          <b>La profondeur</b> : les distributions de probabilité apprises lors du pré-entraînement restent intactes et
          gouvernent la génération libre.
        </li>
      </ul>
      <h2>Enjeux</h2>
      <p>
        Les LLM sont déjà utilisés pour trier des CV, rédiger des évaluations, produire des contenus pédagogiques. Un
        biais invisible aux tests déclaratifs peut ainsi s'automatiser à grande échelle. L'AI Act européen classe le
        recrutement parmi les usages « à haut risque » : nos résultats plaident pour des audits <b>comportementaux</b>,
        et non seulement déclaratifs.
      </p>
    </Prose>
  );
}

const csv = (a: string[]) => a.join(", ");
const uncsv = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const adjStr = (a: { word: string; tone: Tone }[]) => a.map((x) => `${x.word}:${x.tone}`).join(", ");
const unAdj = (s: string) =>
  uncsv(s).map((x) => {
    const [w = "", t = ""] = x.split(":");
    return { word: w.trim(), tone: (["pos", "neg", "neu"].includes(t.trim()) ? t.trim() : "neu") as Tone };
  });

export function downloadJson(data: SurveyData) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "prompt-prejuges-donnees.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function EditorPage() {
  const { data, setData, reset } = useSurvey();
  const [d, setD] = useState<SurveyData>(data);
  const up = (fn: (x: SurveyData) => void) =>
    setD((prev) => {
      const n = structuredClone(prev);
      fn(n);
      return n;
    });
  const num = (v: string) => Math.max(0, Math.min(100, Number(v) || 0));

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">Injection de données</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Éditeur de données</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Remplacez les valeurs par défaut par vos résultats réels. Elles sont enregistrées dans ce navigateur. Les
          variations entre modèles sont appliquées automatiquement à partir de ces valeurs.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setData(d);
              toast.success("Données enregistrées");
            }}
          >
            Enregistrer
          </Button>
          <Button variant="outline" onClick={() => downloadJson(d)}>
            <Download className="size-4" />
            Exporter JSON
          </Button>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="size-4" />
              Importer JSON
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  try {
                    const j = JSON.parse(await f.text());
                    setD(j);
                    setData(j);
                    toast.success("Importé");
                  } catch {
                    toast.error("Fichier invalide");
                  }
                }}
              />
            </label>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              location.reload();
            }}
          >
            <RotateCcw className="size-4" />
            Valeurs par défaut
          </Button>
        </div>
      </div>

      <Section title="Auteurs">
        <Input
          value={d.authors}
          onChange={(e) =>
            up((x) => {
              x.authors = e.target.value;
            })
          }
        />
      </Section>

      <Section title="Préambule — Affirmation, puis répartition DREES (%) des réponses 1 à 4">
        {d.exp0.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_repeat(4,60px)] items-center gap-2">
            <Input
              value={s.statement}
              onChange={(e) =>
                up((x) => {
                  x.exp0[i]!.statement = e.target.value;
                })
              }
            />
            {[0, 1, 2, 3].map((k) => (
              <Input
                key={k}
                type="number"
                aria-label={`Réponse ${k + 1} (%)`}
                value={s.dist[k] ?? 0}
                onChange={(e) =>
                  up((x) => {
                    x.exp0[i]!.dist[k] = num(e.target.value);
                  })
                }
              />
            ))}
          </div>
        ))}
      </Section>

      <Section title="Expérience 1 — % d'hommes : GPT / Claude / DeepSeek / INSEE">
        {d.exp1.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_60px_60px_60px_60px] items-center gap-2">
            <Input
              value={r.job}
              onChange={(e) =>
                up((x) => {
                  x.exp1[i]!.job = e.target.value;
                })
              }
            />
            {(["gpt", "claude", "deepseek"] as const).map((m) => (
              <Input
                key={m}
                type="number"
                title={m}
                value={r.ai[m]}
                onChange={(e) =>
                  up((x) => {
                    x.exp1[i]!.ai[m] = num(e.target.value);
                  })
                }
              />
            ))}
            <Input
              type="number"
              value={r.inseeMale}
              onChange={(e) =>
                up((x) => {
                  x.exp1[i]!.inseeMale = num(e.target.value);
                })
              }
            />
          </div>
        ))}
      </Section>

      <Section title="Expérience 2 — Notes des 5 runs et adjectifs">
        {d.exp2.map((p, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-3">
            <Input
              value={p.profile}
              onChange={(e) =>
                up((x) => {
                  x.exp2[i]!.profile = e.target.value;
                })
              }
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="Notes Alexandre"
                defaultValue={csv(p.male.map(String))}
                onBlur={(e) =>
                  up((x) => {
                    x.exp2[i]!.male = uncsv(e.target.value).map(num);
                  })
                }
              />
              <Input
                placeholder="Notes Alexandra"
                defaultValue={csv(p.female.map(String))}
                onBlur={(e) =>
                  up((x) => {
                    x.exp2[i]!.female = uncsv(e.target.value).map(num);
                  })
                }
              />
              <Input
                value={csv(p.maleAdj)}
                onChange={(e) =>
                  up((x) => {
                    x.exp2[i]!.maleAdj = uncsv(e.target.value);
                  })
                }
              />
              <Input
                value={csv(p.femaleAdj)}
                onChange={(e) =>
                  up((x) => {
                    x.exp2[i]!.femaleAdj = uncsv(e.target.value);
                  })
                }
              />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Expérience 3 — Adjectifs (format mot:pos|neu|neg)">
        {d.exp3.map((s, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-3">
            <Input
              value={s.situation}
              onChange={(e) =>
                up((x) => {
                  x.exp3[i]!.situation = e.target.value;
                })
              }
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                defaultValue={adjStr(s.male)}
                onBlur={(e) =>
                  up((x) => {
                    x.exp3[i]!.male = unAdj(e.target.value);
                  })
                }
              />
              <Input
                defaultValue={adjStr(s.female)}
                onBlur={(e) =>
                  up((x) => {
                    x.exp3[i]!.female = unAdj(e.target.value);
                  })
                }
              />
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}
