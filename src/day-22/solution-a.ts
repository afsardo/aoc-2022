export const solution = "a";

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

const maxColumns = matrix[0].length;
const maxRows = matrix.length;

function move(direction: Direction, position: Position): Position | null {
  const [row, column] = position;

  let newRow = row;
  let newColumn = column;
  if (direction === Direction.Up) {
    newRow = row - 1; 
    if (newRow < 0) newRow = maxRows - 1;
  }
  if (direction === Direction.Right) {
    newColumn = (column + 1) % maxColumns;
  }
  if (direction === Direction.Down) {
    newRow = (row + 1) % maxRows;
  }
  if (direction === Direction.Left) {
    newColumn = column - 1;
    if (newColumn < 0) newColumn = maxColumns - 1;
  }

  const newPosition : Position = [newRow, newColumn];
  const mapKey = positionKey(newPosition);
  const tile = map.get(mapKey);

  if (!tile || tile === Tile.Void) {
    return move(direction, newPosition);
  }

  if (tile === Tile.Wall) {
    return null;
  }

  return [newRow, newColumn];
}

let currentDirection = Direction.Right;
let currentPosition : Position = initialPosition;
let visitedPositions : Map<string, Direction> = new Map();
visitedPositions.set(positionKey(initialPosition), currentDirection);

function drawMap() {
  for (let row = 0; row < matrix.length; row++) {
    let line = "";
    for (let column = 0; column < matrix[row].length; column++) {
      const tile = matrix[row][column];
      const visitedPosition = visitedPositions.get(positionKey([row, column]));
      if (visitedPosition) {
        line += printDirection(visitedPosition);
      } else {
        line += tile;
      }
    }
    console.log(line);
  }
}

for (const action of actions) {
  if (action.type === "turn") {
    currentDirection = turn(currentDirection, action.direction);
    visitedPositions.set(positionKey(currentPosition), currentDirection);
  }
  if (action.type === "move") {
    for (let i = 0; i < action.steps; i++) {
      const newPosition = move(currentDirection, currentPosition);
      if (!newPosition) break;
      currentPosition = newPosition;
      visitedPositions.set(positionKey(currentPosition), currentDirection);
    }
  }
}

// drawMap();
// console.log("Final position:", currentPosition);
// console.log("Direction:", currentDirection);
console.log("Solution:", 1000 * (currentPosition[0] + 1) + 4 * (currentPosition[1] + 1) + (currentDirection - 1));