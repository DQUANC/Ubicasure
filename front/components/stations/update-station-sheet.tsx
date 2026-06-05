"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateStation } from "@/lib/api";
import type { Station } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

interface UpdateStationSheetProps {
  station: Station | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export function UpdateStationSheet({
  station,
  open,
  onClose,
  onRefresh,
}: UpdateStationSheetProps) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    rating: "",
    businessHours: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (station) {
      setForm({
        name: station.name,
        phone: station.phone ?? "",
        rating: String(station.rating ?? ""),
        businessHours: station.businessHours ?? "",
      });
    }
  }, [station]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!station || !token) return;
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      toast.error("La clasificación debe estar entre 0 y 5");
      return;
    }
    setLoading(true);
    try {
      const res = await updateStation(token, station._id, {
        name: form.name,
        phone: form.phone,
        rating,
        businessHours: form.businessHours,
      });
      toast.success(res.message ?? "Estación actualizada");
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-[340px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Actualizar estación</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="upd-name">Nombre</Label>
            <Input
              id="upd-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="upd-phone">Teléfono</Label>
            <Input
              id="upd-phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="upd-rating">Clasificación (0–5)</Label>
            <Input
              id="upd-rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="upd-hours">Horario</Label>
            <textarea
              id="upd-hours"
              name="businessHours"
              value={form.businessHours}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Lunes: 8:00 - 18:00&#10;Martes: 8:00 - 18:00"
            />
          </div>
          <SheetFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#1a237e] hover:bg-[#0d1557]"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
