export const solution = "b";

const input = await Bun.file("src/day-8/input.txt").text();

const matrix : number[][] = [];

for (const line of input.split("\n")) {
  const row = line.split("").map((x) => parseInt(x));
  matrix.push(row);
}

function calculateScenicScore(x: number, y: number, matrix: number[][]) {
  const width = matrix[0].length;
  const height = matrix.length;
  
  let visibleTreesFromTop = 0;
  for (let j = y - 1; j >= 0; j--) {
    visibleTreesFromTop++;
    if (matrix[x][j] >= matrix[x][y]) {
      break;
    }
  }

  let visibleTreesFromBottom = 0;
  for (let j = y + 1; j < height; j++) {
    visibleTreesFromBottom++;
    if (matrix[x][j] >= matrix[x][y]) {
      break;
    }
  }

  let visibleTreesFromLeft = 0;
  for (let i = x - 1; i >= 0; i--) {
    visibleTreesFromLeft++;
    if (matrix[i][y] >= matrix[x][y]) {
      break;
    }
  }

  let visibleTreesFromRight = 0;
  for (let i = x + 1; i < width; i++) {
    visibleTreesFromRight++;
    if (matrix[i][y] >= matrix[x][y]) {
      break;
    }
  }
  
  return visibleTreesFromTop * visibleTreesFromBottom * visibleTreesFromLeft * visibleTreesFromRight;
}

let highestScore = -1;
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    const score = calculateScenicScore(i, j, matrix);
    if (score > highestScore) {
      highestScore = score;
    }
  }
}

console.log("Solution:", highestScore);