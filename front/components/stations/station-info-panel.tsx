"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Phone, Clock, MapPin, User, Trash2, Pencil } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StarRating } from "./star-rating";
import { UpdateStationSheet } from "./update-station-sheet";
import { deleteStation } from "@/lib/api";
import type { Station } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

const TYPE_COLORS: Record<string, string> = {
  "Policia Nacional": "bg-[#1a237e] text-white",
  "Policia Municipal": "bg-blue-700 text-white",
  "Bombero Municipal": "bg-[#c62828] text-white",
  "Bombero Voluntario": "bg-red-700 text-white",
};

interface StationInfoPanelProps {
  station: Station | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function StationInfoPanel({
  station,
  open,
  onClose,
  onRefresh,
}: StationInfoPanelProps) {
  const { token, isAdmin } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  async function handleDelete() {
    if (!station || !token) return;
    setDeleting(true);
    try {
      const res = await deleteStation(token, station._id);
      toast.success(res.message ?? "Estación eliminada");
      onClose();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (!station) return null;

  const hours = station.businessHours
    ? station.businessHours.replace(/,/g, "\n")
    : null;

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent side="right" className="w-[340px] sm:w-[400px]">
          <SheetHeader className="space-y-2">
            <SheetTitle className="text-base leading-tight pr-6">
              {station.name}
            </SheetTitle>
            <Badge
              className={`w-fit text-xs ${TYPE_COLORS[station.type] ?? "bg-gray-600 text-white"}`}
            >
              {station.type}
            </Badge>
          </SheetHeader>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span>{station.address}</span>
            </div>
            {station.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span>{station.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Clasificación:</span>
              <StarRating value={station.rating} />
            </div>
            {hours && (
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                <pre className="text-xs font-sans whitespace-pre-wrap">{hours}</pre>
              </div>
            )}
            {station.user?.name && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Creado por {station.user.name}</span>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 mt-6">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => setUpdateOpen(true)}
              >
                <Pencil className="w-3.5 h-3.5" />
                Actualizar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 gap-1"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Borrar
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La estación &quot;{station.name}&quot; será
              eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdateStationSheet
        station={station}
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        onRefresh={() => {
          setUpdateOpen(false);
          onRefresh();
        }}
      />
    </>
  );
}
