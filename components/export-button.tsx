"use client";

import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

type Question = {
  id: string;
  pregunta: string;
  tipo: string;
};

type Response = {
  id: string;
  respondente_nombre: string | null;
  respondente_email: string | null;
  created_at: string;
  answers: Array<{
    question_id: string;
    respuesta: string;
  }>;
};

type Survey = {
  titulo: string;
  descripcion: string | null;
};

export function ExportButton({ survey, questions, responses }: { 
  survey: Survey; 
  questions: Question[]; 
  responses: Response[] 
}) {
  const exportToCSV = () => {
    if (responses.length === 0) {
      alert("No hay respuestas para exportar");
      return;
    }

    // Create CSV header
    const headers = [
      'Fecha',
      'Nombre',
      'Email',
      ...questions.map(q => q.pregunta)
    ];

    // Create CSV rows
    const rows = responses.map(response => {
      const row = [
        new Date(response.created_at).toLocaleString('es-ES'),
        response.respondente_nombre || '',
        response.respondente_email || '',
        ...questions.map(question => {
          const answer = response.answers.find(a => a.question_id === question.id);
          return answer ? `"${answer.respuesta.replace(/"/g, '""')}"` : '';
        })
      ];
      return row.join(',');
    });

    // Combine header and rows
    const csv = [headers.join(','), ...rows].join('\n');

    // Create blob and download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${survey.titulo.replace(/[^a-z0-9]/gi, '_')}_resultados.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={exportToCSV} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Exportar a CSV
    </Button>
  );
}
