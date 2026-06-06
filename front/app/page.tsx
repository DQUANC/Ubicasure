import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left — brand pane */}
      <div className="flex flex-col justify-center px-10 md:px-16 w-full md:w-1/2 bg-white">
        <div className="max-w-sm">
          <h1 className="text-5xl font-extrabold text-[#1a237e] tracking-tight mb-2">
            UBICASURE
          </h1>
          <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider">
            Guatemala, Guatemala
          </p>
          <p className="text-gray-600 mt-4 mb-8 leading-relaxed">
            Encuentra estaciones de policía y bomberos en Guatemala al
            instante. Información actualizada, marcadores interactivos y acceso
            rápido a servicios de emergencia.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className={cn(buttonVariants(), "bg-[#1a237e] hover:bg-[#0d1557] px-6")}
            >
              Ingresar
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "outline" }), "px-6")}
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>

      {/* Right — photo pane */}
      <div className="hidden md:block md:w-1/2 relative bg-[#c62828]">
        <Image
          src="/img/palacioNacional.jpg"
          alt="Palacio Nacional de Guatemala"
          fill
          className="object-cover opacity-80 mix-blend-multiply"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a237e]/60 to-[#c62828]/60" />
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-lg font-semibold">Servicios de emergencia</p>
          <p className="text-sm text-white/70">en la palma de tu mano</p>
        </div>
      </div>
    </div>
  );
}
