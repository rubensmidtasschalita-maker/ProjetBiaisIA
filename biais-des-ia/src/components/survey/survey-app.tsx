import { useEffect, useState } from "react";
import {
  BookOpen, Database, FlaskConical, PanelLeft, Scale, MessageSquare,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SurveyProvider, useSurvey } from "@/lib/survey-store";
import { MODELS, avg, forModel, type SurveyData } from "@/lib/survey-data";
import { EXPERIMENTS } from "./experiments";
import { ModelAvatar, ModelBubble, UserBubble } from "./chat";
import { ModelLogo } from "./logos";
import { IntroPage, PendingPage } from "./static-pages";

// Pages masquées en attendant les résultats réels (contenu conservé dans le code).
const PENDING = ["exp2", "exp3", "bilan"];
import { cn } from "@/lib/utils";


const MODEL_METRIC: Record<string, { label: string; value: (d: SurveyData) => string }> = {
  exp1: { label: "Écart moyen avec la réalité INSEE (points d'hommes)", value: (d) => `${Math.round(avg(d.exp1.map((r) => Math.abs(r.aiMale - r.inseeMale))))} pts` },
  exp2: { label: "Écart moyen de note pour Alexandra (3 profils)", value: (d) => { const v = avg(d.exp2.map((p) => avg(p.female) - avg(p.male))); return `${v > 0 ? "+" : ""}${v.toFixed(1)} pts`; } },
};

export function SurveyApp() {
  return (
    <SurveyProvider>
      <Shell />
      <Toaster />
    </SurveyProvider>
  );
}

const NAV = [
  { group: "Avant-propos & Méthodologie", items: [{ id: "intro", title: "Avant-propos", icon: BookOpen }, { id: "method", title: "Méthodologie", icon: FlaskConical }] },
  { group: "Test préliminaire", items: EXPERIMENTS.slice(0, 1).map((e) => ({ id: e.id, title: e.menu, icon: MessageSquare })) },
  { group: "Expériences", items: EXPERIMENTS.slice(1).map((e) => ({ id: e.id, title: e.menu, icon: MessageSquare })) },
  { group: "Synthèse & Enjeux", items: [{ id: "bilan", title: "Bilan critique", icon: Scale }] },
];

