import { ChevronRight, ChevronDown, Folder, FileCode } from "lucide-react";
import { useState } from "react";

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
}

interface TreeViewProps {
  data: TreeItem[];
  onSelect: (item: TreeItem) => void;
}

const TreeViewItem = ({ item, onSelect }: { item: TreeItem; onSelect: (item: TreeItem) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (item.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onSelect(item);
    }
  };

  return (
    <div>
      <div
        className="tree-item"
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Folder className="w-4 h-4 text-vscode-blue" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileCode className="w-4 h-4" />
          </>
        )}
        <span>{item.name}</span>
      </div>
      {item.type === "folder" && isOpen && item.children && (
        <div className="ml-4">
          {item.children.map((child, index) => (
            <TreeViewItem key={index} item={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView = ({ data, onSelect }: TreeViewProps) => {
  return (
    <div className="tree-view">
      {data.map((item, index) => (
        <TreeViewItem key={index} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
};