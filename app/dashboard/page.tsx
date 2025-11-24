import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ClipboardList, LogOut } from 'lucide-react';
import { SurveyList } from "@/components/survey-list";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  const { data: surveys } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            <span className="text-xl font-bold">Mis Encuestas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <form action="/api/auth/logout" method="post">
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
            <p className="text-muted-foreground">
              Administra tus encuestas y visualiza respuestas
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/encuestas/nueva">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Encuesta
            </Link>
          </Button>
        </div>

        <SurveyList surveys={surveys || []} />
      </main>
    </div>
  );
}
