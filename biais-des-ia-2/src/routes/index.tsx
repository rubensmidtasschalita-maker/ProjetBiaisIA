import { createFileRoute } from "@tanstack/react-router";
import { SurveyApp } from "@/components/survey/survey-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prompt & Préjugés — Enquête sur les biais de genre dans les LLM" },
      { name: "description", content: "Restitution interactive d'une enquête universitaire sur les biais de genre dans GPT 6, Claude Sonnet 5.5 et DeepSeek V4.1-Flash." },
      { property: "og:title", content: "Prompt & Préjugés — Biais de genre dans les LLM" },
      { property: "og:description", content: "Cinq expériences pour révéler les stéréotypes de genre derrière l'alignement des IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SurveyApp,
});
