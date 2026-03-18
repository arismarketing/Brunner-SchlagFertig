"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, KonfidenzBadge } from "@/components/StatusBadge";
import { InlineEditCell } from "@/components/InlineEditCell";
import { ArrowLeft, Check, X, Upload, FileText, Mail } from "lucide-react";
import {
  ABRECHNUNGEN,
  getSaegwerkName,
  getBauer,
  getHolzartName,
  berechnePositionsBetrag,
} from "@/data/mock-data";
import type { AbrechnungsPosition } from "@/lib/types";

export default function AbrechnungDetailPage() {
  const params = useParams();
  const router = useRouter();
  const abrechnung = ABRECHNUNGEN.find((a) => a.id === params.id);

  const [positionen, setPositionen] = useState<AbrechnungsPosition[]>(
    abrechnung?.positionen ?? []
  );
  const [aufschlagProzent, setAufschlagProzent] = useState(abrechnung?.aufschlagProzent ?? 8);
  const [transportkosten, setTransportkosten] = useState(abrechnung?.transportkosten ?? 280);
  const [pdfOpen, setPdfOpen] = useState(false);

  if (!abrechnung) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Abrechnung nicht gefunden.</p>
        <Link href="/abrechnungen" className="text-primary underline mt-2 inline-block">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const bauer = getBauer(abrechnung.bauerId);
  const ustSatz = bauer?.ustStatus === "ea-rechner" ? 0.2 : 0.13;
  const ustLabel = bauer?.ustStatus === "ea-rechner" ? "20% USt" : "13% USt (pauschaliert)";
  const pdfUrl = `/demo/${abrechnung.id}.pdf`;

  // Berechnungen
  const holzwertSumme = positionen.reduce(
    (sum, pos) => sum + berechnePositionsBetrag(pos.mengeFmo, pos.preisProFmo),
    0
  );
  const aufschlagBetrag = holzwertSumme * (aufschlagProzent / 100);
  const nettoBetrag = holzwertSumme + aufschlagBetrag + transportkosten;
  const ustBetrag = nettoBetrag * ustSatz;
  const bruttoBetrag = nettoBetrag + ustBetrag;
  const gesamtFmo = positionen.reduce((sum, pos) => sum + pos.mengeFmo, 0);

  const updatePosition = (index: number, field: keyof AbrechnungsPosition, value: string) => {
    setPositionen((prev) => {
      const updated = prev.map((pos, i) => {
        if (i !== index) return pos;
        if (field === "mengeFmo" || field === "preisProFmo") {
          return { ...pos, [field]: parseFloat(value) || 0 };
        }
        return { ...pos, [field]: value };
      });
      return updated;
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/abrechnungen")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold truncate">Abrechnung {abrechnung.lieferscheinNr}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 gap-1">
            <Mail className="h-3 w-3" />
            Quelle: E-Mail
          </Badge>
          <StatusBadge status={abrechnung.status} />
          <KonfidenzBadge level={abrechnung.konfidenz} />
        </div>
      </div>

      {/* Meta-Daten + PDF-Button */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Sägewerk</p>
              <p className="font-medium">{getSaegwerkName(abrechnung.saegwerkId)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bauer</p>
              <p className="font-medium">{bauer?.name ?? "Unbekannt"}</p>
              <p className="text-xs text-muted-foreground">
                {bauer?.ustStatus === "pauschaliert" ? "Pauschaliert (13%)" : "E-A-Rechner (20%)"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lieferschein-Nr.</p>
              <p className="font-medium font-mono">{abrechnung.lieferscheinNr}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Schlussbrief-Nr.</p>
              <p className="font-medium font-mono">{abrechnung.schlussbriefNr}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lieferdatum</p>
              <p className="font-medium">{new Date(abrechnung.datum).toLocaleDateString("de-AT")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vermessungsdatum</p>
              <p className="font-medium">{new Date(abrechnung.vermessungsDatum).toLocaleDateString("de-AT")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gesamt-FMO</p>
              <p className="font-medium">{gesamtFmo.toLocaleString("de-AT", { minimumFractionDigits: 2 })} FMO</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Original-PDF</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 gap-1.5"
                onClick={() => setPdfOpen(!pdfOpen)}
              >
                <FileText className="h-3.5 w-3.5" />
                {pdfOpen ? "PDF ausblenden" : "PDF anzeigen"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF-Viewer */}
      {pdfOpen && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Original-Gutschrift (PDF)
              </CardTitle>
              <div className="flex gap-2">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    In neuem Tab öffnen
                  </Button>
                </a>
                <Button variant="ghost" size="sm" onClick={() => setPdfOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                src={pdfUrl}
                className="w-full h-[600px]"
                title="Original-Gutschrift PDF"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positionen */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Positionen</CardTitle>
          <p className="text-sm text-muted-foreground">Klicken Sie auf einen Wert, um ihn zu bearbeiten</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">Pos</TableHead>
                <TableHead>Holzart</TableHead>
                <TableHead>Gütekl.</TableHead>
                <TableHead>Stärkekl.</TableHead>
                <TableHead className="text-right">Menge (FMO)</TableHead>
                <TableHead className="text-right">Preis (EUR/FMO)</TableHead>
                <TableHead className="text-right">Betrag (EUR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positionen.map((pos, idx) => (
                <TableRow key={pos.id}>
                  <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                  <TableCell className="font-medium">{getHolzartName(pos.holzart)}</TableCell>
                  <TableCell>{pos.gueteklasse}</TableCell>
                  <TableCell>{pos.staerkeklasse.toUpperCase()}</TableCell>
                  <TableCell className="text-right">
                    <InlineEditCell
                      value={pos.mengeFmo}
                      type="number"
                      onSave={(v) => updatePosition(idx, "mengeFmo", v)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <InlineEditCell
                      value={pos.preisProFmo}
                      type="number"
                      onSave={(v) => updatePosition(idx, "preisProFmo", v)}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {berechnePositionsBetrag(pos.mengeFmo, pos.preisProFmo).toLocaleString("de-AT", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4} className="font-medium">Summe Holzwert</TableCell>
                <TableCell className="text-right font-medium">
                  {gesamtFmo.toLocaleString("de-AT", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right font-bold">
                  {holzwertSumme.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Aufschläge und Berechnung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aufschläge & Transport</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Aufschlag</span>
              <div className="flex items-center gap-1">
                <InlineEditCell
                  value={aufschlagProzent}
                  type="number"
                  onSave={(v) => setAufschlagProzent(parseFloat(v) || 0)}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Transportkosten</span>
              <div className="flex items-center gap-1">
                <InlineEditCell
                  value={transportkosten}
                  type="number"
                  onSave={(v) => setTransportkosten(parseFloat(v) || 0)}
                />
                <span className="text-sm text-muted-foreground">€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Berechnung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Holzwert</span>
              <span>{holzwertSumme.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Aufschlag ({aufschlagProzent}%)</span>
              <span>{aufschlagBetrag.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Transportkosten</span>
              <span>{transportkosten.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Nettobetrag</span>
              <span>{nettoBetrag.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{ustLabel}</span>
              <span>{ustBetrag.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Bruttobetrag</span>
              <span className="text-primary">
                {bruttoBetrag.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aktions-Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => toast.success("Abrechnung erfolgreich freigegeben")}
        >
          <Check className="h-4 w-4 mr-2" />
          Freigeben
        </Button>
        <Button
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50"
          onClick={() => toast.error("Abrechnung zurückgewiesen")}
        >
          <X className="h-4 w-4 mr-2" />
          Zurückweisen
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Export nach AEVO wird vorbereitet...")}
        >
          <Upload className="h-4 w-4 mr-2" />
          In AEVO exportieren
        </Button>
        <Button
          variant="ghost"
          onClick={() => setPdfOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Original-PDF
        </Button>
      </div>
    </div>
  );
}
