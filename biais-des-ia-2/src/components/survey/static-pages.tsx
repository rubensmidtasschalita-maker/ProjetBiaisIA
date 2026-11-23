import { useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSurvey } from "@/lib/survey-store";
import { type ModelId, type SurveyData, type Tone } from "@/lib/survey-data";
import { cn } from "@/lib/utils";
import { ModelLogo } from "./logos";

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
            L'usage de l'intelligence artificielle générative s'est généralisé au cours des cinq dernières années. En 2026, deux tiers des Français déclarent utiliser l'intelligence artificielle, selon un sondage ELABE, et
            13% de la population envisagent de demander à un LLM (Large Language Model) pour qui voter.
          </p>
          <p>
            Plusieurs travaux se sont concentrés sur les biais de genre de ces systèmes. En 2024, une étude de l'UNESCO
            a montré que les modèles de langage associaient plus souvent les prénoms féminins aux concepts de « maison
            », « famille » et « enfants », et les prénoms masculins à ceux de « carrière », « salaire » et « direction
            ». Dans le même temps, les éditeurs affirment avoir corrigé ces travers par l'alignement (RLHF, filtres de
            sécurité, pré-prompts).
          </p>
          <p>
            En effet, des techniques existent pour « cadrer » les LLM. Le Reinforcement Learning from Human Feedback
            (RLHF), ou apprentissage par renforcement à partir de retours humains, se déroule en deux temps. D'abord,
            des équipes d'annotateurs, souvent salariés de sous-traitants, rédigent des réponses modèles puis comparent
            et classent plusieurs réponses du LLM à une même question. Ces classements servent à entraîner un « modèle
            de récompense », qui apprend à prédire la réponse qu'un humain préférerait. Le LLM est ensuite ajusté pour
            maximiser le score attribué à ses réponses.
          </p>
          <p>
            Les utilisateurs finaux participent aussi, plus discrètement, à ce processus. Les boutons « pouce en haut »
            et « pouce en bas » placés sous certaines réponses permettent d'évaluer le modèle en direct. Certains outils
            proposent aussi de choisir sa réponse préférée parmi deux réponses. En outre, sauf désactivation dans les
            paramètres, les historiques de conversation des versions grand public peuvent être réutilisés pour
            réentraîner les modèles. 
          </p>
          <p>
            Les « filtres de sécurité » encadrent quant à eux le comportement du modèle. Certains prompts ou certaines
            réponses jugés inappropriés peuvent ainsi être bloqués au moment de l'utilisation du modèle.
          </p>
          <p>
            Enfin, les LLM sont encadrés par des "pré-prompts", c'est-à-dire des instructions préalables invisibles pour
            l'utilisateur. Par exemple, selon des fuites, ChatGPT 5.6 Sol reçoit dans son pré-prompt l'ordre de
            "refuser poliment sans proposer de suggestion" si l'utilisateur lui demande "une requête qui viole la
            politique de contenu" d'OpenAI. Il lui est également demandé de "représenter au mieux OpenAI et ses valeurs". 
          </p>
          <p>
            Cette enquête, réalisée en français, porte sur trois modèles : <b>GPT 6</b> (OpenAI, via ChatGPT),{" "}
            <b>Claude Sonnet 5.5</b> en effort de raisonnement moyen (Anthropic) et <b>DeepSeek V4.1-Flash</b>{" "}
            (DeepSeek). Il s'agit à chaque fois de la version gratuite grand public la plus récente disponible au moment des
            tests, puisque ce sont les versions les plus utilisées. Leurs réponses sont comparées à des références
            statistiques françaises (baromètre d'opinion de la DREES, recensement de l'INSEE).
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
              ["exp2", "Expérience 2", "Notation de CV identiques signés par un homme ou par une femme."],
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
    <Prose kicker="Méthodologie" title="Démarche et protocole">
      <p>
        Nous avons mené nos expériences via les interfaces publiques et gratuites des modèles. Avant tout relevé, des précautions ont été prises pour que les réponses obtenues ne
        soient influencées ni par nos échanges précédents, ni par un profil d'utilisateur déjà constitué.
      </p>
      <h2>Précautions préalables</h2>
      <p>
        Les modèles grand public disposent d'une mémoire. Ils conservent des informations issues des
        conversations passées et adaptent leurs réponses en conséquence. Pour neutraliser ce biais, chaque modèle a été
        réglé avant les tests, et l'ensemble des relevés a été conduit depuis le navigateur DuckDuckGo, qui limite le
        pistage et la personnalisation.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <b>ChatGPT (GPT 6)</b> : désactivation de la mémoire, pour que le modèle ne conserve rien d'une session à
          l'autre.
        </li>
        <li>
          <b>Claude (Sonnet 5.5, effort moyen)</b> : désactivation de la mémoire dans les paramètres
        </li>
        <li>
          <b>DeepSeek (V4.1-Flash)</b> : désactivation dans les paramètres de la réutilisation de nos contenus, et suppression de tous les dialogues après chaque session, puis export des données du compte et vérification que le fichier .json obtenu est bien vide.
        </li>
        <li>
          <b>Comptes multiples</b> : pour chaque IA, plusieurs comptes ad hoc, distincts et non liés entre eux, ont
          été utilisés afin d'éviter qu'un historique résiduel ou un profil commun ne fausse les comparaisons.
        </li>
      </ul>
      <h2>Déroulement des relevés</h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Nouvelle session (historique vidé) pour chaque prompt, afin d'éviter toute contamination contextuelle.</li>
        <li>
          5 runs par condition pour l'audit CV, 20 biographies par métier et par IA pour l'expérience 1 (240 par
          modèle).
        </li>
        <li>
          Codage du genre des prénoms et de la tonalité des adjectifs (positif / neutre / négatif), cette dernière
          arbitrée par un modèle externe (Mistral Large) selon un protocole « LLM-as-a-Judge ».
        </li>
        <li>Comparaison avec des références externes : baromètre d'opinion DREES, statistiques d'emploi INSEE.</li>
      </ul>
      <h2>Fiche technique des relevés</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-y text-sm">
          <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr className="border-b">
              <th className="py-2 pr-4 font-semibold">Modèle</th>
              <th className="py-2 pr-4 font-semibold">Accès</th>
              <th className="py-2 pr-4 font-semibold">Mémoire</th>
              <th className="py-2 font-semibold">Comptes</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {[
              ["GPT 6 (ChatGPT)", "interface web gratuite", "mémoire désactivée", "plusieurs comptes ad hoc"],
              ["Claude Sonnet 5.5 (moyen)", "interface web gratuite", "mémoire désactivée", "plusieurs comptes ad hoc"],
              ["DeepSeek V4.1-Flash", "interface web gratuite", "contenu non réutilisé, dialogues supprimés et vérifiés", "plusieurs comptes ad hoc"],
            ].map(([m, a, mem, c]) => (
              <tr key={m} className="border-b last:border-0">
                <td className="py-2 pr-4 text-sm">{m}</td>
                <td className="py-2 pr-4">{a}</td>
                <td className="py-2 pr-4">{mem}</td>
                <td className="py-2 text-muted-foreground">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">{"\n"}</p>
    </Prose>
  );
}
const VERDICT = {
  confirme: { label: "Confirmé", cls: "bg-positive/10 text-positive border-positive/30" },
  nuance: { label: "Nuancé", cls: "bg-accent text-accent-foreground border-border" },
  infirme: { label: "Non reproduit", cls: "bg-negative/10 text-negative border-negative/30" },
} as const;

const CONFRONTATIONS: { exp: string; theme: string; litt: string; obs: string; verdict: keyof typeof VERDICT }[] = [
  {
    exp: "Préambule", theme: "Stéréotypes explicites",
    litt: "L'alignement par RLHF (Ouyang et al., 2022) apprend aux modèles à refuser ou neutraliser les affirmations discriminatoires lorsqu'elles sont formulées explicitement.",
    obs: "GPT 6 et Claude rejettent les 4 clichés (note 4/4) et approuvent la parité scientifique (1/4). DeepSeek refuse de noter. Les répondants DREES adhèrent en moyenne à 36 % aux 4 clichés et les IA à 0 %.",
    verdict: "confirme",
  },
  {
    exp: "Expérience 1", theme: "Genre attribué aux métiers",
    litt: "Kotek et al. (2023) et l'UNESCO (2024) montrent que les LLM associent les métiers à un genre et amplifient souvent les écarts réels.",
    obs: "GPT 6 et DeepSeek imposent 10 hommes / 10 femmes dans les 12 métiers, effaçant la réalité (12,5 % d'hommes infirmiers, 80,9 % chez les ingénieurs informatique). Claude reproduit la ségrégation : 85 % de femmes infirmières, 70 % d'hommes chefs d'entreprise.",
    verdict: "nuance",
  },
  {
    exp: "Expérience 2", theme: "Évaluation de CV",
    litt: "Armstrong et al. (2024, « The Silicon Ceiling ») et l'enquête Reuters sur l'outil d'Amazon (Dastin, 2018) documentent des écarts de notation au détriment des candidates.",
    obs: "Aucune pénalité systématique observée pour les femmes. Écart moyen en faveur des candidates : −1,4 pt (GPT 6), −0,2 pt (Claude), +4,4 pts (DeepSeek, jusqu'à +10 pts pour la développeuse). Les adjectifs semblent peu genrés.",
    verdict: "infirme",
  },
  {
    exp: "Expérience 3", theme: "Jugement d'un même comportement",
    litt: "La sociologie du travail décrit un double standard : l'homme jugé « direct », la femme « agressive » pour le même comportement (UNESCO/IRCAI, 2024).",
    obs: "Les écarts sont plutôt en faveur d'Alexandra, qui obtient plus d'adjectifs positifs et moins d'adjectifs négatifs, en particulier avec DeepSeek.",
    verdict: "infirme",
  },
];

export function BilanPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 md:px-6">
      <header>
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">{"\n"}</div>
        <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight">Bilan critique : la littérature face à nos résultats</h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        {[["4", "tests menés"], ["3", "modèles audités"], ["1 sur 4", "biais de la littérature confirmé tel quel"], ["2 sur 4", "biais inversés ou absents"]].map(([v, l]) => (
          <div key={l} className="rounded-md border bg-card p-4">
            <div className="font-serif text-3xl font-medium">{v}</div>
            <div className="mt-1 text-xs text-muted-foreground">{l}</div>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-medium">Confrontation à la littérature test par test</h2>
        {CONFRONTATIONS.map((c) => (
          <article key={c.exp} className="overflow-hidden rounded-md border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-4 py-3">
              <div><span className="text-xs font-semibold uppercase tracking-wider text-primary">{c.exp}</span><span className="ml-2 font-medium">{c.theme}</span></div>
              <span className={cn("rounded-full border px-3 py-0.5 text-xs font-semibold", VERDICT[c.verdict].cls)}>{VERDICT[c.verdict].label}</span>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="p-4">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ce que dit la littérature</div>
                <p className="text-sm leading-relaxed">{c.litt}</p>
              </div>
              <div className="border-t bg-secondary/40 p-4 md:border-l md:border-t-0">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Ce que nous avons observé</div>
                <p className="text-sm leading-relaxed">{c.obs}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-medium">Trois profils différents</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["gpt", "GPT 6", "Neutralisation affichée", "Parité stricte imposée, mais un ordre de citation (homme d'abord pour la direction, femme d'abord pour le soin) et des loisirs qui restent genrés."],
            ["claude", "Claude Sonnet 5.5 (moyen)", "Miroir statistique", "Reproduit la répartition genrée des métiers, tout en restant le plus stable sur les CV (écart ≤ 1 pt)."],
            ["deepseek", "DeepSeek V4.1-Flash", "Correction inversée", "Avantage les candidates (+4,4 pts) et juge Alexandra beaucoup plus favorablement qu'Alexandre."],
          ].map(([id, n, tag, txt]) => (
            <div key={id} className="rounded-md border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-medium"><ModelLogo model={id as ModelId} className="size-4" />{n}</div>
              <span className="mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold text-primary">{tag}</span>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{txt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-md border bg-card p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">PRÉNOTION COURANTE</div>
          <p className="mt-2 font-serif text-lg">Les LLM reproduisent et amplifient les stéréotypes de genre présents dans leurs données.</p>
        </div>
        <div className="rounded-md border border-primary/40 bg-primary/5 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Ce que montrent nos données</div>
          <p className="mt-2 font-serif text-lg">L'alignement supprime les formulations discriminatoires explicites et peut inverser la tendance en faveur des candidates. En revanche, la parité affichée ne coïncide pas avec la répartition réelle des métiers, et des marqueurs secondaires (ordre de citation, loisirs, lexique) restent genrés.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-medium">Comment expliquer ces résultats ?</h2>
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {[
            ["L'alignement corrige la réponse", "Le RLHF (Ouyang et al., 2022) récompense une réponse conforme aux consignes d'égalité. Un modèle apprend ainsi à écarter les formulations discriminatoires explicites, ce qui explique les résultats du préambule. Les co-occurrences accumulées pendant le pré-entraînement (prénoms, métiers, loisirs) restent en revanche inscrites dans les poids du réseau et ressurgissent dès qu'aucune consigne n'est activée (ordre de citation, choix des loisirs, lexique)."],
            ["La parité ne correspond pas nécessairement à la réalité", "La réponse équitable est généralement favorisée, mais la réalité ne l'est pas nécessairement. GPT 6 et DeepSeek tentent d'être paritaires dans l'expérience 1 (10 hommes / 10 femmes), ce qui produit une distribution plus éloignée des chiffres INSEE que celle de Claude. Il convient alors de savoir si un modèle doit refléter la réalité ou bien imaginer un monde paritaire. Claude cherche ainsi plus que les autres à rester fidèle à la réalité."],
            ["Une correction qui peut dépasser l'égalité", "DeepSeek tend à avantager les candidates. On peut l'analyser comme une sur-correction. Afin de ne pas reproduire la pénalité historique documentée par Dastin (2018) ou Armstrong et al. (2024), le modèle déplace l'évaluation dans l'autre sens. L'écart reste modeste (moins de 5 points) mais on peut l'observer de manière quasi-systématique dans nos expériences."],
            ["Trois modèles différents", "Les modèles que nous avons testés donnent des réponses différentes. Ils n'ont pas les mêmes données d'entraînement ou la même procédure d'alignement. Sur un prompt identique, les écarts entre modèles se révèlent parfois plus larges que les écarts entre hommes et femmes. Le choix du LLM a ainsi un impact mesurable sur les biais auxquels l'utilisateur s'expose."],
          ].map(([t, b]) => (
            <div key={t}>
              <h3 className="font-serif text-lg font-medium">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-primary/40 bg-primary/5 p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Conclusion</div>
        <p className="mt-2 text-sm leading-relaxed">
          Les modèles que nous avons testés ne semblent pas reproduire systématiquement les stéréotypes de genre présents dans leurs données. Sur les jugements explicites, leur alignement les fait basculer du côté de l'égalité, souvent au-delà de la réalité mesurée ou de l'opinion du Français moyen. L'égalité affichée n'équivaut cependant pas à l'absence de biais. En effet, la parité imposée par GPT 6 et DeepSeek s'écarte davantage des chiffres INSEE que la répartition produite par Claude, et des marqueurs secondaires comme les loisirs restent très genrés.
        </p>
      </section>
    </div>
  );
}

export function LimitesPage() {
  const items = [
    {
      n: "01", title: "Données d'entraînement", tag: "Contexte culturel",
      body: [
        "Les trois modèles testés sont principalement entraînés sur des données américaines ou chinoises. Leurs représentations des métiers, des prénoms, des comportements professionnels, des loisirs... reflètent donc des données qui ne correspondent pas forcément à la société française.",
        "Nous avons cependant choisi de comparer les réponses aux données françaises (INSEE, Recensement 2023 ; baromètre d'opinion de la DREES), puisque c'était là l'objet précis de notre enquête. Nous avons mené cette enquête en ayant en tête l'utilisateur français moyen. Néanmoins, une partie des résultats peut s'expliquer par des différences culturelles plus que par un biais de genre.",
      ],
    },
    {
      n: "02", title: "Biais de tokenisation et variations aléatoires", tag: "Sensibilité au prompt",
      body: [
        "Un LLM ne travaille pas avec des mots mais avec des tokens, qui sont de courtes séquences de caractères associées à un identifiant numérique, sélectionnées par l'algorithme BPE (Byte Pair Encoding) selon leur fréquence dans le corpus. Ce dictionnaire est cependant optimisé pour l'anglais, et un texte français est découpé en plus de fragments. Chaque réponse est en outre générée token par token à partir de probabilités.",
        "Une formulation légèrement différente de nos prompts aurait donc produit une autre suite de tokens et modifié les probabilités de complétion. Nous aurions peut-être obtenu des résultats légèrement différents. Néanmoins, nous avons répété les expériences à de nombreuses reprises pour déceler les régularités derrière les variations aléatoires, ce qui permet à nos résultats de tenir, et de ne pas simplement refléter le hasard des réponses des LLM.",
      ],
      source: { label: "Cavallo, N. (2026). « IA générative : les mathématiques cachées derrière ChatGPT ». Tangente, n° 232, « L'IA va-t-elle tuer les maths ? », novembre 2026.", url: "https://tangente-mag.com/articles/dans-les-coulisses-d-une-ia-generative" },
    },
  ];
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-6">
      <header>
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">{"\n"}</div>
        <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight">Limites de l'enquête</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Plusieurs limites tempèrent l'étendue de la validité des résultats que nous avons observés.</p>
      </header>
      {items.map((it) => (
        <article key={it.n} className="rounded-md border bg-card">
          <div className="flex items-baseline gap-4 border-b px-5 py-4">
            <span className="font-serif text-3xl text-primary">{"\n"}</span>
            <h2 className="flex-1 font-serif text-xl font-medium">{it.title}</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{it.tag}</span>
          </div>
          <div className="space-y-3 px-5 py-4 text-sm leading-relaxed">
            {it.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
            {it.source && (
              <p className="pt-2 text-xs text-muted-foreground">Source : <a href={it.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">{it.source.label}</a></p>
            )}
          </div>
        </article>
      ))}
    </div>
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
type Source = { text: string; url?: string };

function SourceCategory({ title, intro, sources }: { title: string; intro: string; sources: Source[] }) {
  return (
    <section className="space-y-3">
      <h2 className="pt-4 font-serif text-xl font-medium">{title}</h2>
      <p className="text-[15px] leading-relaxed text-foreground/90">{intro}</p>
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/90">
        {sources.map((s, i) => (
          <li key={i}>
            {s.text}
            {s.url && (
              <>
                {" "}
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80">
                  {s.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SourcesPage() {
  return (
    <Prose title="Sources" kicker="Références bibliographiques">
      <p>
        Cette page rassemble l'ensemble des travaux, données et articles mobilisés dans le cadre de cette enquête,
        classés par catégorie.
      </p>

      <SourceCategory
        title="Données statistiques de référence"
        intro={"\n"}
        sources={[
          { text: "DREES (2020). Des stéréotypes de genre encore très ancrés. Études et Résultats, Direction de la recherche, des études, de l'évaluation et des statistiques.", url: "https://drees.solidarites-sante.gouv.fr/publications-communique-de-presse/etudes-et-resultats/des-stereotypes-de-genre-encore-tres-ancres" },
          { text: "Elabe (2026). Les Français et l'Intelligence Artificielle. Sondage réalisé pour la Région Hauts-de-France, 12 juin 2026." },
          { text: "Insee (2026). Recensement de la population 2023, fichier détail (IPONDI, nomenclature PCS 2020). Institut national de la statistique et des études économiques." },
        ]}
      />

      <SourceCategory
        title="Cadre théorique et sociologie de l'IA"
        intro={"\n"}
        sources={[
          { text: "Crawford, K. (2016). Artificial Intelligence's 'White Guy' Problem. The New York Times, 26 juin 2016.", url: "https://www.nytimes.com/2016/06/26/opinion/sunday/artificial-intelligences-white-guy-problem.html" },
          { text: "Davat, A. (2025). « Biais ». Dans T. Ménissier (dir.), Vocabulaire critique de l'intelligence artificielle (p. 41-49). Paris, Hermann.", url: "https://doi.org/10.3917/herm.menis.2025.01.0041" },
          { text: "Davat, A. (2025). « Genre(s) ». Dans T. Ménissier (dir.), Vocabulaire critique de l'intelligence artificielle (p. 149-160). Paris, Hermann.", url: "https://shs.cairn.info/vocabulaire-critique-de-lintelligence-artificielle--9791037045843-page-149?lang=fr" },
          { text: "Nurock, V. (2019). L'intelligence artificielle a-t-elle un genre ? Cités, 80(4), 61-74.", url: "https://doi.org/10.3917/cite.080.0061" },
          { text: "Ouyang, L. et al. (2022). Training Language Models to Follow Instructions with Human Feedback. NeurIPS 2022 — article de référence sur l'alignement par apprentissage par renforcement à partir de retours humains (RLHF), cité dans l'avant-propos.", url: "https://arxiv.org/abs/2203.02155" },
          { text: "Tangente, n° 232 (novembre-décembre 2026). Dossier sur l'intelligence artificielle." },
          { text: "Vicomte, P. et Salinesi, C. (2025). Vers une intelligence artificielle « gender by design » ? Annales des Mines - Enjeux numériques, 29(1), 106-110.", url: "https://doi.org/10.3917/ennu.029.0106" },
          { text: "Zheng, L. et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena. NeurIPS 2023 — protocole « LLM-as-a-Judge » utilisé pour l'arbitrage de la polarité des adjectifs (juge : Mistral Large).", url: "https://arxiv.org/abs/2306.05685" },
        ]}
      />

      <SourceCategory
        title="Études et audits empiriques"
        intro="Les enquêtes quantitatives et révélations documentant concrètement les biais de genre dans les systèmes automatisés, des moteurs de recherche aux LLM."
        sources={[
          { text: "An, J., Huang, D., Lin, C. et Tai, M. (2025). Measuring gender and racial biases in large language models: Intersectional evidence from automated resume evaluation. PNAS Nexus, 4(3), pgaf089.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11937954/" },
          { text: "Armstrong, L., Liu, A., MacNeil, S. et Metaxa, D. (2024). The Silicon Ceiling: Auditing GPT's Race and Gender Biases in Hiring. Proceedings of the 4th ACM Conference on Equity and Access in Algorithms, Mechanisms, and Optimization (EAAMO '24).", url: "https://dl.acm.org/doi/10.1145/3689904.3694699" },
          { text: "asgeirtj. system_prompts_leaks, compilation des fuites de pré-prompts des principaux modèles de langage. GitHub.", url: "https://github.com/asgeirtj/system_prompts_leaks" },
          { text: "Dastin, J. (2018). Amazon scraps secret AI recruiting tool that showed bias against women. Reuters, 10 octobre 2018.", url: "https://www.reuters.com/article/us-amazon-com-jobs-automation-insight/amazon-scraps-secret-ai-recruiting-tool-that-showed-bias-against-women-idUSKCN1MK08G/" },
          { text: "Geiger, R. S., O'Sullivan, F., Wang, E. et Lo, J. (2025). Asking an AI for salary negotiation advice is a matter of concern: Controlled experimental perturbation of ChatGPT for protected and non-protected group discrimination on a contextual task with no clear ground truth answers. PLOS ONE, 20(2), e0318500.", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0318500" },
          { text: "Kay, M., Matuszek, C. et Munson, S. A. (2015). Unequal Representation and Gender Stereotypes in Image Search Results for Occupations. Proceedings of the ACM Conference on Human Factors in Computing Systems (CHI '15), p. 3819-3828." },
          { text: "Parrish, A., Chen, A., Nangia, N., Padmakumar, V., Phang, J., Thompson, J., Htut, P. M. et Bowman, S. R. (2022). BBQ: A Hand-Built Bias Benchmark for Question Answering. Findings of the Association for Computational Linguistics: ACL 2022, p. 2086-2105.", url: "https://aclanthology.org/2022.findings-acl.165" },
          { text: "Rozado, D. (2025). Gender and Positional Biases in LLM-Based Hiring Decisions: Evidence from Comparative CV/Résumé Evaluations. PeerJ Computer Science.", url: "https://arxiv.org/abs/2505.17049" },
          { text: "Tronnier, F., Löbner, S., Azanbayev, A. et Walter, M. L. (2024). From Bias to Balance — A Systematic Literature Review on Gender Bias in AI. Pacific Asia Conference on Information Systems (PACIS 2024) Proceedings.", url: "https://www-scopus-com.scpo.idm.oclc.org/pages/publications/105026567278?origin=resultslist" },
          { text: "UNESCO et IRCAI (2024). Challenging Systematic Prejudices: An Investigation into Bias Against Women and Girls in Large Language Models. Paris, UNESCO.\n\n\n", url: "https://unesdoc.unesco.org/ark:/48223/pf0000388971.locale=en" },
        ]}
      />

    </Prose>
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
