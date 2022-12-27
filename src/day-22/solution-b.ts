export const solution = "b";

const input = await Bun.file("src/day-22/input.txt").text();

enum Direction {
  Right = 1,
  Down = 2,
  Left = 3,
  Up = 4,
}

function printDirection(direction: Direction): string {
  switch (direction) {
    case Direction.Up:
      return "^";
    case Direction.Right:
      return ">";
    case Direction.Down:
      return "v";
    case Direction.Left:
      return "<";
    default:
      throw new Error("Unknown direction");
  }
}

type Position = [number, number];

function positionKey(position: Position): string {
  return position.join(",");
}

type Action = {
  type: "move";
  steps: number;
} | {
  type: "turn";
  direction: "L" | "R";
};

enum Tile {
  Void = " ",
  Path = ".",
  Wall = "#"
};


const faceSize = 50;
const map : Map<string, Tile> = new Map();
const matrix : Tile[][] = [];
let parsingMap = true;
const actions : Action[] = [];
let initialPosition : Position | null = null;
let currentRow = 0;
for (const line of input.split("\n")) {
  if (line === "") {
    parsingMap = false;
    continue;
  }

  if (parsingMap) {
    matrix[currentRow] = matrix[currentRow] || [];
    for (const [column, char] of line.split("").entries()) {
      const mapKey = positionKey([currentRow, column]);
      map.set(mapKey, char as Tile);
      matrix[currentRow][column] = char as Tile;

      if (currentRow === 0 && char !== " " && !initialPosition) {
        initialPosition = [0, column];
      }
    }
    currentRow++;
  }

  if (!parsingMap) {
    const actionsParse = line.match(/((\d+)|R|L)/ig);
    for (const step of actionsParse) {
      if (!isNaN(Number(step))) {
        actions.push({
          type: "move",
          steps: Number(step),
        });
      } else {
        actions.push({
          type: "turn",
          direction: step as "L" | "R",
        });
      }
    }
  }
}

function turn(direction: Direction, turn: "L" | "R"): Direction {
  if (turn === "L") {
    if (direction === Direction.Up) {
      return Direction.Left;
    }
    if (direction === Direction.Right) {
      return Direction.Up;
    }
    if (direction === Direction.Down) {
      return Direction.Right;
    }
    if (direction === Direction.Left) {
      return Direction.Down;
    }
  } else if (turn === "R") {
    if (direction === Direction.Up) {
      return Direction.Right;
    }
    if (direction === Direction.Right) {
      return Direction.Down;
    }
    if (direction === Direction.Down) {
      return Direction.Left;
    }
    if (direction === Direction.Left) {
      return Direction.Up;
    }
  } else {
    throw new Error("Unknown turn");
  }
}

