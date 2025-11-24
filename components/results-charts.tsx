"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Question = {
  id: string;
  pregunta: string;
  tipo: string;
  opciones: string[] | null;
};

type Response = {
  id: string;
  answers: Array<{
    question_id: string;
    respuesta: string;
  }>;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ResultsCharts({ questions, responses }: { questions: Question[]; responses: Response[] }) {
  const getQuestionData = (question: Question) => {
    const answers = responses.flatMap(r => 
      r.answers.filter(a => a.question_id === question.id).map(a => a.respuesta)
    );

    if (question.tipo === 'opcion_multiple' && question.opciones) {
      const counts = question.opciones.reduce((acc, option) => {
        acc[option] = answers.filter(a => a === option).length;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    if (question.tipo === 'calificacion') {
      const counts = [1, 2, 3, 4, 5].reduce((acc, rating) => {
        acc[rating] = answers.filter(a => a === rating.toString()).length;
        return acc;
      }, {} as Record<number, number>);

      return Object.entries(counts).map(([name, value]) => ({ 
        name: `${name} ⭐`, 
        value 
      }));
    }

    if (question.tipo === 'si_no') {
      const siCount = answers.filter(a => a === 'Sí').length;
      const noCount = answers.filter(a => a === 'No').length;
      return [
        { name: 'Sí', value: siCount },
        { name: 'No', value: noCount }
      ];
    }

    return [];
  };

  const getAverageRating = (question: Question) => {
    if (question.tipo !== 'calificacion') return null;
    
    const answers = responses.flatMap(r => 
      r.answers.filter(a => a.question_id === question.id).map(a => parseInt(a.respuesta))
    );

    if (answers.length === 0) return null;
    
    const sum = answers.reduce((acc, val) => acc + val, 0);
    return (sum / answers.length).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const data = getQuestionData(question);
        const avgRating = getAverageRating(question);

        if (question.tipo === 'texto') {
          const textAnswers = responses.flatMap(r => 
            r.answers.filter(a => a.question_id === question.id).map(a => a.respuesta)
          );

          return (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">{question.pregunta}</CardTitle>
                <CardDescription>Respuestas de texto ({textAnswers.length})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {textAnswers.map((answer, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        }

        if (data.length === 0) return null;

        return (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">{question.pregunta}</CardTitle>
              <CardDescription>
                {responses.length} respuestas
                {avgRating && ` • Promedio: ${avgRating} ⭐`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {item.value} ({((item.value / responses.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
