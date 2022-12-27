export const solution = "a";

const input = await Bun.file("src/day-25/input.txt").text();

const mapDecimalToSnafu = {
  4: "=",
  3: "-",
  2: "2",
  1: "1",
  0: "0",
};

const mapSnafuToDecimal = {
  "2": 2,
  "1": 1,
  "0": 0,
  "-": Number(-1),
  "=": Number(-2),
};


function snafuToDecimal(snafu: string): number {
  return snafu.split("").reverse().reduce((acc, char, i) => acc + (mapSnafuToDecimal[char] * (5 ** i)), 0);
}

function decimalToSnafu(decimal: number): string {
  let snafu = [];    
  let toAdd = 0;
  let number = 1;

  while(true) {
    const based = (decimal + toAdd).toString(5);
    const position = based.length - number;
    const snafuNumber = mapDecimalToSnafu[based[position]];

    if (!snafuNumber){
      break; 
    }
      
    snafu.unshift(snafuNumber);
    toAdd = Math.floor(Math.pow(5, number) / 2);
    number++;
  }

  return snafu.join('');
}

let total = 0;
for (const line of input.split("\n")) {
  total += snafuToDecimal(line);
}

console.log("Solution:", decimalToSnafu(total));