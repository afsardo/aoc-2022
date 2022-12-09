export const solution = "a";

const input = await Bun.file("src/day-9/input.txt").text();

enum Direction {
  Up = "U",
  Down = "D",
  Left = "L",
  Right = "R",
}

class Move {
  direction: Direction;
  distance: number;

  constructor(move: string) {
    const [directionStr, distanceStr] = move.split(" ");
    this.direction = fromStrToDirection(directionStr);
    this.distance = parseInt(distanceStr);
  }
}

class PositionSet extends Set<Position> {
  add(value: Position) {
    if (this.has(value)) return;
    return super.add(value);
  }

  clear() {
    super.clear();
  }

  has(position: Position): boolean {
    return Array.from(this).some(p => p.equals(position));
  }

  delete(position: Position): boolean {
    if (!this.has(position)) return false;

    const values = Array.from(this).filter(p => !p.equals(position));

    this.clear();
    values.forEach(v => this.add(v));

    return true;
  }
}

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move (direction: Direction) {
    switch (direction) {
      case Direction.Up:
        this.y++;
        break;
        case Direction.Down:
        this.y--;
        break;
        case Direction.Left:
        this.x--;
        break;
        case Direction.Right:
        this.x++;
        break;
    }
  }

  isAdjacentOrOverlapping (other: Position) {
    return Math.abs(this.x - other.x) <= 1 && Math.abs(this.y - other.y) <= 1;
  }
  
  toString() {
    return `(${this.x},${this.y})`;
  }

  equals(other: Position) {
    return this.x === other.x && this.y === other.y;
  }
}

function fromStrToDirection(str: string): Direction {
  switch (str) {
    case "U":
      return Direction.Up;
    case "D":
      return Direction.Down;
    case "L":
      return Direction.Left;
    case "R":
      return Direction.Right;
    default:
      throw new Error(`Unknown direction: ${str}`);
  }
}

function calculateMoves(head: Position, tail: Position): Move[] {
  if (head.x === tail.x) { // Same horizontal line
    if (head.y + 1 > tail.y) { // Head is above tail
      return [new Move("U 1")];
    } 
    if (head.y - 1 < tail.y) { // Head is below tail
      return [new Move("D 1")];
    }
  } else if (head.y === tail.y) { // Same vertical line
    if (head.x + 1 > tail.x) { // Head is right of tail
      return [new Move("R 1")];
    } 
    
    if (head.x - 1 < tail.x) { // Head is left of tail
      return [new Move("L 1")];
    }
  } else { // Diagonal
    if (head.x + 1 > tail.x) { // Head is right of tail
      if (head.y + 1 > tail.y) { // Head is above tail
        return [new Move("U 1"), new Move("R 1")];
      }
      if (head.y - 1 < tail.y) { // Head is below tail
        return [new Move("D 1"), new Move("R 1")];
      }
    } else if (head.x - 1 < tail.x) { // Head is left of tail
      if (head.y + 1 > tail.y) { // Head is above tail
        return [new Move("U 1"), new Move("L 1")];
      }
      if (head.y - 1 < tail.y) { // Head is below tail
        return [new Move("D 1"), new Move("L 1")];
      }
    }
  }

  return [];
}

const headPosition = new Position(0, 0);
const tailPosition = new Position(0, 0);
const positionsTailVisted = new PositionSet();

for (const moveStr of input.split("\n")) {
  const move = new Move(moveStr);
  

  for (let i = 0; i < move.distance; i++) {
    headPosition.move(move.direction)

    if (!tailPosition.isAdjacentOrOverlapping(headPosition)) {
      const tailMoves = calculateMoves(headPosition, tailPosition);
      for (const tailMove of tailMoves) {
        for (let i = 0; i < tailMove.distance; i++) {
          tailPosition.move(tailMove.direction)
          
        }
      }
    }
    positionsTailVisted.add(new Position(tailPosition.x, tailPosition.y));
  }
}

console.log("Solution:", positionsTailVisted.size);