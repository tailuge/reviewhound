interface GitHubTreeItem {
  path: string;
  type: string;
  url: string;
  sha: string;
}

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  path?: string;
  content?: string;
}

const DEFAULT_REPO = "https://github.com/tailuge/codorebyu";

export async function fetchRepoTree(repoUrl: string = DEFAULT_REPO): Promise<TreeItem[]> {
  try {
    const apiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await fetch(`${apiUrl}/git/trees/main?recursive=1`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const repoData = await response.json();
    return buildTree(repoData.tree);
  } catch (error) {
    console.error('Error fetching repo tree:', error);
    throw error;
  }
}

export async function fetchFileContent(repoUrl: string, filePath: string): Promise<string> {
  try {
    const apiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    const response = await fetch(`${apiUrl}/contents/${filePath}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch file content');
    }

    const fileData = await response.json();
    return atob(fileData.content); // Decode base64 content
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

function buildTree(items: GitHubTreeItem[]): TreeItem[] {
  const root: { [key: string]: TreeItem } = {};

  // Sort items to ensure directories are processed first
  items.sort((a, b) => {
    const aIsDir = !a.path.includes('.');
    const bIsDir = !b.path.includes('.');
    return bIsDir ? 1 : aIsDir ? -1 : 0;
  });

  items.forEach((item) => {
    const parts = item.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // This is a file
        if (item.type === 'blob') {
          current[part] = {
            name: part,
            type: 'file',
            path: item.path
          };
        }
      } else {
        // This is a directory
        if (!current[part]) {
          current[part] = {
            name: part,
            type: 'folder',
            children: []
          };
        }
        current = (current[part].children || []) as unknown as { [key: string]: TreeItem };
      }
    });
  });

  return Object.values(root);
}