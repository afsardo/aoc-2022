export const solution = "a";

const input = await Bun.file("src/day-4/input.txt").text();

let count = 0;
for (const line of input.split("\n")) {
  const [pairA, pairB] = line.split(",");
  const [pairAStartStr, pairAEndStr] = pairA.split("-");
  const pairAStart = parseInt(pairAStartStr, 10);
  const pairAEnd = parseInt(pairAEndStr, 10);
  const [pairBStartStr, pairBEndStr] = pairB.split("-");
  const pairBStart = parseInt(pairBStartStr, 10);
  const pairBEnd = parseInt(pairBEndStr, 10);

  if (
    (pairAStart >= pairBStart && pairAEnd <= pairBEnd) ||
    (pairBStart >= pairAStart && pairBEnd <= pairAEnd)
  ) {
    count++;
  }
}

console.log("Solution:", count);