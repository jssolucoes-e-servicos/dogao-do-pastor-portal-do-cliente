'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ErrorOfflinePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Ops! Servidor indisponível
        </h1>
        <p className="text-gray-600 mb-6">
          Nosso sistema está temporariamente fora do ar.
          Pode ser uma manutenção ou instabilidade no servidor.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link href="/">Voltar para a Home</Link>
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()} // 🔥 volta para a página anterior
          >
            Tentar novamente
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Se o problema persistir, entre em contato com o suporte.
        </p>
      </div>
    </main>
  );
}
