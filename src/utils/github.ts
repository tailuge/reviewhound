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
    console.log('Fetching repo tree from:', apiUrl);
    const response = await fetch(`${apiUrl}/git/trees/main?recursive=3`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const repoData = await response.json();
    console.log('Raw repo data:', repoData);
    return buildTree(repoData.tree);
  } catch (error) {
    console.error('Error fetching repo tree:', error);
    throw error;
  }
}

export async function fetchFileContent(repoUrl: string, filePath: string): Promise<string> {
  try {
    const apiUrl = repoUrl.replace('https://github.com/', 'https://api.github.com/repos/');
    console.log('Fetching file content:', filePath);
    const response = await fetch(`${apiUrl}/contents/${filePath}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch file content');
    }

    const fileData = await response.json();
    return atob(fileData.content);
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

function buildTree(items: GitHubTreeItem[]): TreeItem[] {
  console.log('Building tree from items:', items);
  const root: { [key: string]: TreeItem } = {};

  // Sort items to ensure directories are processed first
  items.sort((a, b) => {
    const aIsDir = !a.path.includes('.');
    const bIsDir = !b.path.includes('.');
    return bIsDir ? 1 : aIsDir ? -1 : 0;
  });

  console.log('Sorted items:', items);

  items.forEach((item) => {
    const parts = item.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      console.log(`Processing part ${index}:`, part, 'of path:', item.path);
      
      if (index === parts.length - 1) {
        // This is a file
        if (item.type === 'blob') {
          console.log('Adding file:', part);
          current[part] = {
            name: part,
            type: 'file',
            path: item.path
          };
        }
      } else {
        // This is a directory
        if (!current[part]) {
          console.log('Adding directory:', part);
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

  const result = Object.values(root);
  console.log('Final tree structure:', JSON.stringify(result, null, 2));
  return result;
}