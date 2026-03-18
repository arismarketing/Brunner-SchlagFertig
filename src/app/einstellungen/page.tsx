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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import {
  AUFSCHLAG_DEFAULTS,
  SAEGEWERKE,
  TRANSPORT_DEFAULT,
  getHolzartName,
} from "@/data/mock-data";
import type { AufschlagConfig, Saegewerk } from "@/lib/types";

// Preistabelle: realistische Standardpreise EUR/FMO
const INITIAL_PREISTABELLE: Record<string, number> = {
  "FITA-B-2a": 120, "FITA-B-2b": 128, "FITA-B-3a": 131, "FITA-B-3b": 133,
  "FITA-C-2a": 118, "FITA-C-2b": 126, "FITA-C-3a": 128,
  "FITA-CX-2a": 76, "FITA-CX-2b": 78,
  "FITA-ABC-2a": 122, "FITA-ABC-2b": 129, "FITA-ABC-3a": 132, "FITA-ABC-3b": 134,
  "LAE-ABC-2b": 148, "LAE-ABC-3a": 158, "LAE-ABC-3b": 162, "LAE-ABC-4": 165,
  "KI-BC-2a": 85, "KI-BC-2b": 92, "KI-BC-3a": 98,
};

export default function EinstellungenPage() {
  const [aufschlaege, setAufschlaege] = useState<AufschlagConfig[]>(AUFSCHLAG_DEFAULTS);
  const [transport, setTransport] = useState(TRANSPORT_DEFAULT);
  const [saegewerke, setSaegewerke] = useState<Saegewerk[]>(SAEGEWERKE);
  const [preistabelle, setPreistabelle] = useState(INITIAL_PREISTABELLE);

  const updateAufschlag = (index: number, value: number) => {
    setAufschlaege((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], aufschlagEuro: value };
      return updated;
    });
  };

  const updateSaegewerk = (id: string, field: keyof Saegewerk, value: string) => {
    setSaegewerke((prev) =>
      prev.map((sw) => (sw.id === id ? { ...sw, [field]: value } : sw))
    );
  };

  const updatePreis = (key: string, value: number) => {
    setPreistabelle((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Einstellungen</h1>

      <Tabs defaultValue="preistabelle">
        <TabsList className="mb-6">
          <TabsTrigger value="preistabelle">Preistabelle</TabsTrigger>
          <TabsTrigger value="aufschlaege">Aufschläge</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="saegewerke">Sägewerke</TabsTrigger>
        </TabsList>

        {/* Preistabelle */}
        <TabsContent value="preistabelle">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Standardpreise (EUR/FMO)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Preise nach Holzart, Güteklasse und Stärkeklasse
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holzart</TableHead>
                    <TableHead>Güteklasse</TableHead>
                    <TableHead>Stärkeklasse</TableHead>
                    <TableHead className="text-right">Preis (EUR/FMO)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(preistabelle).map(([key, preis]) => {
                    const [holzart, guete, staerke] = key.split("-");
                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{getHolzartName(holzart)}</TableCell>
                        <TableCell>{guete}</TableCell>
                        <TableCell>{staerke.toUpperCase()}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            step="0.50"
                            value={preis}
                            onChange={(e) => updatePreis(key, parseFloat(e.target.value) || 0)}
                            className="w-28 text-right ml-auto"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Button
                className="mt-4"
                onClick={() => toast.success("Preistabelle gespeichert")}
              >
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aufschläge */}
        <TabsContent value="aufschlaege">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aufschlags-Konfiguration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Standardaufschlag pro Holzart und Güteklasse
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Holzart</TableHead>
                    <TableHead>Güteklasse</TableHead>
                    <TableHead className="text-right">Aufschlag (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aufschlaege.map((config, idx) => (
                    <TableRow key={`${config.holzart}-${config.gueteklasse}`}>
                      <TableCell className="font-medium">{getHolzartName(config.holzart)}</TableCell>
                      <TableCell>{config.gueteklasse}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          step="0.50"
                          value={config.aufschlagEuro}
                          onChange={(e) =>
                            updateAufschlag(idx, parseFloat(e.target.value) || 0)
                          }
                          className="w-28 text-right ml-auto"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                className="mt-4"
                onClick={() => toast.success("Aufschläge gespeichert")}
              >
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transport */}
        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transportkosten</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pauschale pro Fuhre
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm space-y-4">
                <div>
                  <label className="text-sm font-medium">Pauschale pro Fuhre (€)</label>
                  <Input
                    type="number"
                    step="10"
                    value={transport}
                    onChange={(e) => setTransport(parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={() => toast.success("Transportkosten gespeichert")}>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sägewerke */}
        <TabsContent value="saegewerke">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sägewerk-Verwaltung</CardTitle>
              <p className="text-sm text-muted-foreground">
                Verwaltung der registrierten Sägewerke
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {saegewerke.map((sw) => (
                  <div key={sw.id} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={sw.name}
                          onChange={(e) => updateSaegewerk(sw.id, "name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">E-Mail</label>
                        <Input
                          value={sw.email}
                          onChange={(e) => updateSaegewerk(sw.id, "email", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Adresse</label>
                        <Input
                          value={sw.adresse}
                          onChange={(e) => updateSaegewerk(sw.id, "adresse", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="mt-4"
                onClick={() => toast.success("Sägewerke gespeichert")}
              >
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