function Shell() {
  const { model } = useSurvey();
  const [page, setPage] = useState("intro");
  const [open, setOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setOpen(false); }, []);
  const exp = EXPERIMENTS.find((e) => e.id === page);

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground print:hidden">
        {open && <div className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />}
        <aside className={cn("fixed z-40 flex h-full w-80 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground transition-all md:relative", open ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
          <div className="flex items-start justify-between gap-2 p-4">
            <div>
              <div className="text-lg font-semibold tracking-tight">Prompt <span className="text-primary">&</span> Préjugés</div>
            </div>
          </div>
          <nav className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{g.group}</div>
                {g.items.map((it) => (
                  <button key={it.id} onClick={() => { setPage(it.id); if (window.innerWidth < 768) setOpen(false); }}
                    className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent", page === it.id && "bg-sidebar-accent font-medium")}>
                    <it.icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{it.title}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="relative flex min-w-0 flex-1 flex-col">
          {!open && <button aria-label="Ouvrir le menu" onClick={() => setOpen(true)} className="absolute left-3 top-3 z-20 rounded-md border bg-background p-2 hover:bg-accent md:hidden"><PanelLeft className="size-4" /></button>}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {page === "method" ? <PendingPage title="Méthodologie" note="En cours de rédaction." /> : PENDING.includes(page) ? <PendingPage title={NAV.flatMap((g) => g.items).find((i) => i.id === page)?.title ?? ""} /> : exp ? <ExperimentView key={exp.id} id={exp.id} /> : <IntroPage go={setPage} />}
          </div>
        </main>
      </div>
      <PrintSummary />
    </>
  );
}

function ExperimentView({ id }: { id: string }) {
  const { data, model, setModel } = useSurvey();
  const exp = EXPERIMENTS.find((e) => e.id === id)!;
  const d = forModel(data, model);
  const modelName = MODELS.find((m) => m.id === model)!.name;
  const split = exp.split?.(d);
  const wide = split ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className="flex min-h-full flex-col">
      <div className={cn("mx-auto w-full flex-1 space-y-6 px-4 py-6 md:px-6", wide)}>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">{exp.subtitle}</div>
          <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight">{exp.title}</h1>
        </div>
        <dl className="grid gap-x-8 gap-y-4 border-y py-5 md:grid-cols-3">
          {([["Hypothèse", exp.hypothesis], ["Protocole", exp.protocol], ["Constat", exp.finding]] as const).map(([t, txt], i) => (
            <div key={t} className={cn(i > 0 && "md:border-l md:pl-8")}>
              <dt className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t}</dt>
              <dd className={cn("text-sm leading-relaxed", i === 2 && "font-serif text-base italic")}>{txt}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-md border bg-card/50">
          <div className="flex flex-wrap items-center justify-end gap-2 border-b px-3 py-2">
            <span className="text-xs text-muted-foreground">Réponse de :</span>
            <div className="flex rounded-xl border bg-muted/40 p-1">
              {MODELS.map((m) => (
                <button key={m.id} onClick={() => setModel(m.id)} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors", model === m.id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}><ModelLogo model={m.id} className="size-3.5" />{m.name}</button>
              ))}
            </div>
          </div>
          <div className="space-y-6 p-4 md:p-6">
            <UserBubble text={exp.prompt} replayKey={0} />
            {split && (
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Face-à-face — même question, seul le genre change</div>
                <div className="grid gap-4 md:grid-cols-2">
                  {([["male", split.maleLabel, split.male], ["female", split.femaleLabel, split.female]] as const).map(([k, label, node]) => (
                    <div key={k} className={cn("rounded-2xl border bg-card p-5", k === "male" ? "border-t-4 border-t-male" : "border-t-4 border-t-female")}>
                      <div className="mb-4 flex items-center gap-2"><ModelAvatar model={model} className="size-6" /><span className={cn("text-sm font-semibold", k === "male" ? "text-male" : "text-female")}>{label}</span></div>
                      <div className="text-sm">{node}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!split && <ModelBubble model={model}>{exp.response?.(d, modelName)}</ModelBubble>}
          </div>
        </div>

        <section className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-6">
            <h2 className="font-serif text-xl font-medium">Résultats et analyse</h2>
            <div className="flex items-center gap-2">
              {exp.id !== "exp0" && <span className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs"><ModelAvatar model={model} className="size-5" />Données pour : <b>{modelName}</b></span>}
            </div>
          </div>
          {MODEL_METRIC[exp.id] && (
            <div className="rounded-2xl border bg-card p-5">
              <div className="mb-3 text-sm font-semibold">{MODEL_METRIC[exp.id]!.label}</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {MODELS.map((m) => (
                  <button key={m.id} onClick={() => setModel(m.id)} className={cn("rounded-xl border p-3 text-left hover:bg-accent", m.id === model && "border-primary")}>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><ModelLogo model={m.id} className="size-3.5" />{m.name}</div>
                    <div className="text-xl font-semibold">{MODEL_METRIC[exp.id]!.value(forModel(data, m.id))}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {exp.analysis?.(d)}
        </section>
      </div>
    </div>
  );
}

function PrintSummary() {
  const { data, model } = useSurvey();
  const d = forModel(data, model);
  const name = MODELS.find((m) => m.id === model)!.name;
  return (
    <div className="hidden p-8 text-sm print:block">
      <h1 className="text-2xl font-bold">Prompt & Préjugés : Enquête sur les biais de genre dans les LLM</h1>
      <p className="text-muted-foreground">{data.authors} — Modèle : {name}</p>
      <h2 className="mt-6 text-lg font-semibold">Préambule : Adhésion aux stéréotypes explicites (DREES)</h2>
      <table className="w-full"><tbody>{d.exp0.map((s) => <tr key={s.statement} className="border-b"><td className="py-1">{s.statement}</td><td>DREES 1/2/3/4 : {s.dist.join(" / ")} %</td></tr>)}</tbody></table>
      <h2 className="mt-6 text-lg font-semibold">Expérience 1 — Attribution de genre par métier (% d'hommes)</h2>
      <table className="w-full"><tbody>{d.exp1.map((r) => <tr key={r.job} className="border-b"><td className="py-1">{r.job}</td><td>IA {r.aiMale}%</td><td>INSEE {r.inseeMale}%</td></tr>)}</tbody></table>
      <h2 className="mt-6 text-lg font-semibold">Expérience 2 — Évaluation comparative de CV</h2>
      <table className="w-full"><tbody>{d.exp2.map((p) => <tr key={p.profile} className="border-b"><td className="py-1">{p.profile}</td><td>Alexandre {avg(p.male).toFixed(1)} ({p.maleAdj.join(", ")})</td><td>Alexandra {avg(p.female).toFixed(1)} ({p.femaleAdj.join(", ")})</td></tr>)}</tbody></table>
      <h2 className="mt-6 text-lg font-semibold">Expérience 3 — Qualification de comportements sociaux</h2>
      <table className="w-full"><tbody>{d.exp3.map((s) => <tr key={s.situation} className="border-b"><td className="py-1">{s.situation}</td><td>H : {s.male.map((a) => a.word).join(", ")}</td><td>F : {s.female.map((a) => a.word).join(", ")}</td></tr>)}</tbody></table>
      <h2 className="mt-6 text-lg font-semibold">Bilan</h2>
      <p>L'alignement (RLHF, filtres) produit des réponses égalitaires aux questions explicites, mais les biais latents des distributions de probabilité réapparaissent en génération libre et en test contre-factuel, parfois amplifiés par rapport à la réalité statistique.</p>
    </div>
  );
}
