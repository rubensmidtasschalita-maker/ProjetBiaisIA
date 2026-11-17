import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_DATA, type ModelId, type SurveyData } from "./survey-data";

interface Store {
  data: SurveyData;
  setData: (d: SurveyData) => void;
  reset: () => void;
  model: ModelId;
  setModel: (m: ModelId) => void;
  dark: boolean;
  toggleDark: () => void;
}
const Ctx = createContext<Store | null>(null);
const KEY = "pp-survey-data-v5";

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<SurveyData>(DEFAULT_DATA);
  const [model, setModel] = useState<ModelId>("gpt");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDataState({ ...DEFAULT_DATA, ...JSON.parse(raw) });
      else {
        const previous = localStorage.getItem("pp-survey-data-v4");
        if (previous) {
          const saved: SurveyData = { ...DEFAULT_DATA, ...JSON.parse(previous) };
          const updated = {
            ...saved,
            exp1: saved.exp1.map((row) => ({
              ...row,
              inseeMale: DEFAULT_DATA.exp1.find((reference) => reference.job === row.job)?.inseeMale ?? row.inseeMale,
            })),
          };
          localStorage.setItem(KEY, JSON.stringify(updated));
          setDataState(updated);
        }
      }
      const t = localStorage.getItem("pp-theme");
      if (t) setDark(t === "dark");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const setData = (d: SurveyData) => {
    setDataState(d);
    localStorage.setItem(KEY, JSON.stringify(d));
  };
  return (
    <Ctx.Provider
      value={{
        data, setData, model, setModel, dark,
        reset: () => { localStorage.removeItem(KEY); setDataState(DEFAULT_DATA); },
        toggleDark: () => setDark((v) => { localStorage.setItem("pp-theme", v ? "light" : "dark"); return !v; }),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
export const useSurvey = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("SurveyProvider manquant");
  return c;
};
