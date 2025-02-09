
export type LLMVendor = "openai" | "google" | "github" | "free";
export type OpenAIModel = "gpt-4o" | "gpt-4o-mini";
export type GeminiModel = 
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-pro"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-exp"
  | "gemini-2.0-flash-lite-preview-02-05"
  | "gemini-2.0-flash-thinking-exp-01-21"
  | "gemini-2.0-pro-exp-02-05"
  | "gemma-2-27b-it"
  | "gemma-2-2b-it"
  | "gemma-2-9b-it";

export interface CodeReviewRequest {
  code: string;
  apiKey: string;
  vendor: LLMVendor;
  model?: OpenAIModel;
  geminiModel?: GeminiModel;
  prompt?: string;
}

export interface CodeReviewResponse {
  review: string;
  error?: string;
}
