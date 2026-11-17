import { useEffect, useState, type ReactNode } from "react";
import { MODELS, type ModelId } from "@/lib/survey-data";
import { cn } from "@/lib/utils";
import { ModelLogo } from "./logos";

export function ModelAvatar({ model, className }: { model: ModelId; className?: string }) {
  return (
    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full border bg-card text-primary", className)}>
      <ModelLogo model={model} className="size-[62%]" />
    </div>
  );
}

export function useTyping(text: string, replayKey: number, speed = 14) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (replayKey === 0) { setN(text.length); return; }
    setN(0);
    const id = setInterval(() => setN((v) => { if (v >= text.length) { clearInterval(id); return v; } return v + 1; }), speed);
    return () => clearInterval(id);
  }, [text, replayKey, speed]);
  return { shown: text.slice(0, n), done: n >= text.length };
}

export function UserBubble({ text, replayKey }: { text: string; replayKey: number }) {
  const { shown, done } = useTyping(text, replayKey);
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-3xl rounded-br-md bg-secondary px-5 py-3 text-[15px] leading-relaxed text-secondary-foreground">
        {shown}
        {!done && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle" />}
      </div>
    </div>
  );
}

export function ModelBubble({ model, children, hidden }: { model: ModelId; children: ReactNode; hidden?: boolean }) {
  const name = MODELS.find((m) => m.id === model)!.name;
  if (hidden)
    return (
      <div className="flex gap-3">
        <ModelAvatar model={model} />
        <div className="flex items-center gap-1 pt-2">
          {[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />)}
        </div>
      </div>
    );
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <ModelAvatar model={model} />
      <div className="min-w-0 flex-1 space-y-3 text-[15px] leading-relaxed">
        <div className="text-xs font-medium text-muted-foreground">{name}</div>
        {children}
      </div>
    </div>
  );
}

export function Reveal({ children, title = "Lecture" }: { children: ReactNode; title?: string }) {
  return (
    <div className="border-l-2 border-primary py-1 pl-5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">{title}</div>
      <div className="space-y-2 font-serif text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

export function ToneChip({ word, tone }: { word: string; tone: "pos" | "neg" | "neu" }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1 text-sm font-medium",
      tone === "pos" && "border-positive/40 bg-positive/10 text-positive",
      tone === "neg" && "border-negative/40 bg-negative/10 text-negative",
      tone === "neu" && "border-border bg-muted text-muted-foreground")}>
      {word}
    </span>
  );
}
