export const solution = "a";

const input = await Bun.file("src/day-13/input.txt").text();

const packetPairs = input.split("\n\n").map((pair) => {
  const [leftPacket, rightPacket] = pair.split("\n");
  return [
    JSON.parse(leftPacket),
      JSON.parse(rightPacket),
  ]
});

function correctOrder(leftPacket, rightPacket) {
  for (let i = 0; i < leftPacket.length; i++) {
    if (rightPacket.length <= i) {
      return false;
    }

    let leftElement = leftPacket[i];
    let rightElement = rightPacket[i];

    if (typeof leftElement === "number" && typeof rightElement === "number") {
      if (leftElement < rightElement) {
        return true;
      }
      if (leftElement > rightElement) {
        return false;
      }
    } else {
      if (typeof leftElement === "number") {
        leftElement = [leftElement];
      }
      if (typeof rightElement === "number") {
        rightElement = [rightElement];
      }

      const correctOrderResult = correctOrder(leftElement, rightElement);
      if (correctOrderResult !== null) {
        return correctOrderResult;
      }
    }
  }

  if (leftPacket.length < rightPacket.length) {
    return true;
  }

  return null;
}

const correctPacketPairsIndexes = [];
for (let i = 0; i < packetPairs.length; i++) {
  const [leftPacket, rightPacket] = packetPairs[i];


  if (correctOrder(leftPacket, rightPacket)) {
    correctPacketPairsIndexes.push(i + 1);
  }
}

console.log("Solution:", correctPacketPairsIndexes.reduce((a, b) => a + b, 0));