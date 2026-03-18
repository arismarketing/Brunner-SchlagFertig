"use client";

import { useState } from "react";
import Link from "next/link";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText } from "lucide-react";
import {
  ABRECHNUNGEN,
  SAEGEWERKE,
  getSaegwerkName,
  getBauerName,
  berechneAbrechnungsSumme,
  berechneGesamtFmo,
} from "@/data/mock-data";

export default function AbrechnungenPage() {
  const [filterSaegewerk, setFilterSaegewerk] = useState<string>("alle");
  const [filterStatus, setFilterStatus] = useState<string>("alle");

  const filtered = ABRECHNUNGEN.filter((abr) => {
    if (filterSaegewerk !== "alle" && abr.saegwerkId !== filterSaegewerk) return false;
    if (filterStatus !== "alle" && abr.status !== filterStatus) return false;
    return true;
  }).sort((a, b) => b.datum.localeCompare(a.datum));

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Abrechnungen</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-6">
        <Select value={filterSaegewerk} onValueChange={(v) => v && setFilterSaegewerk(v)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Sägewerk filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Sägewerke</SelectItem>
            {SAEGEWERKE.map((sw) => (
              <SelectItem key={sw.id} value={sw.id}>
                {sw.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => v && setFilterStatus(v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle Status</SelectItem>
            <SelectItem value="neu">Neu</SelectItem>
            <SelectItem value="in_pruefung">In Prüfung</SelectItem>
            <SelectItem value="freigegeben">Freigegeben</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabelle */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Sägewerk</TableHead>
                <TableHead>Lieferschein-Nr.</TableHead>
                <TableHead>Bauer</TableHead>
                <TableHead>Menge (FMO)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead className="w-10">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((abr) => (
                <TableRow key={abr.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/abrechnungen/${abr.id}`} className="block">
                      {new Date(abr.datum).toLocaleDateString("de-AT")}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/abrechnungen/${abr.id}`} className="block">
                      {getSaegwerkName(abr.saegwerkId)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/abrechnungen/${abr.id}`} className="block font-mono text-sm">
                      {abr.lieferscheinNr}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/abrechnungen/${abr.id}`} className="block">
                      {getBauerName(abr.bauerId)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/abrechnungen/${abr.id}`} className="block">
                      {berechneGesamtFmo(abr).toLocaleString("de-AT", { minimumFractionDigits: 2 })}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/abrechnungen/${abr.id}`}>
                      <StatusBadge status={abr.status} />
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/abrechnungen/${abr.id}`} className="block font-medium">
                      {berechneAbrechnungsSumme(abr).toLocaleString("de-AT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/demo/${abr.id}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="Original-PDF anzeigen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    Keine Abrechnungen gefunden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
