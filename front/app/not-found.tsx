import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafafa] text-center px-4">
      <div className="text-8xl font-extrabold text-[#1a237e] mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Página no encontrada
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        La página que buscas no existe o fue movida. Verifica la URL o regresa
        al inicio.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants(), "bg-[#1a237e] hover:bg-[#0d1557]")}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
