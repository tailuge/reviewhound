import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpenAI } from "@langchain/openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface TerminalProps {
  codeContent?: string;
}

type Vendor = "openai" | "google" | "github";

export const Terminal = ({ codeContent }: TerminalProps) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor>("openai");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [apiKey, setApiKey] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReview = async () => {
    if (!apiKey || !codeContent) {
      console.log("API key and code content are required");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      switch (selectedVendor) {
        case "openai":
          const openai = new OpenAI({
            modelName: selectedModel,
            openAIApiKey: apiKey,
            temperature: 0.2,
          });
          response = await openai.invoke(
            `Please review this code and provide feedback on potential improvements, bugs, and best practices:
            
            ${codeContent}`
          );
          break;

        case "google":
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const result = await model.generateContent(
            `Please review this code and provide feedback on potential improvements, bugs, and best practices:
            
            ${codeContent}`
          );
          response = result.response.text();
          break;

        case "github":
          const githubOpenAI = new OpenAI({
            modelName: selectedModel,
            openAIApiKey: apiKey,
            temperature: 0.2,
            baseURL: "https://api.github.com/copilot/v1",
          });
          response = await githubOpenAI.invoke(
            `Please review this code and provide feedback on potential improvements, bugs, and best practices:
            
            ${codeContent}`
          );
          break;
      }

      setReview(response);
    } catch (error) {
      console.error("Error during code review:", error);
      setReview("Error occurred during code review");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-vscode-bg border-t border-vscode-border h-[200px] flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-vscode-border">
        <div className="flex items-center gap-4">
          <Select
            value={selectedVendor}
            onValueChange={(value: Vendor) => setSelectedVendor(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="google">Google AI</SelectItem>
              <SelectItem value="github">GitHub Copilot</SelectItem>
            </SelectContent>
          </Select>
          {selectedVendor === "openai" && (
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4 Optimized</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Input
            type="password"
            placeholder="Enter API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-[240px]"
          />
        </div>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReview}
            disabled={isLoading || !apiKey}
            className="text-vscode-text hover:text-white"
          >
            {isLoading ? "Reviewing..." : "Review"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => console.log('Apply clicked')}
            className="text-vscode-text hover:text-white"
          >
            Apply
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap">
        {review}
      </div>
    </div>
  );
};