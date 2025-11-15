import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, ClipboardList, LogOut } from 'lucide-react';
import { SurveyList } from "@/components/survey-list";
import type { User } from "@supabase/supabase-js";

type Survey = {
  id: string;
  titulo: string;
  descripcion: string | null;
  activa: boolean;
  created_at: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
        return;
      }

      setUser(user);

      const { data: surveysData } = await supabase
        .from("surveys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setSurveys(surveysData || []);
      setLoading(false);
    }

    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

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
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
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
            <Link to="/dashboard/encuestas/nueva">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Encuesta
            </Link>
          </Button>
        </div>

        <SurveyList surveys={surveys} />
      </main>
    </div>
  );
}
