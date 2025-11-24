import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, QrCode, Eye, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { CopyButton } from "@/components/copy-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { notFound } from 'next/navigation';

// Enable dynamic params for this route
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Count responses
  const { count: responsesCount } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", id);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? `https://${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.replace('.supabase.co', '')}.vercel.app`
      : 'http://localhost:3000';
  const surveyUrl = `${baseUrl}/encuesta/${id}`;

  return (
    <div className="flex flex-col min-h-svh bg-muted/40">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
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
                <div className="text-3xl font-bold">{responsesCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Preguntas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{questions?.length || 0}</div>
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
                  <Link href={`/encuesta/${id}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/encuestas/${id}/resultados`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Resultados
                  </Link>
                </Button>
                <div className="pt-3 border-t">
                  <Label className="text-sm font-medium mb-2 block">URL de la Encuesta</Label>
                  <div className="flex gap-2">
                    <Input value={surveyUrl} readOnly className="text-sm" />
                    <CopyButton text={surveyUrl} />
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
                {questions?.map((question, index) => (
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
