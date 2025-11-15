import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RegistroExito() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-muted/40">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              ¡Gracias por registrarte!
            </CardTitle>
            <CardDescription>Revisa tu correo para confirmar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Te hemos enviado un correo de confirmación. Por favor, verifica tu correo antes de iniciar sesión.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">
                Ir a Iniciar Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
