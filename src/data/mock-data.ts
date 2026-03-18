import type {
  Saegewerk,
  Bauer,
  Holzart,
  Gueteklasse,
  Staerkeklasse,
  Abrechnung,
  Durchschlagsblock,
  AufschlagConfig,
} from "@/lib/types";

// === Holzarten ===
export const HOLZARTEN: Holzart[] = [
  { code: "FITA", name: "Fichte/Tanne", gruppe: "Nadelholz" },
  { code: "FI", name: "Fichte", gruppe: "Nadelholz" },
  { code: "TA", name: "Tanne", gruppe: "Nadelholz" },
  { code: "LAE", name: "Lärche", gruppe: "Nadelholz" },
  { code: "KI", name: "Kiefer", gruppe: "Nadelholz" },
  { code: "BU", name: "Buche", gruppe: "Laubholz" },
  { code: "EI", name: "Eiche", gruppe: "Laubholz" },
];

// === Güteklassen (nach ÖHU 2006) ===
export const GUETEKLASSEN: Gueteklasse[] = [
  { code: "A", name: "A", beschreibung: "Überdurchschnittlich – fehlerfrei" },
  { code: "B", name: "B", beschreibung: "Normal / Gut" },
  { code: "C", name: "C", beschreibung: "Unterdurchschnittlich" },
  { code: "CX", name: "CX", beschreibung: "Geringwertig" },
  { code: "ABC", name: "ABC", beschreibung: "Mischpreis" },
  { code: "BC", name: "BC", beschreibung: "Mischpreis B/C" },
];

// === Stärkeklassen (Mittendurchmesser ohne Rinde) ===
export const STAERKEKLASSEN: Staerkeklasse[] = [
  { code: "1b", name: "D1b", vonCm: 15, bisCm: 19 },
  { code: "2a", name: "D2a", vonCm: 20, bisCm: 24 },
  { code: "2b", name: "D2b", vonCm: 25, bisCm: 29 },
  { code: "3a", name: "D3a", vonCm: 30, bisCm: 34 },
  { code: "3b", name: "D3b", vonCm: 35, bisCm: 39 },
  { code: "4", name: "D4", vonCm: 40, bisCm: 49 },
  { code: "5", name: "D5", vonCm: 50, bisCm: 59 },
];

// === Sägewerke ===
export const SAEGEWERKE: Saegewerk[] = [
  { id: "sw1", name: "Sägewerk Mayr GmbH", email: "abrechnung@mayr-holz.at", adresse: "Waldstraße 12, 8742 Obdach" },
  { id: "sw2", name: "Holz Gruber KG", email: "office@holz-gruber.at", adresse: "Industrieweg 5, 8720 Knittelfeld" },
  { id: "sw3", name: "Sägewerk Pichler", email: "info@saegewerk-pichler.at", adresse: "Forstweg 8, 8753 Fohnsdorf" },
  { id: "sw4", name: "Waldholz Steiner GmbH", email: "holz@steiner.at", adresse: "Hauptstraße 44, 8700 Leoben" },
  { id: "sw5", name: "Sägewerk Huber & Co", email: "abrechnung@huber-holz.at", adresse: "Am Sägewerk 1, 8761 Pöls" },
  { id: "sw6", name: "Holzwerk Berger", email: "office@holzwerk-berger.at", adresse: "Bergstraße 22, 8713 St. Stefan" },
];

// === Bauern ===
export const BAUERN: Bauer[] = [
  { id: "b1", kundennr: "K-2024-001", name: "Johann Moser", adresse: "Bergweg 4, 8742 Obdach", ustStatus: "pauschaliert" },
  { id: "b2", kundennr: "K-2024-002", name: "Franz Eder", adresse: "Waldrand 11, 8741 Weißkirchen", ustStatus: "pauschaliert" },
  { id: "b3", kundennr: "K-2024-003", name: "Maria Hofer", adresse: "Hofgasse 7, 8720 Knittelfeld", ustStatus: "ea-rechner" },
  { id: "b4", kundennr: "K-2024-004", name: "Josef Wallner", adresse: "Talstraße 19, 8753 Fohnsdorf", ustStatus: "pauschaliert" },
  { id: "b5", kundennr: "K-2024-005", name: "Anna Gruber", adresse: "Sonnenhang 3, 8742 Obdach", ustStatus: "pauschaliert" },
];

