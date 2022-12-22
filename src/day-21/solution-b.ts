export const solution = "b";

const input = await Bun.file("src/day-21/input.txt").text();

const monkeys : Map<string, string> = new Map();

for (const line of input.split("\n")) {
  const [monkeyName, value] = line.split(": ");
  monkeys.set(monkeyName.trim(), value.trim());
}

function guessNumber(monkeyName: string): any | any[] {
  const value = monkeys.get(monkeyName);
  if (value === undefined) {
    throw new Error("Monkey not found");
  }

  if (!isNaN(Number(value)) || value === "x") {
    return value;
  }

  if (value.includes("+")) {
    const [a, b] = value.split(" + ").map(guessNumber);
    if (typeof a === "object" || typeof b === "object" || a === "x" || b === "x") {
      return [a, "+", b];
    }
    return Number(a) + Number(b);
  }

  if (value.includes("*")) {
    const [a, b] = value.split(" * ").map(guessNumber);
    if (typeof a === "object" || typeof b === "object" || a === "x" || b === "x") {
      return [a, "*", b];
    }
    return Number(a) * Number(b);
  }

  if (value.includes("-")) {
    const [a, b] = value.split(" - ").map(guessNumber);
    if (typeof a === "object" || typeof b === "object" || a === "x" || b === "x") {
      return [a, "-", b];
    }
    return Number(a) - Number(b);
  }

  if (value.includes("/")) {
    const [a, b] = value.split(" / ").map(guessNumber);
    if (typeof a === "object" || typeof b === "object" || a === "x" || b === "x") {
      return [a, "/", b];
    }
    return Number(a) / Number(b);
  }

  throw new Error("Unknown operation");
}

monkeys.set("humn", "x");

function solveForX(equation: any | any[], result: number): number {
  if (!isNaN(Number(equation))) {
    return equation;
  }

  if (typeof equation === "string") {
    return result;
  }

  const [a, op, b] = equation;
  
  if (op === "+") {
    if (!isNaN(Number(a))) {
      return solveForX(b, result - a);
    }
    if (!isNaN(Number(b))) {
      return solveForX(a, result - b);
    }
  }

  if (op === "-") {
    if (!isNaN(Number(a))) {
      return solveForX(b, a - result);
    }
    if (!isNaN(Number(b))) {
      return solveForX(a, result + b);
    }
  }

  if (op === "*") {
    if (!isNaN(Number(a))) {
      return solveForX(b, result / a);
    }
    if (!isNaN(Number(b))) {
      return solveForX(a, result / b);
    }
  }

  if (op === "/") {
    if (!isNaN(Number(a))) {
      return solveForX(b, result / a);
    }
    if (!isNaN(Number(b))) {
      return solveForX(a, result * b);
    }
  }

}

const rootEquation = monkeys.get("root");
const [a, b] = rootEquation.split(" + ").map(guessNumber);
const x = solveForX(a, Number(b));

console.log("Solution:", x);