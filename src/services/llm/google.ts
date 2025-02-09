
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseLLMService } from "./base";
import { CodeReviewRequest, CodeReviewResponse } from "@/types/llm";

export class GoogleAIService extends BaseLLMService {
  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
      const genAI = new GoogleGenerativeAI(request.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(this.formatPrompt(request.code, request.prompt));
      return { review: result.response.text() };
    } catch (error) {
      return { 
        review: "", 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }
}
