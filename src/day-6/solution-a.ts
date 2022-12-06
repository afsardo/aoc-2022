export const solution = "a";

const input = await Bun.file("src/day-6/input.txt").text();

const last4Bits = [];
const chars = input.split("");
let startPacketIndex = -1;
for (let i = 0; i < chars.length; i++) {
  const char = chars[i];

  if (last4Bits.length < 4) {
    last4Bits.push(char);
    continue;
  }

  last4Bits.shift();
  last4Bits.push(char);
  const uniqueBits = new Set(last4Bits);
  if (uniqueBits.size === last4Bits.length) {
    startPacketIndex = i;
    break;
  }
}

console.log("Solution:", startPacketIndex +1)