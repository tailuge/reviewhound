import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LLMVendor } from "@/types/llm";

interface VendorSelectProps {
  value: LLMVendor;
  onChange: (value: LLMVendor) => void;
}

export const VendorSelect = ({ value, onChange }: VendorSelectProps) => (
  <Select
    value={value}
    onValueChange={(value: LLMVendor) => onChange(value)}
  >
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select vendor" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="free">Free (Gemini)</SelectItem>
      <SelectItem value="openai">OpenAI</SelectItem>
      <SelectItem value="google">Google AI</SelectItem>
      <SelectItem value="github">GitHub Copilot</SelectItem>
    </SelectContent>
  </Select>
);