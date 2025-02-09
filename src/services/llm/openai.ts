
import { OpenAI } from "@langchain/openai";
import { BaseLLMService } from "./base";
import { CodeReviewRequest, CodeReviewResponse } from "@/types/llm";

export class OpenAIService extends BaseLLMService {
  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
      const openai = new OpenAI({
        modelName: request.model || "gpt-4o",
        openAIApiKey: request.apiKey,
        temperature: 0.2,
      });

      const response = await openai.invoke(this.formatPrompt(request.code, request.prompt));
      return { review: response };
    } catch (error) {
      return { 
        review: "", 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }
}
