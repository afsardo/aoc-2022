export const solution = "a";

const input = await Bun.file("src/day-8/input.txt").text();

const matrix : number[][] = [];

for (const line of input.split("\n")) {
  const row = line.split("").map((x) => parseInt(x));
  matrix.push(row);
}

function isTreeVisible(x: number, y: number, matrix: number[][]) {
  const width = matrix[0].length;
  const height = matrix.length;
  
  let isVisbleFromTop = true;
  for (let j = y - 1; j >= 0; j--) {
    if (matrix[x][j] >= matrix[x][y]) {
      isVisbleFromTop = false;
      break;
    }
  }

  let isVisbleFromBottom = true;
  for (let j = y + 1; j < height; j++) {
    if (matrix[x][j] >= matrix[x][y]) {
      isVisbleFromBottom = false;
      break;
    }
  }

  let isVisbleFromLeft = true;
  for (let i = x - 1; i >= 0; i--) {
    if (matrix[i][y] >= matrix[x][y]) {
      isVisbleFromLeft = false;
      break;
    }
  }

  let isVisbleFromRight = true;
  for (let i = x + 1; i < width; i++) {
    if (matrix[i][y] >= matrix[x][y]) {
      isVisbleFromRight = false;
      break;
    }
  }

  return isVisbleFromTop || isVisbleFromBottom || isVisbleFromLeft || isVisbleFromRight;
}

let visibleTrees = 0;
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    if (isTreeVisible(i, j, matrix)) {
      visibleTrees++;
    }
  }
}

console.log("Solution:", visibleTrees);