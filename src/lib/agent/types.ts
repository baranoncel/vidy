export type AgentStepSpec = {
  /** Stable key inside the plan (e.g. "describe", "device-frame", "animate"). */
  key: string;
  /** Fal model slug to call. Must exist in FalModel. */
  modelSlug: string;
  /** Inputs to pass to fal. May contain `{{step.<key>.outputUrl}}` or `{{input.<name>}}` placeholders. */
  inputs: Record<string, unknown>;
  /** Step keys this step depends on (executor waits for them before starting). */
  dependsOn?: string[];
  /** Optional: feature label (used to charge limit buckets). */
  feature?: string;
  /** Estimator parameters, e.g. duration in seconds. */
  estimateParams?: {
    durationSeconds?: number;
    megapixels?: number;
    numImages?: number;
    numChars?: number;
    audioSeconds?: number;
  };
  /** Human-readable description for the UI plan view. */
  description?: string;
};

export type AgentPlan = {
  templateId?: string;
  steps: AgentStepSpec[];
  /** Which step's output is the final deliverable. */
  finalStepKey: string;
  totalEstCoins: number;
};

export type AgentRunInputs = Record<string, unknown>;

export type AgentTemplate = {
  id: string;
  displayName: string;
  category: "marketing" | "social" | "education" | "audio" | "avatar-style-3d" | "effects-utility";
  description: string;
  /** Fields the user provides (file uploads, prompts, etc.). */
  expectedInputs: Array<{
    key: string;
    label: string;
    kind: "prompt" | "shortText" | "fileImage" | "fileVideo" | "fileAudio" | "url" | "select" | "number";
    required?: boolean;
    options?: { value: string; label: string }[];
    default?: string | number;
    placeholder?: string;
  }>;
  /** Build the DAG from user inputs. May throw to reject. */
  buildPlan: (inputs: AgentRunInputs) => Omit<AgentPlan, "totalEstCoins">;
};
