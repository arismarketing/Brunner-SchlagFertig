import { jsPDF } from "jspdf";
import fs from "fs";

function generateGutschrift(filename, data) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  let y = margin;

  // Header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.saegewerk, margin, y);
  y += 5;
  doc.text(data.saegwerkAdresse, margin, y);
  y += 5;
  doc.text(`E-Mail: ${data.saegwerkEmail}`, margin, y);
  y += 12;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("HOLZGUTSCHRIFT", margin, y);
  y += 10;

  // Meta
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const metaLeft = [
    `Gutschrift-Nr.: ${data.gutschriftNr}`,
    `Lieferschein-Nr.: ${data.lieferscheinNr}`,
    `Schlussbrief-Nr.: ${data.schlussbriefNr}`,
    `Lieferdatum: ${data.lieferdatum}`,
    `Vermessungsdatum: ${data.vermessungsdatum}`,
  ];
  const metaRight = [
    `Lieferant: ${data.lieferant}`,
    `Adresse: ${data.lieferantAdresse}`,
    `Kundennr.: ${data.kundennr}`,
    `USt-Status: ${data.ustStatus}`,
    "",
  ];
  for (let i = 0; i < metaLeft.length; i++) {
    doc.text(metaLeft[i], margin, y);
    doc.text(metaRight[i], 115, y);
    y += 5;
  }
  y += 5;

  // Line
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(margin, y, 190, y);
  y += 5;

  // Table header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  const cols = [margin, 40, 55, 72, 100, 130, 160];
  const headers = ["Pos", "Holzart", "Guete", "Staerke", "Menge (FMO)", "Preis (EUR/FMO)", "Betrag (EUR)"];
  headers.forEach((h, i) => doc.text(h, cols[i], y));
  y += 2;
  doc.line(margin, y, 190, y);
  y += 5;

  // Table rows
  doc.setFont("helvetica", "normal");
  let gesamtFmo = 0;
  let gesamtBetrag = 0;
  data.positionen.forEach((pos, idx) => {
    const betrag = pos.menge * pos.preis;
    gesamtFmo += pos.menge;
    gesamtBetrag += betrag;
    doc.text(String(idx + 1), margin, y);
    doc.text(pos.holzart, 40, y);
    doc.text(pos.guete, 55, y);
    doc.text(pos.staerke, 72, y);
    doc.text(pos.menge.toFixed(2), 100, y, { align: "left" });
    doc.text(pos.preis.toFixed(2), 130, y, { align: "left" });
    doc.text(betrag.toFixed(2), 160, y, { align: "left" });
    y += 5;
  });

  // Sum line
  y += 2;
  doc.line(margin, y, 190, y);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.text("SUMME Saegerundholz", margin, y);
  doc.text(gesamtFmo.toFixed(2), 100, y, { align: "left" });
  doc.text(gesamtBetrag.toFixed(2), 160, y, { align: "left" });
  y += 10;

  // Abzuege / Aufschlag
  doc.setFont("helvetica", "normal");
  doc.line(margin, y, 190, y);
  y += 5;
  const aufschlag = gesamtBetrag * (data.aufschlagProzent / 100);
  doc.text(`Aufschlag (${data.aufschlagProzent}%)`, margin, y);
  doc.text(aufschlag.toFixed(2), 160, y, { align: "left" });
  y += 5;
  doc.text("Transportkosten", margin, y);
  doc.text(data.transportkosten.toFixed(2), 160, y, { align: "left" });
  y += 7;

  // Netto
  doc.line(margin, y, 190, y);
  y += 5;
  const netto = gesamtBetrag + aufschlag + data.transportkosten;
  doc.setFont("helvetica", "bold");
  doc.text("NETTO-BETRAG", margin, y);
  doc.text(`${netto.toFixed(2)} EUR`, 160, y, { align: "left" });
  y += 5;

  const ustSatz = data.ustProzent;
  const ust = netto * (ustSatz / 100);
  doc.setFont("helvetica", "normal");
  doc.text(`USt ${ustSatz}% (${data.ustStatus})`, margin, y);
  doc.text(`${ust.toFixed(2)} EUR`, 160, y, { align: "left" });
  y += 7;

  doc.line(margin, y, 190, y);
  y += 5;
  const brutto = netto + ust;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("BRUTTO-BETRAG", margin, y);
  doc.text(`${brutto.toFixed(2)} EUR`, 160, y, { align: "left" });
  y += 12;

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Zahlungsziel: 30 Tage netto`, margin, y);
  y += 5;
  doc.text(`Bankverbindung: IBAN AT12 3456 7890 1234 5678`, margin, y);
  y += 5;
  doc.text(`BIC: STSPAT2G`, margin, y);

  const buffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(filename, buffer);
  console.log(`Generated: ${filename}`);
}

// Generate 5 demo PDFs matching mock data
const demos = [
  {
    gutschriftNr: "GS-2026-0342",
    saegewerk: "Saegewerk Mayr GmbH",
    saegwerkAdresse: "Waldstrasse 12, 8742 Obdach",
    saegwerkEmail: "abrechnung@mayr-holz.at",
    lieferscheinNr: "LS-2026-0342",
    schlussbriefNr: "SB-2026-0087",
    lieferdatum: "12.03.2026",
    vermessungsdatum: "13.03.2026",
    lieferant: "Johann Moser",
    lieferantAdresse: "Bergweg 4, 8742 Obdach",
    kundennr: "K-2024-001",
    ustStatus: "pauschaliert",
    ustProzent: 13,
    aufschlagProzent: 8,
    transportkosten: 320,
    positionen: [
      { holzart: "Fi/Ta", guete: "B", staerke: "2a", menge: 12.45, preis: 120 },
      { holzart: "Fi/Ta", guete: "B", staerke: "2b", menge: 28.73, preis: 128 },
      { holzart: "Fi/Ta", guete: "B", staerke: "3a", menge: 15.21, preis: 131 },
      { holzart: "Fi/Ta", guete: "C", staerke: "2b", menge: 11.87, preis: 126 },
      { holzart: "Fi/Ta", guete: "CX", staerke: "2b", menge: 3.22, preis: 78 },
      { holzart: "Laerche", guete: "ABC", staerke: "3a", menge: 6.89, preis: 158 },
    ],
  },
  {
    gutschriftNr: "GS-2026-0298",
    saegewerk: "Holz Gruber KG",
    saegwerkAdresse: "Industrieweg 5, 8720 Knittelfeld",
    saegwerkEmail: "office@holz-gruber.at",
    lieferscheinNr: "LS-2026-0298",
    schlussbriefNr: "SB-2026-0071",
    lieferdatum: "10.03.2026",
    vermessungsdatum: "11.03.2026",
    lieferant: "Franz Eder",
    lieferantAdresse: "Waldrand 11, 8741 Weisskirchen",
    kundennr: "K-2024-002",
    ustStatus: "pauschaliert",
    ustProzent: 13,
    aufschlagProzent: 8,
    transportkosten: 280,
    positionen: [
      { holzart: "Fi/Ta", guete: "ABC", staerke: "2b", menge: 34.56, preis: 129 },
      { holzart: "Fi/Ta", guete: "ABC", staerke: "3a", menge: 18.92, preis: 132 },
      { holzart: "Fi/Ta", guete: "CX", staerke: "2a", menge: 5.44, preis: 76 },
      { holzart: "Kiefer", guete: "BC", staerke: "2b", menge: 8.31, preis: 92 },
    ],
  },
  {
    gutschriftNr: "GS-2026-0277",
    saegewerk: "Saegewerk Pichler",
    saegwerkAdresse: "Forstweg 8, 8753 Fohnsdorf",
    saegwerkEmail: "info@saegewerk-pichler.at",
    lieferscheinNr: "LS-2026-0277",
    schlussbriefNr: "SB-2026-0065",
    lieferdatum: "08.03.2026",
    vermessungsdatum: "09.03.2026",
    lieferant: "Maria Hofer",
    lieferantAdresse: "Hofgasse 7, 8720 Knittelfeld",
    kundennr: "K-2024-003",
    ustStatus: "E-A-Rechner",
    ustProzent: 20,
    aufschlagProzent: 10,
    transportkosten: 450,
    positionen: [
      { holzart: "Laerche", guete: "ABC", staerke: "3a", menge: 22.15, preis: 160 },
      { holzart: "Laerche", guete: "ABC", staerke: "3b", menge: 14.88, preis: 162 },
      { holzart: "Laerche", guete: "CX", staerke: "2b", menge: 4.22, preis: 95 },
      { holzart: "Fi/Ta", guete: "B", staerke: "2b", menge: 19.45, preis: 127 },
      { holzart: "Fi/Ta", guete: "C", staerke: "2a", menge: 7.33, preis: 118 },
    ],
  },
  {
    gutschriftNr: "GS-2026-0401",
    saegewerk: "Waldholz Steiner GmbH",
    saegwerkAdresse: "Hauptstrasse 44, 8700 Leoben",
    saegwerkEmail: "holz@steiner.at",
    lieferscheinNr: "LS-2026-0401",
    schlussbriefNr: "SB-2026-0098",
    lieferdatum: "15.03.2026",
    vermessungsdatum: "16.03.2026",
    lieferant: "Josef Wallner",
    lieferantAdresse: "Talstrasse 19, 8753 Fohnsdorf",
    kundennr: "K-2024-004",
    ustStatus: "pauschaliert",
    ustProzent: 13,
    aufschlagProzent: 8,
    transportkosten: 240,
    positionen: [
      { holzart: "Fi/Ta", guete: "B", staerke: "2b", menge: 42.18, preis: 130 },
      { holzart: "Fi/Ta", guete: "B", staerke: "3a", menge: 21.55, preis: 133 },
      { holzart: "Fi/Ta", guete: "B", staerke: "3b", menge: 8.44, preis: 135 },
    ],
  },
  {
    gutschriftNr: "GS-2026-0415",
    saegewerk: "Saegewerk Huber & Co",
    saegwerkAdresse: "Am Saegewerk 1, 8761 Poels",
    saegwerkEmail: "abrechnung@huber-holz.at",
    lieferscheinNr: "LS-2026-0415",
    schlussbriefNr: "SB-2026-0102",
    lieferdatum: "17.03.2026",
    vermessungsdatum: "18.03.2026",
    lieferant: "Anna Gruber",
    lieferantAdresse: "Sonnenhang 3, 8742 Obdach",
    kundennr: "K-2024-005",
    ustStatus: "pauschaliert",
    ustProzent: 13,
    aufschlagProzent: 8,
    transportkosten: 360,
    positionen: [
      { holzart: "Fi/Ta", guete: "ABC", staerke: "2b", menge: 28.90, preis: 127 },
      { holzart: "Fi/Ta", guete: "ABC", staerke: "3a", menge: 16.44, preis: 130 },
      { holzart: "Laerche", guete: "ABC", staerke: "3a", menge: 9.12, preis: 157 },
      { holzart: "Kiefer", guete: "BC", staerke: "2b", menge: 5.67, preis: 90 },
      { holzart: "Fi/Ta", guete: "CX", staerke: "2a", menge: 3.88, preis: 75 },
    ],
  },
];

const abrIds = ["abr-001", "abr-002", "abr-003", "abr-004", "abr-005"];
demos.forEach((data, i) => {
  generateGutschrift(`public/demo/${abrIds[i]}.pdf`, data);
});
