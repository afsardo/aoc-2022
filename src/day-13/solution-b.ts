export const solution = "b";

const input = await Bun.file("src/day-13/input.txt").text();

const packets = input.split("\n").map((packet) => {
  if (!packet) return false;
  return JSON.parse(packet)
}).filter(Boolean);

const firstDividerPacket = [[2]];
packets.push(firstDividerPacket);

const secondDividerPacket = [[6]];
packets.push(secondDividerPacket);

function compare(leftPacket, rightPacket) {
  for (let i = 0; i < leftPacket.length; i++) {
    if (rightPacket.length <= i) {
      return 1;
    }

    let leftElement = leftPacket[i];
    let rightElement = rightPacket[i];

    if (typeof leftElement === "number" && typeof rightElement === "number") {
      if (leftElement < rightElement) {
        return -1;
      }
      if (leftElement > rightElement) {
        return 1;
      }
    } else {
      if (typeof leftElement === "number") {
        leftElement = [leftElement];
      }
      if (typeof rightElement === "number") {
        rightElement = [rightElement];
      }

      const compareResult = compare(leftElement, rightElement);
      if (compareResult !== 0) {
        return compareResult;
      }
    }
  }

  if (leftPacket.length < rightPacket.length) {
    return -1;
  }

  return 0;
}

const sortedPackets = packets.sort(compare);

const firstDividerPacketIndex = sortedPackets.findIndex((packet) => {
  return firstDividerPacket == packet;
}) + 1;

const secondDividerPacketIndex = sortedPackets.findIndex((packet) => {
  return secondDividerPacket == packet;
}) + 1;

console.log("Solution:", firstDividerPacketIndex * secondDividerPacketIndex);