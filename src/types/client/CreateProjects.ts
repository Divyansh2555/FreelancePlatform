export type ProjectStatus =
  | "draft"
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BudgetType = "fixed" | "hourly";

export type ExperienceLevel =
  | "entry"
  | "intermediate"
  | "expert";

export type Project = {
  id: number;
  client_id: number;
  title: string;
  description: string;
  category: string | null;
  budget_type: BudgetType;
  budget_min: string | number | null;
  budget_max: string | number | null;
  experience_level: ExperienceLevel | null;
  deadline: string | null;
  location: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
};

export type ProjectForm = {
  title: string;
  description: string;
  category: string;
  budget_type: BudgetType;
  budget_min: string;
  budget_max: string;
  experience_level: ExperienceLevel;
  deadline: string;
  location: string;
};

export type ProjectPayload = {
  title: string;
  description: string;
  category: string | null;
  budget_type: BudgetType;
  budget_min: number | null;
  budget_max: number | null;
  experience_level: ExperienceLevel;
  deadline: string | null;
  location: string | null;
};

export const initialForm: ProjectForm = {
  title: "",
  description: "",
  category: "",
  budget_type: "fixed",
  budget_min: "",
  budget_max: "",
  experience_level: "entry",
  deadline: "",
  location: "",
};