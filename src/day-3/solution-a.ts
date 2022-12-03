export const solution = "a";

const input = await Bun.file("src/day-3/input.txt").text();
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let sum = 0;

for (const line of input.split("\n")) {
  const items = line.split("");
  const sideA = items.slice(0, items.length / 2);
  const sideB = items.slice(items.length / 2);
  const alreadyFound = [];

  for (const item of sideA) {
    if (sideB.includes(item) && !alreadyFound.includes(item)) {
      alreadyFound.push(item);
      sum += alphabet.indexOf(item) + 1;
    }
  }

}

console.log("Solution:", sum);