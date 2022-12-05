export const solution = "b";

const input = await Bun.file("src/day-5/input.txt").text();

const stack1 = ["F", "R", "W"].reverse();
const stack2 = ["P", "W", "V", "D", "C", "M", "H", "T"].reverse();
const stack3 = ["L", "N", "Z", "M", "P"].reverse();
const stack4 = ["R", "H", "C", "J"].reverse();
const stack5 = ["B", "T", "Q", "H", "G", "P", "C"].reverse(); 
const stack6 = ["Z", "F", "L", "W", "C", "G"].reverse();
const stack7 = ["C", "G", "J", "Z", "Q", "L", "V", "W"].reverse();
const stack8 = ["C", "V", "T", "W", "F", "R", "N", "P"].reverse();
const stack9 = ["V", "S", "R", "G", "H", "W", "J"].reverse();

const stacks = [stack1, stack2, stack3, stack4, stack5, stack6, stack7, stack8, stack9];

for (const line of input.split("\n")) {
  const [move, amount, from, stackSource, to, stackDestination] = line.split(" ");
  
  const crates = [];
  for (let i = 0; i < parseInt(amount); i++) {
    crates.push(stacks[parseInt(stackSource) - 1].pop());
  }

  stacks[parseInt(stackDestination) - 1] = stacks[parseInt(stackDestination) - 1].concat(crates.reverse());
}


console.log("Solution: ", stacks.map(stack => stack[stack.length - 1]).join(""));