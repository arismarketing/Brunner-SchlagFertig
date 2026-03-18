// === Stammdaten-Typen ===

export type UstStatus = "pauschaliert" | "ea-rechner";

export interface Saegewerk {
  id: string;
  name: string;
  email: string;
  adresse: string;
}

export interface Bauer {
  id: string;
  kundennr: string;
  name: string;
  adresse: string;
  ustStatus: UstStatus;
}

// === Holz-Klassifikation (nach ÖHU 2006) ===

export interface Holzart {
  code: string;
  name: string;
  gruppe: "Nadelholz" | "Laubholz";
}

export interface Gueteklasse {
  code: string;
  name: string;
  beschreibung: string;
}

export interface Staerkeklasse {
  code: string;
  name: string;
  vonCm: number;
  bisCm: number;
}

// === Abrechnungen ===

export type AbrechnungsStatus = "neu" | "in_pruefung" | "freigegeben";
export type KonfidenzLevel = "hoch" | "mittel" | "niedrig";

export interface AbrechnungsPosition {
  id: string;
  holzart: string;      // Code aus HOLZARTEN
  gueteklasse: string;   // Code aus GUETEKLASSEN
  staerkeklasse: string; // Code aus STAERKEKLASSEN
  mengeFmo: number;      // Festmeter ohne Rinde
  preisProFmo: number;   // EUR/FMO
}

export interface Abrechnung {
  id: string;
  datum: string;           // ISO date
  saegwerkId: string;
  lieferscheinNr: string;
  schlussbriefNr: string;
  bauerId: string;
  status: AbrechnungsStatus;
  konfidenz: KonfidenzLevel;
  positionen: AbrechnungsPosition[];
  aufschlagProzent: number;
  transportkosten: number;
  vermessungsDatum: string;
}

// === Durchschlagsblock ===

export interface DurchschlagsblockPosition {
  id: string;
  holzart: string;
  gueteklasse: string;
  staerkeklasse: string;
  mengeFmo: number;
  preisProFmo: number;
}

export interface Durchschlagsblock {
  id: string;
  bauerId: string;
  datum: string;
  positionen: DurchschlagsblockPosition[];
}

// === Einstellungen ===

export interface AufschlagConfig {
  holzart: string;
  gueteklasse: string;
  aufschlagEuro: number;
}

export interface TransportConfig {
  pauschaleProFuhre: number;
}
