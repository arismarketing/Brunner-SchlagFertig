"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText, AlertCircle, TrendingUp } from "lucide-react";
import {
  ABRECHNUNGEN,
  getSaegwerkName,
  getBauerName,
  berechneAbrechnungsSumme,
  berechneGesamtFmo,
} from "@/data/mock-data";

export default function DashboardPage() {
  const neueCount = ABRECHNUNGEN.filter((a) => a.status === "neu").length;
  const pruefungCount = ABRECHNUNGEN.filter((a) => a.status === "in_pruefung").length;
  const gesamtFmo = ABRECHNUNGEN.reduce((sum, a) => sum + berechneGesamtFmo(a), 0);
  const letzteFuenf = [...ABRECHNUNGEN]
    .sort((a, b) => b.datum.localeCompare(a.datum))
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Kacheln */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Neue Abrechnungen
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{neueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">warten auf Bearbeitung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offene Validierungen
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pruefungCount}</div>
            <p className="text-xs text-muted-foreground mt-1">in Prüfung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gesamt-FMO diesen Monat
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {gesamtFmo.toLocaleString("de-AT", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Festmeter ohne Rinde</p>
          </CardContent>
        </Card>
      </div>

      {/* Letzte Abrechnungen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Letzte Abrechnungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Sägewerk</TableHead>
                <TableHead className="hidden sm:table-cell">Lieferschein</TableHead>
                <TableHead className="hidden md:table-cell">Bauer</TableHead>
                <TableHead className="hidden sm:table-cell">Menge</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {letzteFuenf.map((abr) => (
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
                  <TableCell className="hidden sm:table-cell">
                    <Link href={`/abrechnungen/${abr.id}`} className="block font-mono text-sm">
                      {abr.lieferscheinNr}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Link href={`/abrechnungen/${abr.id}`} className="block">
                      {getBauerName(abr.bauerId)}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Link href={`/abrechnungen/${abr.id}`} className="block">
                      {berechneGesamtFmo(abr).toLocaleString("de-AT", { minimumFractionDigits: 2 })} FMO
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
