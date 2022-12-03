export const solution = "b";

const input = await Bun.file("src/day-3/input.txt").text();
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";


let sum = 0;

const lines = input.split("\n");
for (let i = 0; i < lines.length; i += 3) {
  if (lines.length < i + 3) {
    break;
  }

  const lineA = lines[i];
  const lineB = lines[i + 1];
  const lineC = lines[i + 2];

  const match = [];
  for (const item of lineB) {
    if (lineA.includes(item) && !match.includes(item)) {
      match.push(item);
    }
  }

  for (const item of lineC) {
    if (match.includes(item)) {
      sum += alphabet.indexOf(item) + 1;
      break;
    }
  }
}

console.log("Solution:", sum);

