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
}

export async function fetchRepoTree(repoUrl: string): Promise<TreeItem[]> {
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

function buildTree(items: GitHubTreeItem[]): TreeItem[] {
  const root: { [key: string]: TreeItem } = {};

  items.forEach((item) => {
    const parts = item.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // This is a file
        if (item.type === 'blob') {
          current[part] = {
            name: part,
            type: 'file'
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