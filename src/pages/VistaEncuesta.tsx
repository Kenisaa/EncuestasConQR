import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyResponseForm } from "@/components/survey-response-form";
import { ClipboardList } from 'lucide-react';

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

export default function VistaEncuesta() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Fetch survey
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", id)
        .single();

      if (surveyError || !surveyData) {
        setNotFound(true);
        setLoading(false);
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
      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40">
        <p>Cargando...</p>
      </div>
    );
  }

  if (notFound || !survey) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Encuesta no encontrada
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!survey.activa) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/40">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Esta encuesta ya no está activa
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-svh bg-muted/40">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            <span className="text-xl font-bold">Encuesta</span>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{survey.titulo}</CardTitle>
              {survey.descripcion && (
                <CardDescription className="text-base">
                  {survey.descripcion}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <SurveyResponseForm
                survey={survey}
                questions={questions}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
