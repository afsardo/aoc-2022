export const solution = "a";

const input = await Bun.file("src/day-20/input.txt").text();
const originalNumbers = input.split("\n").map(Number).map((v, i) => ({
  value: v
}));

let numbers = [...originalNumbers];

for (const number of originalNumbers) {
  const value = number.value;
  const currentPosition = numbers.findIndex((n) => n === number);
  let newPosition = (currentPosition + value) % (numbers.length - 1);
  if (newPosition <= 0) {
    newPosition = (numbers.length - 1) + newPosition;
  }

  numbers.splice(currentPosition, 1);
  numbers.splice(newPosition, 0, number);
}

const result = numbers.map((n) => n.value);

const zeroIndex = result.indexOf(0);

const first = result[(zeroIndex + 1000) % result.length];
const second = result[(zeroIndex + 2000) % result.length];
const third = result[(zeroIndex + 3000) % result.length];

console.log("Solution:", first + second + third);