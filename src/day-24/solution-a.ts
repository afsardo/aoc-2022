import { sleepSync } from "bun";

export const solution = "a";

const input = await Bun.file("src/day-24/input.txt").text();

type Point = {x: number, y: number};

function mapPointToKey(point: Point) {
  return `(${point.x},${point.y})`;
}

function mapKeyToPoint(key: string) {
  const [x, y] = key.replace("(", "").replace(")", "").split(",").map(Number);
  return { x, y };
}

enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

function mapStringToDirection(char: string) {
  switch (char) {
    case "^":
      return Direction.UP;
    case "v":
      return Direction.DOWN;
    case "<":
      return Direction.LEFT;
    case ">":
      return Direction.RIGHT;
    default:
      throw new Error("Unknown direction");
  }
}

type Blizzard = {
  direction: Direction;
};

const walls = new Set<string>();
const allBlizzards = new Map<string, Blizzard[]>();
const matrix : string[][] = [];
let start : Point = { x: -1, y: -1 };
let goal : Point = { x: Infinity, y: Infinity };

const lines = input.split("\n");
for(let y = 0; y < lines.length; y++) {
  const line = lines[y];
  matrix[y] = [];
  for(let x = 0; x < line.length; x++) {
    const char = line[x];
    matrix[y][x] = char;
    if (y === 0 && char === ".") {
      start = { x, y };
    }
    if (y === lines.length - 1 && char === ".") {
      goal = { x, y };
    }

    if (char === "#") {
      walls.add(mapPointToKey({ x, y }));
    }

    if (char === ">" || char === "<" || char === "^" || char === "v") {
      const blizzards = allBlizzards.get(mapPointToKey({ x, y })) || [];
      blizzards.push({ direction: mapStringToDirection(char) });
      allBlizzards.set(mapPointToKey({ x, y }), blizzards);
    }
  }
}

const maxY = matrix.length - 1;
const maxX = matrix[0].length - 1;

function moveBlizzards(allBlizzards: Map<string, Blizzard[]>): Map<string, Blizzard[]> {
  const newBlizzards = new Map<string, Blizzard[]>();
  for (const [key, blizzards] of allBlizzards) {
    for (const blizzard of blizzards) {
      const point = mapKeyToPoint(key);
      switch (blizzard.direction) {
        case Direction.UP:
          point.y--;
          if (walls.has(mapPointToKey(point))) {
            point.y = maxY - 1;
          }
          break;
        case Direction.DOWN:
          point.y++;
          if (walls.has(mapPointToKey(point))) {
            point.y = 1;
          }
          break;
        case Direction.LEFT:
          point.x--;
          if (walls.has(mapPointToKey(point))) {
            point.x = maxX - 1;
          }
          break;
        case Direction.RIGHT:
          point.x++;
          if (walls.has(mapPointToKey(point))) {
            point.x = 1;
          }
          break;
      }

      if (newBlizzards.has(mapPointToKey(point))) {
        newBlizzards.get(mapPointToKey(point))!.push(blizzard);
      } else {
        newBlizzards.set(mapPointToKey(point), [blizzard]);
      }
    }
  }
  
  return newBlizzards;
}

function draw(blizzards: Map<string, Blizzard[]> = allBlizzards, round: number = 0, expeditationPositions: Set<string> = new Set<string>()) {
  console.clear();
  for (let y = 0; y < matrix.length; y++) {
    let line = "";
    for (let x = 0; x < matrix[y].length; x++) {
      const key = mapPointToKey({ x, y });
      if (blizzards.has(key)) {
        const blizzardsCount = blizzards.get(key)!.length;
        if (blizzardsCount === 1) {
          line += blizzards.get(key)![0].direction;
        } else {
        line += blizzardsCount;
        }
      } else if (walls.has(key)) {
        line += "#";
      } else if (expeditationPositions.has(key)) {
        line += "E";
      } else {
        line += ".";
      }
    }
    console.log(line);
  }
  console.log("Round:", round + 1, "Expedition positions:", expeditationPositions.size);
}

function possibleMoves(point: Point, blizzards: Map<string, Blizzard[]>): Point[] {
  const possiblePoints: Point[] = [];
  if (!walls.has(mapPointToKey(point)) && !blizzards.has(mapPointToKey(point))) {
    possiblePoints.push(point);
  }
  const up = { x: point.x, y: point.y - 1 };
  if (!walls.has(mapPointToKey(up)) && !blizzards.has(mapPointToKey(up)) && up.y >= 0 && up.y <= maxY && up.x >= 0 && up.x <= maxX) {
    possiblePoints.push(up);
  }
  const down = { x: point.x, y: point.y + 1 };
  if (!walls.has(mapPointToKey(down)) && !blizzards.has(mapPointToKey(down)) && down.y >= 0 && down.y <= maxY && down.x >= 0 && down.x <= maxX) {
    possiblePoints.push(down);
  }
  const left = { x: point.x - 1, y: point.y };
  if (!walls.has(mapPointToKey(left)) && !blizzards.has(mapPointToKey(left)) && left.y >= 0 && left.y <= maxY && left.x >= 0 && left.x <= maxX) {
    possiblePoints.push(left);
  }
  const right = { x: point.x + 1, y: point.y };
  if (!walls.has(mapPointToKey(right)) && !blizzards.has(mapPointToKey(right)) && right.y >= 0 && right.y <= maxY && right.x >= 0 && right.x <= maxX) {
    possiblePoints.push(right);
  }
  return possiblePoints;
}


function solve(rounds: number = Infinity) {
  let currentBlizzards = new Map<string, Blizzard[]>();
  for (const [key, blizzards] of allBlizzards) {
    currentBlizzards.set(key, blizzards);
  }
  let expeditationPositions = new Set<string>();
  expeditationPositions.add(mapPointToKey(start));
  let currentRound = 0;
  while (currentRound < rounds) {
    currentBlizzards = moveBlizzards(currentBlizzards);
    const newExpeditionPositions = new Set<string>();
    for (const key of expeditationPositions) {
      const point = mapKeyToPoint(key);
      if (point.x === goal.x && point.y === goal.y) {
        return currentRound;
      }
      const possiblePoints = possibleMoves(point, currentBlizzards);
      for (const possiblePoint of possiblePoints) {
        newExpeditionPositions.add(mapPointToKey(possiblePoint));
      }
    }
    expeditationPositions = newExpeditionPositions;

    currentRound++;
    // draw(currentBlizzards, currentRound, expeditationPositions);
    // sleepSync(1 / 120);
  }

  return currentRound;
}

console.log("Solution:", solve());




