"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createStation } from "@/lib/api";
import { STATION_TYPES, latLngOutOfBounds } from "@/lib/constants";
import type { StationType } from "@/lib/types";
import { useAuth } from "@/context/auth-context";

interface CreateStationDialogProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  locationPickMode: boolean;
  onEnableLocationPick: () => void;
  pendingPin: { lat: number; lng: number } | null;
  onClearPin: () => void;
}

export function CreateStationDialog({
  open,
  onClose,
  onRefresh,
  locationPickMode,
  onEnableLocationPick,
  pendingPin,
  onClearPin,
}: CreateStationDialogProps) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    type: "" as StationType | "",
    phone: "",
    address: "",
    rating: "",
    businessHours: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleClose() {
    setForm({ name: "", type: "", phone: "", address: "", rating: "", businessHours: "" });
    onClearPin();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.type) { toast.error("Selecciona un tipo de estación"); return; }
    if (!pendingPin) { toast.error("Selecciona la ubicación en el mapa"); return; }
    if (latLngOutOfBounds(pendingPin.lat, pendingPin.lng)) {
      toast.error("La ubicación debe estar dentro de Guatemala");
      return;
    }
    const rating = parseFloat(form.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      toast.error("La clasificación debe estar entre 0 y 5");
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      const res = await createStation(token, {
        name: form.name,
        type: form.type as StationType,
        phone: form.phone,
        address: form.address,
        rating,
        businessHours: form.businessHours,
        lat: pendingPin.lat,
        lng: pendingPin.lng,
      });
      toast.success(res.message ?? "Estación creada");
      handleClose();
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear estación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar estación</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="cr-name">Nombre *</Label>
            <Input
              id="cr-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cr-type">Tipo *</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((p) => ({ ...p, type: v as StationType }))}
            >
              <SelectTrigger id="cr-type">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {STATION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="cr-address">Dirección *</Label>
            <Input
              id="cr-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cr-phone">Teléfono</Label>
            <Input
              id="cr-phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cr-rating">Clasificación (0–5)</Label>
            <Input
              id="cr-rating"
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
            <Label htmlFor="cr-hours">Horario</Label>
            <textarea
              id="cr-hours"
              name="businessHours"
              value={form.businessHours}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Lunes–Viernes: 8:00–18:00"
            />
          </div>

          <div className="space-y-1">
            <Label>Ubicación en el mapa *</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={locationPickMode ? "default" : "outline"}
                size="sm"
                className={locationPickMode ? "bg-[#1a237e]" : ""}
                onClick={onEnableLocationPick}
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {locationPickMode ? "Haz clic en el mapa..." : "Seleccionar ubicación"}
              </Button>
              {pendingPin && (
                <Badge variant="outline" className="text-xs text-green-700 border-green-700">
                  ✓ {pendingPin.lat.toFixed(4)}, {pendingPin.lng.toFixed(4)}
                </Badge>
              )}
            </div>
            {pendingPin && latLngOutOfBounds(pendingPin.lat, pendingPin.lng) && (
              <p className="text-xs text-destructive">
                Ubicación fuera de Guatemala
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#1a237e] hover:bg-[#0d1557]"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear estación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
