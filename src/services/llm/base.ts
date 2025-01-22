import { CodeReviewRequest, CodeReviewResponse } from "@/types/llm";

export abstract class BaseLLMService {
  public abstract reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse>;
  
  protected formatPrompt(code: string): string {
    return `Please review this code and provide feedback on potential improvements, bugs, and best practices:
    
    ${code}`;
  }
}