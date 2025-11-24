import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from 'next/navigation';
import { ResultsCharts } from "@/components/results-charts";
import { ExportButton } from "@/components/export-button";

// Enable dynamic params for this route
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Fetch survey
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (surveyError || !survey) {
    notFound();
  }

  // Fetch questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", id)
    .order("orden", { ascending: true });

  // Fetch responses with answers
  const { data: responses } = await supabase
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

  return (
    <div className="flex flex-col min-h-svh bg-muted/40">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/encuestas/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Encuesta
            </Link>
          </Button>
          <ExportButton
            survey={survey}
            questions={questions || []}
            responses={responses || []}
          />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resultados: {survey.titulo}</h1>
            <p className="text-muted-foreground">
              {responses?.length || 0} respuestas recibidas
            </p>
          </div>

          {responses && responses.length > 0 ? (
            <>
              <ResultsCharts
                questions={questions || []}
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
                    {responses.map((response: any, index: number) => (
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
                          {questions?.map((question) => {
                            const answer = response.answers?.find(
                              (a: any) => a.question_id === question.id
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
                  <Link href={`/dashboard/encuestas/${id}`}>
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
