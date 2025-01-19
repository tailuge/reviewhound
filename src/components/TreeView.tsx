import { ChevronRight, ChevronDown, Folder, FileCode } from "lucide-react";
import { useState } from "react";

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  path?: string;
  content?: string;
}

interface TreeViewProps {
  data: TreeItem[];
  onSelect: (item: TreeItem) => void;
}

const TreeViewItem = ({ item, onSelect }: { item: TreeItem; onSelect: (item: TreeItem) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log('TreeViewItem clicked:', item);
    if (item.type === "folder") {
      console.log('Toggling folder state:', !isOpen);
      console.log('Folder children:', item.children);
      setIsOpen(!isOpen);
    } else {
      console.log('Selecting file:', item.path);
      onSelect(item);
    }
  };

  return (
    <div>
      <div
        className="tree-item flex items-center gap-2 px-2 py-1 hover:bg-vscode-active cursor-pointer"
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
  console.log('TreeView rendered with data:', data);
  return (
    <div className="tree-view">
      {data.map((item, index) => (
        <TreeViewItem key={index} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
};