import { useState, useCallback, useEffect } from "react";

interface ResizablePanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

export const ResizablePanel = ({
  left,
  right,
  initialLeftWidth = 250,
  minLeftWidth = 200,
  maxLeftWidth = 600,
}: ResizablePanelProps) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= minLeftWidth && newWidth <= maxLeftWidth) {
          setLeftWidth(newWidth);
        }
      }
    },
    [isResizing, minLeftWidth, maxLeftWidth]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div className="flex h-full">
      <div style={{ width: leftWidth }} className="flex-shrink-0 bg-vscode-sidebar">
        {left}
      </div>
      <div
        className="resize-handle"
        onMouseDown={startResizing}
      />
      <div className="flex-1">
        {right}
      </div>
    </div>
  );
};