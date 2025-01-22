import { OpenAI } from "@langchain/openai";
import { BaseLLMService } from "./base";
import { CodeReviewRequest, CodeReviewResponse } from "@/types/llm";

export class GitHubCopilotService extends BaseLLMService {
  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    try {
      const githubOpenAI = new OpenAI({
        modelName: request.model || "gpt-4o",
        openAIApiKey: request.apiKey,
        temperature: 0.2,
        configuration: {
          baseURL: "https://api.github.com/copilot/v1",
        },
      });

      const response = await githubOpenAI.invoke(this.formatPrompt(request.code));
      return { review: response };
    } catch (error) {
      return { 
        review: "", 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      };
    }
  }
}