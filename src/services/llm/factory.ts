import { LLMVendor, CodeReviewRequest, CodeReviewResponse } from "@/types/llm";
import { OpenAIService } from "./openai";
import { GoogleAIService } from "./google";
import { GitHubCopilotService } from "./github";
import { BaseLLMService } from "./base";

export class LLMServiceFactory {
  static getService(vendor: LLMVendor): BaseLLMService {
    switch (vendor) {
      case "openai":
        return new OpenAIService();
      case "google":
        return new GoogleAIService();
      case "github":
        return new GitHubCopilotService();
      default:
        throw new Error(`Unsupported LLM vendor: ${vendor}`);
    }
  }

  static async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    const service = this.getService(request.vendor);
    return service.reviewCode(request);
  }
}