function portal(direction: Direction, position: Position, originalPosition: Position): [Position, Direction] | null {
  const [originalRow, originalColumn] = originalPosition;
  const [row, column] = position;

  // ADJACENT CHECK
  if (direction === Direction.Left || direction === Direction.Right) {
    for (let i = 1; i <= faceSize; i++) {
      let newColumn = direction === Direction.Left ? originalColumn - i : originalColumn + i;
      const topPosition : Position = [originalRow - i, newColumn];
      const topTile = map.get(positionKey(topPosition));
      if (topTile && topTile !== Tile.Void) {
        return [topPosition, Direction.Up];
      }
      const bottomPosition : Position = [originalRow + i, newColumn];
      const bottomTile = map.get(positionKey(bottomPosition));
      if (bottomTile && bottomTile !== Tile.Void) {
        return [bottomPosition, Direction.Down];
      }
    }
  }

  if (direction === Direction.Up || direction === Direction.Down) {
    for (let i = 1; i <= faceSize; i++) {
      let newRow = direction === Direction.Up ? originalRow - i : originalRow + i;
      const leftPosition : Position = [newRow, originalColumn - i];
      const leftTile = map.get(positionKey(leftPosition));
      if (leftTile && leftTile !== Tile.Void) {
        return [leftPosition, Direction.Left];
      }
      const rightPosition : Position = [newRow, originalColumn + i];
      const rightTile = map.get(positionKey(rightPosition));
      if (rightTile && rightTile !== Tile.Void) {
        return [rightPosition, Direction.Right];
      }
    }
  }

  // HARDCODED CHECK FOR CONNECTED EDGES
  if (row < 0) {
    if (column >= faceSize && column < faceSize * 2) {
      const newPosition : Position = [faceSize * 2 + column, 0];
      const newTile = map.get(positionKey(newPosition));
      if (newTile && newTile !== Tile.Void) {
        return [newPosition, Direction.Right];
      }
    }
    if (column >= faceSize * 2 && column < faceSize * 3) {
      const newPosition : Position = [faceSize * 4 - 1, column % faceSize];
      const newTile = map.get(positionKey(newPosition));
      if (newTile && newTile !== Tile.Void) {
        return [newPosition, Direction.Up];
      }
    }
  }

  if (column >= faceSize * 3) {
    const newPosition : Position = [faceSize * 2 + faceSize - 1 - row, faceSize * 2 - 1];
    const newTile = map.get(positionKey(newPosition));
    if (newTile && newTile !== Tile.Void) {
      return [newPosition, Direction.Left];
    }
  }

  if (column >= faceSize * 2 && (row >= faceSize * 2 || row < faceSize * 3)) {
    const newPosition : Position = [(faceSize - 1) - row  % faceSize, faceSize * 3 - 1];
    const newTile = map.get(positionKey(newPosition));
    if (newTile && newTile !== Tile.Void) {
      return [newPosition, Direction.Left];
    }
  }

  if (column < faceSize && row >= 0 && row < faceSize) {
    const newPosition : Position = [faceSize * 2 + ((faceSize - 1) - row % faceSize), 0];
    const newTile = map.get(positionKey(newPosition));
    if (newTile && newTile !== Tile.Void) {
      return [newPosition, Direction.Right];
    }
  }

  if (column < 0 && row >= faceSize * 2 && row < faceSize * 3) {
    const newPosition : Position = [(faceSize - 1) - row % faceSize, faceSize];
    const newTile = map.get(positionKey(newPosition));
    if (newTile && newTile !== Tile.Void) {
      return [newPosition, Direction.Right];
    }
  }

  if (column < 0 && row >= faceSize * 3 && row < faceSize * 4) {
    const newPosition : Position = [0, faceSize + row % faceSize];
    const newTile = map.get(positionKey(newPosition));
    if (newTile && newTile !== Tile.Void) {
      return [newPosition, Direction.Down];
    }
  }

  if (row >= faceSize * 4) {
    const newPosition : Position = [0, faceSize * 2 + column];
    const newTile = map.get(positionKey(newPosition));
    if (newTile && newTile !== Tile.Void) {
      return [newPosition, Direction.Down];
    } 
  }

  throw new Error(`Unknown portal (position: ${position}) | (original position: ${originalPosition}) (direction: ${printDirection(direction)})`);
}

function move(direction: Direction, position: Position): [Position, Direction] | null {
  const [row, column] = position;

  let newDirection = direction;
  let newRow = row;
  let newColumn = column;
  if (direction === Direction.Up) {
    newRow = row - 1; 
  }
  if (direction === Direction.Right) {
    newColumn = column + 1;
  }
  if (direction === Direction.Down) {
    newRow = row + 1;
  }
  if (direction === Direction.Left) {
    newColumn = column - 1;
  }

  const potentialPosition : Position = [newRow, newColumn];
  const potentialTile = map.get(positionKey(potentialPosition));

  if (!potentialTile || potentialTile === Tile.Void) {
    const portalResult = portal(direction, potentialPosition, position);
    if (portalResult) {
      [[newRow, newColumn], newDirection] = portalResult;
    }
  }

  const newPosition : Position = [newRow, newColumn];
  const newTile = map.get(positionKey(newPosition));

  if (!newTile || newTile === Tile.Void) {
    throw new Error(`Impossible move to tile (position: ${newPosition}) (direction: ${printDirection(newDirection)})`);
  }

  if (newTile === Tile.Wall) {
    return null;
  }

  return [[newRow, newColumn], newDirection];
}

let currentDirection = Direction.Right;
let currentPosition : Position = initialPosition;

for (const action of actions) {
  if (action.type === "turn") {
    currentDirection = turn(currentDirection, action.direction);
  } else  if (action.type === "move") {
    for (let i = 0; i < action.steps; i++) {
      const result = move(currentDirection, currentPosition);
      if (!result) break;
      const [newPosition, newDirection] = result;
      currentPosition = newPosition;
      currentDirection = newDirection;
    }
  }
}

// console.log("Final position:", currentPosition);
// console.log("Direction:", currentDirection);
console.log("Solution:", 1000 * (currentPosition[0] + 1) + 4 * (currentPosition[1] + 1) + (currentDirection - 1));