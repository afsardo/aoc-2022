export const solution = "a";

const input = await Bun.file("src/day-21/input.txt").text();

const monkeys : Map<string, string> = new Map();

for (const line of input.split("\n")) {
  const [monkeyName, value] = line.split(": ");
  monkeys.set(monkeyName.trim(), value.trim());
}

function guessNumber(monkeyName: string): number {
  const value = monkeys.get(monkeyName);
  if (value === undefined) {
    throw new Error("Monkey not found");
  }

  if (!isNaN(Number(value))) {
    return Number(value);
  }

  if (value.includes("+")) {
    const [a, b] = value.split(" + ").map(guessNumber);
    return a + b;
  }

  if (value.includes("*")) {
    const [a, b] = value.split(" * ").map(guessNumber);
    return a * b;
  }

  if (value.includes("-")) {
    const [a, b] = value.split(" - ").map(guessNumber);
    return a - b;
  }

  if (value.includes("/")) {
    const [a, b] = value.split(" / ").map(guessNumber);
    return a / b;
  }

  throw new Error("Unknown operation");
}

console.log("Solution:", guessNumber("root"));