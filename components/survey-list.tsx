import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Eye, BarChart3, Settings } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Survey = {
  id: string;
  titulo: string;
  descripcion: string | null;
  activa: boolean;
  created_at: string;
};

export function SurveyList({ surveys }: { surveys: Survey[] }) {
  if (surveys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">
            No tienes encuestas todavía
          </p>
          <Button asChild>
            <Link to="/dashboard/encuestas/nueva">Crear tu primera encuesta</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {surveys.map((survey) => (
        <Card key={survey.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{survey.titulo}</CardTitle>
                {survey.descripcion && (
                  <CardDescription className="mt-1 line-clamp-2">
                    {survey.descripcion}
                  </CardDescription>
                )}
              </div>
              <Badge variant={survey.activa ? "default" : "secondary"}>
                {survey.activa ? "Activa" : "Inactiva"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Creada {formatDistanceToNow(new Date(survey.created_at), { addSuffix: true, locale: es })}
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={`/dashboard/encuestas/${survey.id}`}>
                <Settings className="h-4 w-4 mr-1" />
                Editar
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/dashboard/encuestas/${survey.id}/resultados`}>
                <BarChart3 className="h-4 w-4 mr-1" />
                Ver
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/encuesta/${survey.id}`} target="_blank">
                <Eye className="h-4 w-4 mr-1" />
                Vista
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
