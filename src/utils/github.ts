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
    const response = await fetch(`${apiUrl}/git/trees/main?recursive=1`);
    
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
  const dirs: { [key: string]: TreeItem } = {};

  // First pass: create all directories
  items.forEach(item => {
    const parts = item.path.split('/');
    let currentPath = '';
    
    // Create directory entries for each part of the path
    parts.slice(0, -1).forEach(part => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      if (!dirs[currentPath]) {
        dirs[currentPath] = {
          name: part,
          type: 'folder',
          children: [],
          path: currentPath
        };
      }
    });
  });

  // Second pass: add all files and build the tree structure
  items.forEach(item => {
    const parts = item.path.split('/');
    const fileName = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('/');
    
    if (item.type === 'blob') {
      const fileItem: TreeItem = {
        name: fileName,
        type: 'file',
        path: item.path
      };
      
      if (parentPath === '') {
        // Root level file
        root[fileName] = fileItem;
      } else {
        // Add to parent directory's children
        if (dirs[parentPath]) {
          dirs[parentPath].children?.push(fileItem);
        }
      }
    }
  });

  // Build the final tree structure
  Object.keys(dirs).forEach(path => {
    const parts = path.split('/');
    const dirName = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('/');
    
    if (parentPath === '') {
      // Root level directory
      root[dirName] = dirs[path];
    } else if (dirs[parentPath]) {
      // Add to parent directory's children
      dirs[parentPath].children?.push(dirs[path]);
    }
  });

  const result = Object.values(root);
  console.log('Final tree structure:', JSON.stringify(result, null, 2));
  return result;
}