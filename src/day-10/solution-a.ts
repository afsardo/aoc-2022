export const solution = "a";

const input = await Bun.file("src/day-10/input.txt").text();

let x = 1;
let cycles = 0;
const signalStrengths = {};

for (const line of input.split("\n")) {
  const [command, value] = line.split(" ");

  if (command === "addx") {
    cycles += 1;
  }

  if (command === "noop") {
    cycles += 1;
  }

  if (cycles === 20 || (cycles + 20) % 40 === 0) {
    signalStrengths[cycles] = cycles * x;
  }

  if (command === "addx") {
    cycles += 1;
  }
  
  if (cycles === 20 || (cycles + 20) % 40 === 0) {
    signalStrengths[cycles] = cycles * x;
  }

  if (command === "addx") {
    x += parseInt(value);
  }
}

console.log("Solution:", Object.values(signalStrengths).reduce((a:number, b:number) => a + b, 0))