// === Abrechnungen (realistische Daten nach ÖHU) ===
export const ABRECHNUNGEN: Abrechnung[] = [
  {
    id: "abr-001",
    datum: "2026-03-12",
    saegwerkId: "sw1",
    lieferscheinNr: "LS-2026-0342",
    schlussbriefNr: "SB-2026-0087",
    bauerId: "b1",
    status: "freigegeben",
    konfidenz: "hoch",
    vermessungsDatum: "2026-03-13",
    aufschlagProzent: 8,
    transportkosten: 320,
    positionen: [
      { id: "p1", holzart: "FITA", gueteklasse: "B", staerkeklasse: "2a", mengeFmo: 12.45, preisProFmo: 120 },
      { id: "p2", holzart: "FITA", gueteklasse: "B", staerkeklasse: "2b", mengeFmo: 28.73, preisProFmo: 128 },
      { id: "p3", holzart: "FITA", gueteklasse: "B", staerkeklasse: "3a", mengeFmo: 15.21, preisProFmo: 131 },
      { id: "p4", holzart: "FITA", gueteklasse: "C", staerkeklasse: "2b", mengeFmo: 11.87, preisProFmo: 126 },
      { id: "p5", holzart: "FITA", gueteklasse: "CX", staerkeklasse: "2b", mengeFmo: 3.22, preisProFmo: 78 },
      { id: "p6", holzart: "LAE", gueteklasse: "ABC", staerkeklasse: "3a", mengeFmo: 6.89, preisProFmo: 158 },
    ],
  },
  {
    id: "abr-002",
    datum: "2026-03-10",
    saegwerkId: "sw2",
    lieferscheinNr: "LS-2026-0298",
    schlussbriefNr: "SB-2026-0071",
    bauerId: "b2",
    status: "in_pruefung",
    konfidenz: "mittel",
    vermessungsDatum: "2026-03-11",
    aufschlagProzent: 8,
    transportkosten: 280,
    positionen: [
      { id: "p7", holzart: "FITA", gueteklasse: "ABC", staerkeklasse: "2b", mengeFmo: 34.56, preisProFmo: 129 },
      { id: "p8", holzart: "FITA", gueteklasse: "ABC", staerkeklasse: "3a", mengeFmo: 18.92, preisProFmo: 132 },
      { id: "p9", holzart: "FITA", gueteklasse: "CX", staerkeklasse: "2a", mengeFmo: 5.44, preisProFmo: 76 },
      { id: "p10", holzart: "KI", gueteklasse: "BC", staerkeklasse: "2b", mengeFmo: 8.31, preisProFmo: 92 },
    ],
  },
  {
    id: "abr-003",
    datum: "2026-03-08",
    saegwerkId: "sw3",
    lieferscheinNr: "LS-2026-0277",
    schlussbriefNr: "SB-2026-0065",
    bauerId: "b3",
    status: "in_pruefung",
    konfidenz: "niedrig",
    vermessungsDatum: "2026-03-09",
    aufschlagProzent: 10,
    transportkosten: 450,
    positionen: [
      { id: "p11", holzart: "LAE", gueteklasse: "ABC", staerkeklasse: "3a", mengeFmo: 22.15, preisProFmo: 160 },
      { id: "p12", holzart: "LAE", gueteklasse: "ABC", staerkeklasse: "3b", mengeFmo: 14.88, preisProFmo: 162 },
      { id: "p13", holzart: "LAE", gueteklasse: "CX", staerkeklasse: "2b", mengeFmo: 4.22, preisProFmo: 95 },
      { id: "p14", holzart: "FITA", gueteklasse: "B", staerkeklasse: "2b", mengeFmo: 19.45, preisProFmo: 127 },
      { id: "p15", holzart: "FITA", gueteklasse: "C", staerkeklasse: "2a", mengeFmo: 7.33, preisProFmo: 118 },
    ],
  },
  {
    id: "abr-004",
    datum: "2026-03-15",
    saegwerkId: "sw4",
    lieferscheinNr: "LS-2026-0401",
    schlussbriefNr: "SB-2026-0098",
    bauerId: "b4",
    status: "neu",
    konfidenz: "hoch",
    vermessungsDatum: "2026-03-16",
    aufschlagProzent: 8,
    transportkosten: 240,
    positionen: [
      { id: "p16", holzart: "FITA", gueteklasse: "B", staerkeklasse: "2b", mengeFmo: 42.18, preisProFmo: 130 },
      { id: "p17", holzart: "FITA", gueteklasse: "B", staerkeklasse: "3a", mengeFmo: 21.55, preisProFmo: 133 },
      { id: "p18", holzart: "FITA", gueteklasse: "B", staerkeklasse: "3b", mengeFmo: 8.44, preisProFmo: 135 },
    ],
  },
  {
    id: "abr-005",
    datum: "2026-03-17",
    saegwerkId: "sw5",
    lieferscheinNr: "LS-2026-0415",
    schlussbriefNr: "SB-2026-0102",
    bauerId: "b5",
    status: "neu",
    konfidenz: "mittel",
    vermessungsDatum: "2026-03-18",
    aufschlagProzent: 8,
    transportkosten: 360,
    positionen: [
      { id: "p19", holzart: "FITA", gueteklasse: "ABC", staerkeklasse: "2b", mengeFmo: 28.90, preisProFmo: 127 },
      { id: "p20", holzart: "FITA", gueteklasse: "ABC", staerkeklasse: "3a", mengeFmo: 16.44, preisProFmo: 130 },
      { id: "p21", holzart: "LAE", gueteklasse: "ABC", staerkeklasse: "3a", mengeFmo: 9.12, preisProFmo: 157 },
      { id: "p22", holzart: "KI", gueteklasse: "BC", staerkeklasse: "2b", mengeFmo: 5.67, preisProFmo: 90 },
      { id: "p23", holzart: "FITA", gueteklasse: "CX", staerkeklasse: "2a", mengeFmo: 3.88, preisProFmo: 75 },
    ],
  },
];

