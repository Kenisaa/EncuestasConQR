import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode, Eye, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Survey = {
  id: string;
  titulo: string;
  descripcion: string | null;
  activa: boolean;
  created_at: string;
};

type Question = {
  id: string;
  pregunta: string;
  tipo: string;
  requerida: boolean;
  opciones: string[] | null;
  orden: number;
};

export default function DetalleEncuesta() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responsesCount, setResponsesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      if (!id) {
        navigate("/dashboard");
        return;
      }

      // Fetch survey
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (surveyError || !surveyData) {
        navigate("/dashboard");
        return;
      }

      setSurvey(surveyData);

      // Fetch questions
      const { data: questionsData } = await supabase
        .from("questions")
        .select("*")
        .eq("survey_id", id)
        .order("orden", { ascending: true });

      setQuestions(questionsData || []);

      // Count responses
      const { count } = await supabase
        .from("responses")
        .select("*", { count: "exact", head: true })
        .eq("survey_id", id);

      setResponsesCount(count || 0);
      setLoading(false);
    }

    loadData();
  }, [id, navigate]);

  const surveyUrl = `${window.location.origin}/encuesta/${id}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(surveyUrl);
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-svh bg-muted/40">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{survey.titulo}</h1>
              {survey.descripcion && (
                <p className="text-muted-foreground">{survey.descripcion}</p>
              )}
            </div>
            <Badge variant={survey.activa ? "default" : "secondary"}>
              {survey.activa ? "Activa" : "Inactiva"}
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Respuestas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{responsesCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Preguntas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{questions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {survey.activa ? "Recibiendo respuestas" : "Pausada"}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Código QR
                </CardTitle>
                <CardDescription>
                  Comparte este código para que las personas respondan tu encuesta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeDisplay url={surveyUrl} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
                <CardDescription>
                  Administra y visualiza tu encuesta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/encuesta/${id}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to={`/dashboard/encuestas/${id}/resultados`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Resultados
                  </Link>
                </Button>
                <div className="pt-3 border-t">
                  <Label className="text-sm font-medium mb-2 block">URL de la Encuesta</Label>
                  <div className="flex gap-2">
                    <Input value={surveyUrl} readOnly className="text-sm" />
                    <Button
                      variant="outline"
                      onClick={handleCopyUrl}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Preguntas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">
                        {index + 1}. {question.pregunta}
                      </p>
                      {question.requerida && (
                        <Badge variant="outline" className="text-xs">Requerida</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tipo: {question.tipo === 'texto' ? 'Texto' :
                             question.tipo === 'opcion_multiple' ? 'Opción Múltiple' :
                             question.tipo === 'calificacion' ? 'Calificación' : 'Sí/No'}
                    </p>
                    {question.opciones && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Opciones:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          {question.opciones.map((option: string, i: number) => (
                            <li key={i}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
