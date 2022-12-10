export const solution = "b";

const input = await Bun.file("src/day-10/input.txt").text();

let x = 1;
let cycles = 0;
let rowPixels = "";

for (const line of input.split("\n")) {
  const [command, value] = line.split(" ");

  if (command === "addx") {
    cycles += 1;
  }

  if (command === "noop") {
    cycles += 1;
  }

  rowPixels += cycles % 40 > x - 1 && cycles % 40 < x + 3 ? "#" : ".";

  if (cycles % 40 === 0 && rowPixels.length === 40) {
    console.log(rowPixels);
    rowPixels = "";
  }

  if (command === "addx") {
    cycles += 1;
    rowPixels += cycles % 40 > x - 1 && cycles % 40 < x + 3 ? "#" : ".";
  }
  
  if (cycles % 40 === 0 && rowPixels.length === 40) {
    console.log(rowPixels);
    rowPixels = "";
  }

  if (command === "addx") {
    x += parseInt(value);
  }
}