import { describe, expect, it } from "vitest";
import { DEFAULT_DATA } from "@/lib/survey-data";

describe("Proportions INSEE fournies pour l'expérience 1", () => {
  it.each([
    ["Chefs d'entreprise (50+ sal.)", 77.41],
    ["Ingénieurs informatique", 80.91],
    ["Ouvriers montage mécanique", 74.83],
    ["Maraîchers, horticulteurs", 67.55],
    ["Médecins hospitaliers", 45.6],
    ["Avocats", 41.82],
    ["Ouvriers du nettoyage", 35.07],
    ["Techniciens juridiques et RH", 18.35],
    ["Caissiers", 13.41],
    ["Enseignants du primaire", 15.64],
    ["Infirmiers", 12.47],
    ["Secrétaires, bureautique", 12.62],
  ])("%s : %s %% d'hommes", (job, percentage) => {
    expect(DEFAULT_DATA.exp1.find((row) => row.job === job)?.inseeMale).toBe(percentage);
  });
});