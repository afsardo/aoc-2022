export const solution = "a";

const input = await Bun.file("src/day-7/input.txt").text();

interface FilesystemNode {
  name: string;
  totalSize: number;
}

class File implements FilesystemNode {
  name: string;
  size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }

  get totalSize() {
    return this.size;
  }
}

class Folder implements FilesystemNode  {
  name: string;
  nodes: FilesystemNode[];
  parent: Folder | null = null;

  constructor(name: string, parent: Folder | null = null) {
    this.name = name;
    this.parent = parent;
    this.nodes = [];
  }

  get totalSize() {
    return this.nodes.reduce((acc, node) => acc + node.totalSize, 0);
  }
}

let root : Folder | null = null;
let currentFolder : Folder | null = null;

for (const line of input.split("\n")) {
  const lineSplit = line.split(" ");

  if (lineSplit[0] === "$") { // Terminal command
    const command = lineSplit[1];
    
    if (command == "cd") {
      const folderName = lineSplit[2];

      if (folderName == "..") {
        if (currentFolder) {
          currentFolder = currentFolder.parent;
        }
      } else {
        if (!root) {
          root = new Folder(folderName);
          currentFolder = root;
        } else {
          const folder = new Folder(folderName, currentFolder);
          currentFolder.nodes.push(folder);
          currentFolder = folder;
        }
      }
    }
  } else {
    if (lineSplit[0] != "dir" && !isNaN(parseInt(lineSplit[0]))) {
      const fileSize = parseInt(lineSplit[0]);
      const fileName = lineSplit[1];
      
      currentFolder.nodes.push(new File(fileName, fileSize));
    }
  }
}

function renderFolderSize(node: FilesystemNode) {
  if (node instanceof Folder) {
    console.log("folder", node.name, "size", node.totalSize)
    for (const child of node.nodes) {
      renderFolderSize(child);
    }
  }
}

// renderFolderSize(root);

function findFolders(node: FilesystemNode, totalSize: number = 100000): Folder[] {
  const folders : Folder[] = [];

  if (node instanceof Folder) {
    if (node.totalSize <= totalSize) {
      folders.push(node);
    }

    for (const child of node.nodes) {
      folders.push(...findFolders(child, totalSize));
    }
  }

  return folders;
}

const totalSize = findFolders(root, 100000).reduce((acc, folder) => acc + folder.totalSize, 0);

console.log("Solution:", totalSize);


