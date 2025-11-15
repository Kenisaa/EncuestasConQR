import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { NewSurveyForm } from "@/components/new-survey-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';

export default async function NewSurveyPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Crear Nueva Encuesta</h1>
          <NewSurveyForm userId={user.id} />
        </div>
      </main>
    </div>
  );
}
