export const solution = "a";

const input = await Bun.file("src/day-1/input.txt").text();

const elfs = [];
let currentCalories = 0;
for (const line of input.split("\n")) {
  if (line === "") {
    elfs.push(currentCalories);
    currentCalories = 0;
  } else {
    currentCalories += Number(line);
  }
}
console.log(elfs.sort((a, b) => a - b).reverse().at(0));