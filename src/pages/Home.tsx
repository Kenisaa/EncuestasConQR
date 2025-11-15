import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, PieChart, ClipboardList } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            <span className="text-xl font-bold">Sistema de Encuestas</span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link to="/registro">Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Crea Encuestas con Códigos QR
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Diseña, comparte y analiza encuestas de forma rápida y sencilla. Genera códigos QR para facilitar la recolección de respuestas.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/registro">Comenzar Gratis</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Ya tengo cuenta</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16 border-t">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                <ClipboardList className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-muted-foreground">
                Crea encuestas en minutos con nuestra interfaz intuitiva
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Códigos QR</h3>
              <p className="text-muted-foreground">
                Genera códigos QR automáticamente para compartir tus encuestas
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                <PieChart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Análisis en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Visualiza y exporta resultados con gráficos y estadísticas
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2025 Sistema de Encuestas. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
