"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import {
  BAUERN,
  HOLZARTEN,
  GUETEKLASSEN,
  STAERKEKLASSEN,
  DURCHSCHLAGSBLOECKE,
  getBauerName,
  getHolzartName,
  berechnePositionsBetrag,
} from "@/data/mock-data";
import type { DurchschlagsblockPosition, Durchschlagsblock } from "@/lib/types";

function createEmptyPosition(): DurchschlagsblockPosition {
  return {
    id: `dp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    holzart: "FITA",
    gueteklasse: "B",
    staerkeklasse: "2b",
    mengeFmo: 0,
    preisProFmo: 128,
  };
}

export default function DurchschlagsblockPage() {
  const [bloecke, setBloecke] = useState<Durchschlagsblock[]>(DURCHSCHLAGSBLOECKE);
  const [bauerId, setBauerId] = useState<string>("");
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [positionen, setPositionen] = useState<DurchschlagsblockPosition[]>([
    createEmptyPosition(),
  ]);

  const addPosition = () => {
    setPositionen((prev) => [...prev, createEmptyPosition()]);
  };

  const removePosition = (index: number) => {
    if (positionen.length <= 1) return;
    setPositionen((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePosition = (index: number, field: keyof DurchschlagsblockPosition, value: string | number) => {
    setPositionen((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, [field]: value } : pos))
    );
  };

  const handleSave = () => {
    if (!bauerId) {
      toast.error("Bitte Bauer auswählen");
      return;
    }
    if (positionen.some((p) => p.mengeFmo <= 0)) {
      toast.error("Bitte Menge für alle Positionen eingeben");
      return;
    }

    const neuerBlock: Durchschlagsblock = {
      id: `db-${Date.now()}`,
      bauerId,
      datum,
      positionen: [...positionen],
    };

    setBloecke((prev) => [neuerBlock, ...prev]);
    setPositionen([createEmptyPosition()]);
    setBauerId("");
    toast.success("Durchschlagsblock gespeichert");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Durchschlagsblock-Erfassung</h1>

      {/* Erfassungsformular */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Neuer Eintrag</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Bauer</Label>
              <Select value={bauerId} onValueChange={(v) => v && setBauerId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Bauer auswählen..." />
                </SelectTrigger>
                <SelectContent>
                  {BAUERN.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} ({b.kundennr})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Datum</Label>
              <Input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
              />
            </div>
          </div>

          {/* Positions-Tabelle */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Holzart</TableHead>
                <TableHead>Güteklasse</TableHead>
                <TableHead>Stärkeklasse</TableHead>
                <TableHead>Menge (FMO)</TableHead>
                <TableHead>Preis (EUR/FMO)</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positionen.map((pos, idx) => (
                <TableRow key={pos.id}>
                  <TableCell>
                    <Select
                      value={pos.holzart}
                      onValueChange={(v) => v && updatePosition(idx, "holzart", v)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOLZARTEN.map((h) => (
                          <SelectItem key={h.code} value={h.code}>
                            {h.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pos.gueteklasse}
                      onValueChange={(v) => v && updatePosition(idx, "gueteklasse", v)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GUETEKLASSEN.map((g) => (
                          <SelectItem key={g.code} value={g.code}>
                            {g.code} – {g.beschreibung}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={pos.staerkeklasse}
                      onValueChange={(v) => v && updatePosition(idx, "staerkeklasse", v)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAERKEKLASSEN.map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name} ({s.vonCm}–{s.bisCm} cm)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={pos.mengeFmo || ""}
                      onChange={(e) =>
                        updatePosition(idx, "mengeFmo", parseFloat(e.target.value) || 0)
                      }
                      className="w-24"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={pos.preisProFmo || ""}
                      onChange={(e) =>
                        updatePosition(idx, "preisProFmo", parseFloat(e.target.value) || 0)
                      }
                      className="w-24"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {berechnePositionsBetrag(pos.mengeFmo, pos.preisProFmo).toLocaleString("de-AT", {
                      minimumFractionDigits: 2,
                    })} €
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePosition(idx)}
                      disabled={positionen.length <= 1}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={addPosition}>
              <Plus className="h-4 w-4 mr-1" />
              Zeile hinzufügen
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Letzte Durchschlagsblöcke */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Letzte Durchschlagsblöcke</CardTitle>
        </CardHeader>
        <CardContent>
          {bloecke.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Noch keine Einträge vorhanden.</p>
          ) : (
            <div className="space-y-4">
              {bloecke.map((block) => (
                <div key={block.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="font-medium">{getBauerName(block.bauerId)}</span>
                      <span className="text-muted-foreground mx-2">·</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(block.datum).toLocaleDateString("de-AT")}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {block.positionen.reduce((s, p) => s + p.mengeFmo, 0).toLocaleString("de-AT", { minimumFractionDigits: 2 })} FMO
                    </span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Holzart</TableHead>
                        <TableHead>Güte</TableHead>
                        <TableHead>Stärke</TableHead>
                        <TableHead className="text-right">Menge</TableHead>
                        <TableHead className="text-right">Preis</TableHead>
                        <TableHead className="text-right">Betrag</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {block.positionen.map((pos) => (
                        <TableRow key={pos.id}>
                          <TableCell>{getHolzartName(pos.holzart)}</TableCell>
                          <TableCell>{pos.gueteklasse}</TableCell>
                          <TableCell>{pos.staerkeklasse.toUpperCase()}</TableCell>
                          <TableCell className="text-right">
                            {pos.mengeFmo.toLocaleString("de-AT", { minimumFractionDigits: 2 })} FMO
                          </TableCell>
                          <TableCell className="text-right">
                            {pos.preisProFmo.toLocaleString("de-AT", { minimumFractionDigits: 2 })} €
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {berechnePositionsBetrag(pos.mengeFmo, pos.preisProFmo).toLocaleString("de-AT", { minimumFractionDigits: 2 })} €
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
