export const solution = "b";

const input = await Bun.file("src/day-11/input.txt").text();

enum MathSymbol {
  Add = "+",
  Subtract = "-",
  Multiply = "*",
  Divide = "/",
};

function mapToMathSymbol(symbol: string): MathSymbol {
  switch (symbol) {
    case "+":
      return MathSymbol.Add;
    case "-":
      return MathSymbol.Subtract;
    case "*":
      return MathSymbol.Multiply;
    case "/":
      return MathSymbol.Divide;
    default:
      throw new Error("Invalid symbol: " + symbol);
  }
}

class Operation {
  constructor(public operator: MathSymbol, public variable: string) {}

  apply(oldValue: number): number {
    const value = this.variable === "old" ? oldValue : parseInt(this.variable);

    if (isNaN(value)) {
      throw new Error("Invalid variable: " + this.variable);
    }

    switch (this.operator) {
      case MathSymbol.Add:
        return oldValue + value;
      case MathSymbol.Subtract:
        return oldValue - value;
      case MathSymbol.Multiply:
        return oldValue * value;
      case MathSymbol.Divide:
        return oldValue / value;
    }
  }
};

class Monkey {
  public inspectedItems: number = 0;

  constructor(public items: number[], public operation: Operation, public divisbleByTest: number, public ifTestTrueMonkey: number, public ifTestFalseMonkey: number) {}

  hasItems(): boolean {
    return this.items.length > 0;
  }

  inspectItem(): number {
    this.inspectedItems++;

    const item = this.items.shift();

    return Math.floor(this.operation.apply(item));
  }

  throwsToMonkey(worryLevel: number): number {
    if (worryLevel % this.divisbleByTest === 0) {
      return this.ifTestTrueMonkey;
    } else {
      return this.ifTestFalseMonkey;
    }
  }
}

const monkeys: Monkey[] = [];

for (const block of input.split("\n\n")) {
  let items: number[];
  let operation: Operation;
  let divisbleByTest: number;
  let ifTestTrueMonkey: number;
  let ifTestFalseMonkey: number;
  for (const line of block.split("\n")) {
    const [key, value] = line.trim().split(": ");
    if (key === "Starting items") {
      items = value.split(", ").map((item) => parseInt(item));
    } else if (key === "Operation") {
      const [operator, variable] = value.replace("new = old", "").trim().split(" ");
      operation = new Operation(mapToMathSymbol(operator), variable);
    } else if (key === "Test") {
      divisbleByTest = parseInt(value.replace("divisible by ", "").trim());
    } else if (key === "If true") {
      ifTestTrueMonkey = parseInt(value.replace("throw to monkey ", "").trim());
    } else if (key === "If false") {
      ifTestFalseMonkey = parseInt(value.replace("throw to monkey ", "").trim());
    }
  }
  monkeys.push(new Monkey(items, operation, divisbleByTest, ifTestTrueMonkey, ifTestFalseMonkey));
}

// 1.) This only works because all monkeys divisibleByTest are prime numbers
//     so we can use the modulo to reduce the worry level
const modulo = monkeys.map((monkey) => monkey.divisbleByTest).reduce((a, b) => a * b, 1);

const rounds = 10000;

for (let i = 0; i < rounds; i++) {
  for (const monkey of monkeys) {
    if (!monkey.hasItems()) {
      continue;
    }

    while (monkey.hasItems()) {
      const item = monkey.inspectItem();

      const monkeyToThrow = monkey.throwsToMonkey(item);

      // Refer to 1.)
      monkeys[monkeyToThrow].items.push(item % modulo);
    }
  }
}

console.log("Solution:", monkeys.sort((a, b) => b.inspectedItems - a.inspectedItems).slice(0, 2).reduce((a, b) => a * b.inspectedItems, 1));

