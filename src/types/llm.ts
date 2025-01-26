export type LLMVendor = "openai" | "google" | "github" | "free";
export type OpenAIModel = "gpt-4o" | "gpt-4o-mini";

export interface CodeReviewRequest {
  code: string;
  apiKey: string;
  vendor: LLMVendor;
  model?: OpenAIModel;
}

export interface CodeReviewResponse {
  review: string;
  error?: string;
}