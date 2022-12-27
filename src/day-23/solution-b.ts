export const solution = "b";

const input = await Bun.file("src/day-23/input.txt").text();

type Direction = "N" | "S" | "W" | "E";

type Position = [number, number]; // [x, y]

function positionKey(position: Position): string {
  return position.join(",");
}

type Elf = {
  position: Position;
};

const elfs : Map<string, Elf> = new Map();

const lines = input.split("\n");
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    if (lines[y][x] === "#") {
      elfs.set(positionKey([x, y]), {
        position: [x, y],
      });
    }
  }
}

function proposeNewPosition(elf: Elf, directionsQueue: Direction[]): Position | null {
  const [x, y] = elf.position;

  const northPosition : Position = [x, y - 1];
  const northWestPosition : Position = [x - 1, y - 1];
  const northEastPosition : Position = [x + 1, y - 1];
  const southPosition : Position = [x, y + 1];
  const southWestPosition : Position = [x - 1, y + 1];
  const southEastPosition : Position = [x + 1, y + 1];
  const eastPosition : Position = [x + 1, y];
  const westPosition : Position = [x - 1, y];

  const northPositionExists = elfs.has(positionKey(northPosition));
  const northWestPositionExists = elfs.has(positionKey(northWestPosition));
  const northEastPositionExists = elfs.has(positionKey(northEastPosition));
  const southPositionExists = elfs.has(positionKey(southPosition));
  const southWestPositionExists = elfs.has(positionKey(southWestPosition));
  const southEastPositionExists = elfs.has(positionKey(southEastPosition));
  const eastPositionExists = elfs.has(positionKey(eastPosition));
  const westPositionExists = elfs.has(positionKey(westPosition));

  if (!northPositionExists && !northWestPositionExists && !northEastPositionExists && !southPositionExists && !southWestPositionExists && !southEastPositionExists && !eastPositionExists && !westPositionExists) {
    return null;
  }
  
  for (const direction of directionsQueue) {
    switch (direction) {
      case "N":
        if (!northPositionExists && !northWestPositionExists && !northEastPositionExists) {
          return northPosition;
        }
        break;
      case "S":
        if (!southPositionExists && !southWestPositionExists && !southEastPositionExists) {
          return southPosition;
        }
        break;
      case "E":
        if (!eastPositionExists && !northEastPositionExists && !southEastPositionExists) {
          return eastPosition;
        }
        break;
      case "W":
        if (!westPositionExists && !northWestPositionExists && !southWestPositionExists) {
          return westPosition;
        }
        break;
    }
  }

  return null;
}

function draw() {
  const minX = Math.min(...Array.from(elfs.values()).map(elf => elf.position[0]));
  const maxX = Math.max(...Array.from(elfs.values()).map(elf => elf.position[0]));
  const minY = Math.min(...Array.from(elfs.values()).map(elf => elf.position[1]));
  const maxY = Math.max(...Array.from(elfs.values()).map(elf => elf.position[1]));

  for (let y = minY; y <= maxY; y++) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      if (elfs.has(positionKey([x, y]))) {
        line += "#";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
}

function organize(rounds: number = Infinity) {
  let directionsQueue : Direction[] = ["N", "S", "W", "E"];
  let currentRound = 0;
  while (currentRound < rounds) {
    let newElfPositions : Map<string, Elf[]> = new Map();
    for (const elf of elfs.values()) {
      const newPosition = proposeNewPosition(elf, directionsQueue);
      if (newPosition) {
        const key = positionKey(newPosition);
        if (!newElfPositions.has(key)) {
          newElfPositions.set(key, [elf]);
        } else {
          newElfPositions.get(key)!.push(elf);
        }
      }
    }

    if (newElfPositions.size <= 0) {
      break;
    }

    for (const [key, newElfs] of newElfPositions.entries()) {
      if (newElfs.length === 1) {
        const oldPosition = newElfs[0].position;
        const newPosition = key.split(",").map(Number) as Position;

        elfs.delete(positionKey(oldPosition));
        elfs.set(positionKey(newPosition), { position: newPosition });
      }
    }

    // console.log("######################");
    // draw();
    // console.log("Round:", currentRound + 1);

    currentRound++;
    directionsQueue.push(directionsQueue.shift());
  }

  return currentRound + 1;
}

// draw();
// console.log("Initial state");

console.log("Solution:", organize());