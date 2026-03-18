import { Badge } from "@/components/ui/badge";
import type { AbrechnungsStatus, KonfidenzLevel } from "@/lib/types";

const statusConfig: Record<AbrechnungsStatus, { label: string; className: string }> = {
  neu: {
    label: "Neu",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  in_pruefung: {
    label: "In Prüfung",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
  freigegeben: {
    label: "Freigegeben",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
};

export function StatusBadge({ status }: { status: AbrechnungsStatus }) {
  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}

const konfidenzConfig: Record<KonfidenzLevel, { label: string; className: string }> = {
  hoch: {
    label: "Hohe Konfidenz",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  mittel: {
    label: "Bitte prüfen",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  niedrig: {
    label: "Manuelle Prüfung nötig",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

export function KonfidenzBadge({ level }: { level: KonfidenzLevel }) {
  const config = konfidenzConfig[level];
  return <Badge className={config.className}>{config.label}</Badge>;
}
