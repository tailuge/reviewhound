import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpenAIModel } from "@/types/llm";

interface ModelSelectProps {
  value: OpenAIModel;
  onChange: (value: OpenAIModel) => void;
}

export const ModelSelect = ({ value, onChange }: ModelSelectProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Select model" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="gpt-4o">GPT-4 Optimized</SelectItem>
      <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
    </SelectContent>
  </Select>
);