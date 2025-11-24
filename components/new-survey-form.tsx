import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

type QuestionType = "texto" | "opcion_multiple" | "calificacion" | "si_no";

type Question = {
  pregunta: string;
  tipo: QuestionType;
  opciones?: string[];
  requerida: boolean;
};

export function NewSurveyForm({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activa, setActiva] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    { pregunta: "", tipo: "texto", requerida: false }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { pregunta: "", tipo: "texto", requerida: false }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    const options = updated[questionIndex].opciones || [];
    updated[questionIndex].opciones = [...options, ""];
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].opciones || [])];
    options[optionIndex] = value;
    updated[questionIndex].opciones = options;
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    const options = updated[questionIndex].opciones || [];
    updated[questionIndex].opciones = options.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      // Create survey
      const { data: surveyData, error: surveyError } = await supabase
        .from("surveys")
        .insert({
          user_id: userId,
          titulo,
          descripcion: descripcion || null,
          activa,
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Create questions
      const questionsToInsert = questions.map((q, index) => ({
        survey_id: surveyData.id,
        pregunta: q.pregunta,
        tipo: q.tipo,
        opciones: q.tipo === "opcion_multiple" ? q.opciones : null,
        orden: index,
        requerida: q.requerida,
      }));

      const { error: questionsError } = await supabase
        .from("questions")
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      navigate("/dashboard");
    } catch (err) {
      console.error("[v0] Error creating survey:", err);
      setError(err instanceof Error ? err.message : "Error al crear la encuesta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la Encuesta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="Nombre de tu encuesta"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el propósito de tu encuesta"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="activa"
              checked={activa}
              onCheckedChange={setActiva}
            />
            <Label htmlFor="activa">Encuesta activa</Label>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Preguntas</h2>
          <Button type="button" onClick={addQuestion} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Pregunta
          </Button>
        </div>

        {questions.map((question, qIndex) => (
          <Card key={qIndex}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pregunta {qIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pregunta</Label>
                <Input
                  placeholder="Escribe tu pregunta"
                  value={question.pregunta}
                  onChange={(e) => updateQuestion(qIndex, "pregunta", e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={question.tipo}
                    onValueChange={(value) => updateQuestion(qIndex, "tipo", value as QuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="texto">Texto</SelectItem>
                      <SelectItem value="opcion_multiple">Opción Múltiple</SelectItem>
                      <SelectItem value="calificacion">Calificación (1-5)</SelectItem>
                      <SelectItem value="si_no">Sí/No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={question.requerida}
                      onCheckedChange={(checked) => updateQuestion(qIndex, "requerida", checked)}
                    />
                    <Label>Requerida</Label>
                  </div>
                </div>
              </div>

              {question.tipo === "opcion_multiple" && (
                <div className="space-y-2">
                  <Label>Opciones</Label>
                  {(question.opciones || []).map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2">
                      <Input
                        placeholder={`Opción ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(qIndex, oIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(qIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Opción
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading ? "Creando..." : "Crear Encuesta"}
        </Button>
        <Button type="button" variant="outline" size="lg" asChild>
          <Link to="/dashboard">Cancelar</Link>
        </Button>
      </div>
    </form>
  );
}
