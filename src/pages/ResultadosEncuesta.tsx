import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultsCharts } from "@/components/results-charts";
import { ExportButton } from "@/components/export-button";

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

type Answer = {
  id: string;
  question_id: string;
  respuesta: string;
};

type Response = {
  id: string;
  respondente_nombre: string | null;
  respondente_email: string | null;
  created_at: string;
  answers: Answer[];
};

export default function ResultadosEncuesta() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
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

      // Fetch responses with answers
      const { data: responsesData } = await supabase
        .from("responses")
        .select(`
          id,
          respondente_nombre,
          respondente_email,
          created_at,
          answers:answers(
            id,
            question_id,
            respuesta
          )
        `)
        .eq("survey_id", id)
        .order("created_at", { ascending: false });

      setResponses(responsesData || []);
      setLoading(false);
    }

    loadData();
  }, [id, navigate]);

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link to={`/dashboard/encuestas/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Encuesta
            </Link>
          </Button>
          <ExportButton
            survey={survey}
            questions={questions}
            responses={responses}
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resultados: {survey.titulo}</h1>
            <p className="text-muted-foreground">
              {responses.length} respuestas recibidas
            </p>
          </div>

          {responses.length > 0 ? (
            <>
              <ResultsCharts
                questions={questions}
                responses={responses}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Respuestas Individuales</CardTitle>
                  <CardDescription>
                    Todas las respuestas en orden cronológico
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {responses.map((response, index) => (
                      <div key={response.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold">Respuesta #{responses.length - index}</p>
                            {response.respondente_nombre && (
                              <p className="text-sm text-muted-foreground">
                                {response.respondente_nombre}
                                {response.respondente_email && ` (${response.respondente_email})`}
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(response.created_at).toLocaleString('es-ES')}
                          </p>
                        </div>
                        <div className="space-y-3">
                          {questions.map((question) => {
                            const answer = response.answers?.find(
                              (a) => a.question_id === question.id
                            );
                            return (
                              <div key={question.id} className="border-t pt-3">
                                <p className="text-sm font-medium mb-1">{question.pregunta}</p>
                                <p className="text-sm text-muted-foreground">
                                  {answer?.respuesta || "Sin respuesta"}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  Aún no hay respuestas para esta encuesta
                </p>
                <Button asChild>
                  <Link to={`/dashboard/encuestas/${id}`}>
                    Compartir Encuesta
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
