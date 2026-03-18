"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil } from "lucide-react";
import { BAUERN } from "@/data/mock-data";
import type { Bauer, UstStatus } from "@/lib/types";

export default function BauernPage() {
  const [bauern, setBauern] = useState<Bauer[]>(BAUERN);
  const [suchbegriff, setSuchbegriff] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Neuer Bauer Form State
  const [formName, setFormName] = useState("");
  const [formAdresse, setFormAdresse] = useState("");
  const [formUst, setFormUst] = useState<UstStatus>("pauschaliert");

  const filtered = bauern.filter((b) =>
    b.name.toLowerCase().includes(suchbegriff.toLowerCase()) ||
    b.kundennr.toLowerCase().includes(suchbegriff.toLowerCase())
  );

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("Bitte Name eingeben");
      return;
    }

    if (editId) {
      setBauern((prev) =>
        prev.map((b) =>
          b.id === editId
            ? { ...b, name: formName, adresse: formAdresse, ustStatus: formUst }
            : b
        )
      );
      toast.success("Bauer aktualisiert");
    } else {
      const newBauer: Bauer = {
        id: `b${Date.now()}`,
        kundennr: `K-2026-${String(bauern.length + 1).padStart(3, "0")}`,
        name: formName,
        adresse: formAdresse,
        ustStatus: formUst,
      };
      setBauern((prev) => [...prev, newBauer]);
      toast.success("Neuer Bauer angelegt");
    }

    resetForm();
    setDialogOpen(false);
  };

  const startEdit = (bauer: Bauer) => {
    setEditId(bauer.id);
    setFormName(bauer.name);
    setFormAdresse(bauer.adresse);
    setFormUst(bauer.ustStatus);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setFormName("");
    setFormAdresse("");
    setFormUst("pauschaliert");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bauern-Stammdaten</h1>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />
            Neuen Bauern anlegen
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Bauer bearbeiten" : "Neuen Bauern anlegen"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Vor- und Nachname"
                />
              </div>
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={formAdresse}
                  onChange={(e) => setFormAdresse(e.target.value)}
                  placeholder="Straße Nr., PLZ Ort"
                />
              </div>
              <div>
                <Label htmlFor="ust">USt-Status</Label>
                <Select value={formUst} onValueChange={(v) => v && setFormUst(v as UstStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pauschaliert">Pauschaliert (13% USt)</SelectItem>
                    <SelectItem value="ea-rechner">E-A-Rechner (20% USt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full">
                {editId ? "Speichern" : "Anlegen"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Suchfeld */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Name oder Kundennr. suchen..."
          value={suchbegriff}
          onChange={(e) => setSuchbegriff(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabelle */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Kundennr.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Adresse</TableHead>
                <TableHead>USt-Status</TableHead>
                <TableHead className="w-20">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bauer) => (
                <TableRow key={bauer.id}>
                  <TableCell className="hidden sm:table-cell font-mono text-sm">{bauer.kundennr}</TableCell>
                  <TableCell className="font-medium">{bauer.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{bauer.adresse}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        bauer.ustStatus === "pauschaliert"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                      }
                    >
                      {bauer.ustStatus === "pauschaliert" ? "Pauschaliert" : "E-A-Rechner"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(bauer)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Keine Bauern gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
