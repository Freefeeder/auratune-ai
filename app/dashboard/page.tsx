import { Header } from "@/components/header";
import { DashboardClient } from "@/components/dashboard-client";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Esta es una página de Servidor de Next.js.
// Mantiene la página estática y rápida, mientras que el componente de cliente
// se encarga de obtener los datos dinámicos.

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Crea tu Próxima Playlist
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
            Describe cómo te sientes o qué quieres escuchar y deja que la IA haga la magia.
          </p>
        </div>
        <div className="mx-auto max-w-4xl space-y-6">
          {/*
            Usamos Suspense para mostrar un indicador de carga mientras el componente 
            de cliente (y sus datos de Firebase) se cargan.
          */}
          <Suspense fallback={
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
            <DashboardClient />
          </Suspense>
        </div>
      </main>
    </>
  );
}
