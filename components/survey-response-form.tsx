"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from 'lucide-react';

type Question = {
  id: string;
  pregunta: string;
  tipo: string;
  opciones: string[] | null;
  requerida: boolean;
  orden: number;
};

type Survey = {
  id: string;
  titulo: string;
  descripcion: string | null;
};

export function SurveyResponseForm({ survey, questions }: { survey: Survey; questions: Question[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [respondentName, setRespondentName] = useState("");
  const [respondentEmail, setRespondentEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // Validate required questions
      for (const question of questions) {
        if (question.requerida && !answers[question.id]) {
          throw new Error(`La pregunta "${question.pregunta}" es requerida`);
        }
      }

      // Create response
      const { data: responseData, error: responseError } = await supabase
        .from("responses")
        .insert({
          survey_id: survey.id,
          respondente_nombre: respondentName || null,
          respondente_email: respondentEmail || null,
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create answers
      const answersToInsert = Object.entries(answers).map(([questionId, respuesta]) => ({
        response_id: responseData.id,
        question_id: questionId,
        respuesta,
      }));

      const { error: answersError } = await supabase
        .from("answers")
        .insert(answersToInsert);

      if (answersError) throw answersError;

      setIsSubmitted(true);
    } catch (err) {
      console.error("[v0] Error submitting survey:", err);
      setError(err instanceof Error ? err.message : "Error al enviar la encuesta");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">¡Gracias por tu respuesta!</h2>
        <p className="text-muted-foreground">
          Tu opinión ha sido registrada exitosamente.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 pb-6 border-b">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre (opcional)</Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={respondentName}
            onChange={(e) => setRespondentName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico (opcional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={respondentEmail}
            onChange={(e) => setRespondentEmail(e.target.value)}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base">
                  {index + 1}. {question.pregunta}
                  {question.requerida && <span className="text-destructive ml-1">*</span>}
                </Label>
              </div>

              {question.tipo === "texto" && (
                <Textarea
                  placeholder="Tu respuesta"
                  value={answers[question.id] || ""}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  required={question.requerida}
                  rows={3}
                />
              )}

              {question.tipo === "opcion_multiple" && question.opciones && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => updateAnswer(question.id, value)}
                  required={question.requerida}
                >
                  {question.opciones.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                      <Label htmlFor={`${question.id}-${optionIndex}`} className="font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.tipo === "calificacion" && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => updateAnswer(question.id, value)}
                  required={question.requerida}
                  className="flex gap-4"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                      <Label htmlFor={`${question.id}-${rating}`} className="font-normal">
                        {rating}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.tipo === "si_no" && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => updateAnswer(question.id, value)}
                  required={question.requerida}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sí" id={`${question.id}-si`} />
                    <Label htmlFor={`${question.id}-si`} className="font-normal">Sí</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id={`${question.id}-no`} />
                    <Label htmlFor={`${question.id}-no`} className="font-normal">No</Label>
                  </div>
                </RadioGroup>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading} size="lg" className="w-full">
        {isLoading ? "Enviando..." : "Enviar Respuesta"}
      </Button>
    </form>
  );
}