// === Durchschlagsblöcke ===
export const DURCHSCHLAGSBLOECKE: Durchschlagsblock[] = [
  {
    id: "db-001",
    bauerId: "b1",
    datum: "2026-03-05",
    positionen: [
      { id: "dp1", holzart: "FITA", gueteklasse: "B", staerkeklasse: "2b", mengeFmo: 15.2, preisProFmo: 128 },
      { id: "dp2", holzart: "FITA", gueteklasse: "C", staerkeklasse: "2a", mengeFmo: 8.4, preisProFmo: 118 },
    ],
  },
  {
    id: "db-002",
    bauerId: "b4",
    datum: "2026-03-01",
    positionen: [
      { id: "dp3", holzart: "LAE", gueteklasse: "ABC", staerkeklasse: "3a", mengeFmo: 12.8, preisProFmo: 158 },
      { id: "dp4", holzart: "FITA", gueteklasse: "B", staerkeklasse: "3a", mengeFmo: 22.1, preisProFmo: 131 },
      { id: "dp5", holzart: "FITA", gueteklasse: "CX", staerkeklasse: "2b", mengeFmo: 4.5, preisProFmo: 78 },
    ],
  },
];

// === Aufschlags-Konfiguration ===
export const AUFSCHLAG_DEFAULTS: AufschlagConfig[] = [
  { holzart: "FITA", gueteklasse: "B", aufschlagEuro: 10 },
  { holzart: "FITA", gueteklasse: "C", aufschlagEuro: 8 },
  { holzart: "FITA", gueteklasse: "CX", aufschlagEuro: 5 },
  { holzart: "FITA", gueteklasse: "ABC", aufschlagEuro: 10 },
  { holzart: "LAE", gueteklasse: "ABC", aufschlagEuro: 12 },
  { holzart: "KI", gueteklasse: "BC", aufschlagEuro: 7 },
];

export const TRANSPORT_DEFAULT = 280; // EUR pro Fuhre

// === Hilfsfunktionen ===

export function getSaegwerkName(id: string): string {
  return SAEGEWERKE.find((s) => s.id === id)?.name ?? "Unbekannt";
}

export function getBauerName(id: string): string {
  return BAUERN.find((b) => b.id === id)?.name ?? "Unbekannt";
}

export function getBauer(id: string): Bauer | undefined {
  return BAUERN.find((b) => b.id === id);
}

export function getHolzartName(code: string): string {
  return HOLZARTEN.find((h) => h.code === code)?.name ?? code;
}

export function berechnePositionsBetrag(mengeFmo: number, preisProFmo: number): number {
  return Math.round(mengeFmo * preisProFmo * 100) / 100;
}

export function berechneAbrechnungsSumme(abrechnung: Abrechnung): number {
  return abrechnung.positionen.reduce(
    (sum, pos) => sum + berechnePositionsBetrag(pos.mengeFmo, pos.preisProFmo),
    0
  );
}

export function berechneGesamtFmo(abrechnung: Abrechnung): number {
  return Math.round(abrechnung.positionen.reduce((sum, pos) => sum + pos.mengeFmo, 0) * 100) / 100;
}
