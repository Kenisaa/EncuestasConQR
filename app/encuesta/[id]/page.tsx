import { createClient } from "@/lib/supabase/server";
import { notFound } from 'next/navigation';
import { SurveyResponseForm } from "@/components/survey-response-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Enable dynamic params for this route
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function PublicSurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch survey details
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("activa", true)
    .single();

  if (surveyError || !survey) {
    notFound();
  }

  // Fetch questions
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("survey_id", id)
    .order("orden", { ascending: true });

  if (questionsError) {
    notFound();
  }

  return (
    <div className="min-h-svh bg-muted/40 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{survey.titulo}</CardTitle>
            {survey.descripcion && (
              <CardDescription className="text-base">{survey.descripcion}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <SurveyResponseForm survey={survey} questions={questions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
