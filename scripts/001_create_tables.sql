-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nombre text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create surveys table
create table if not exists public.surveys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descripcion text,
  activa boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.surveys enable row level security;

-- Surveys policies
create policy "surveys_select_own"
  on public.surveys for select
  using (auth.uid() = user_id);

create policy "surveys_insert_own"
  on public.surveys for insert
  with check (auth.uid() = user_id);

create policy "surveys_update_own"
  on public.surveys for update
  using (auth.uid() = user_id);

create policy "surveys_delete_own"
  on public.surveys for delete
  using (auth.uid() = user_id);

-- Public read access for active surveys (needed for anonymous responses)
create policy "surveys_select_active_public"
  on public.surveys for select
  using (activa = true);

-- Create questions table
create table if not exists public.questions (
  id uuid primary key default uuid_generate_v4(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  pregunta text not null,
  tipo text not null check (tipo in ('texto', 'opcion_multiple', 'calificacion', 'si_no')),
  opciones jsonb, -- For multiple choice questions
  orden integer not null,
  requerida boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.questions enable row level security;

-- Questions policies
create policy "questions_select_by_survey_owner"
  on public.questions for select
  using (
    exists (
      select 1 from public.surveys 
      where surveys.id = questions.survey_id 
      and surveys.user_id = auth.uid()
    )
  );

create policy "questions_insert_by_survey_owner"
  on public.questions for insert
  with check (
    exists (
      select 1 from public.surveys 
      where surveys.id = questions.survey_id 
      and surveys.user_id = auth.uid()
    )
  );

create policy "questions_update_by_survey_owner"
  on public.questions for update
  using (
    exists (
      select 1 from public.surveys 
      where surveys.id = questions.survey_id 
      and surveys.user_id = auth.uid()
    )
  );

create policy "questions_delete_by_survey_owner"
  on public.questions for delete
  using (
    exists (
      select 1 from public.surveys 
      where surveys.id = questions.survey_id 
      and surveys.user_id = auth.uid()
    )
  );

-- Public read access for questions of active surveys
create policy "questions_select_active_survey_public"
  on public.questions for select
  using (
    exists (
      select 1 from public.surveys 
      where surveys.id = questions.survey_id 
      and surveys.activa = true
    )
  );

-- Create responses table
create table if not exists public.responses (
  id uuid primary key default uuid_generate_v4(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  respondente_nombre text,
  respondente_email text,
  created_at timestamp with time zone default now()
);

alter table public.responses enable row level security;

-- Responses policies - owner can view all responses to their surveys
create policy "responses_select_by_survey_owner"
  on public.responses for select
  using (
    exists (
      select 1 from public.surveys 
      where surveys.id = responses.survey_id 
      and surveys.user_id = auth.uid()
    )
  );

-- Anyone can insert responses to active surveys (anonymous submissions)
create policy "responses_insert_active_survey"
  on public.responses for insert
  with check (
    exists (
      select 1 from public.surveys 
      where surveys.id = responses.survey_id 
      and surveys.activa = true
    )
  );

-- Create answers table
create table if not exists public.answers (
  id uuid primary key default uuid_generate_v4(),
  response_id uuid not null references public.responses(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  respuesta text not null,
  created_at timestamp with time zone default now()
);

alter table public.answers enable row level security;

-- Answers policies
create policy "answers_select_by_survey_owner"
  on public.answers for select
  using (
    exists (
      select 1 from public.responses r
      join public.surveys s on s.id = r.survey_id
      where r.id = answers.response_id 
      and s.user_id = auth.uid()
    )
  );

-- Anyone can insert answers to their responses
create policy "answers_insert_with_response"
  on public.answers for insert
  with check (
    exists (
      select 1 from public.responses r
      join public.surveys s on s.id = r.survey_id
      where r.id = answers.response_id 
      and s.activa = true
    )
  );

-- Create function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nombre', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Create trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create indexes for better performance
create index if not exists idx_surveys_user_id on public.surveys(user_id);
create index if not exists idx_questions_survey_id on public.questions(survey_id);
create index if not exists idx_responses_survey_id on public.responses(survey_id);
create index if not exists idx_answers_response_id on public.answers(response_id);
create index if not exists idx_answers_question_id on public.answers(question_id);
