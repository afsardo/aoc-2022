import { sleepSync } from "bun";

export const solution = "a";

const input = await Bun.file("src/day-17/input.txt").text();

const drawnPieces : Set<string> = new Set();

const horizontalSize = 7;
const spawnHorizontal = 2;
const spawnVertical = 3;

type Position = {
  x: number;
  y: number;
};

abstract class Shape {
  constructor(public x: number, public y: number) {}
  abstract positions() : Position[];

  fall(): boolean {
    const oldY = this.y;

    this.y--;

    if (!this.validPosition()) {
      this.y = oldY;
      return false;
    }

    return true;
  }

  move(direction: number) : boolean {
    const oldX = this.x;

    this.x += direction;

    if (!this.validPosition()) {
      this.x = oldX;
      return false;
    }

    return true;
  }

  validPosition() : boolean {
    for (const position of this.positions()) {
      if (drawnPieces.has(`${position.x},${position.y}`) || position.y < 0 || position.x < 0 || position.x >= horizontalSize) {
        return false;
      }
    }
    return true;
  }
}

class Line extends Shape {
  positions() : Position[] {
    return [
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
      { x: this.x + 2, y: this.y },
      { x: this.x + 3, y: this.y },
    ];
  }
}

class Plus extends Shape {
  constructor(x: number, y: number) {
    super(x, y + 2);
  }

  positions() : Position[] {
    return [
      { x: this.x + 1, y: this.y },
      { x: this.x, y: this.y - 1 },
      { x: this.x + 1, y: this.y - 1 },
      { x: this.x + 2, y: this.y - 1 },
      { x: this.x + 1, y: this.y - 2 },
    ];
  }
}

class L extends Shape {
  constructor(x: number, y: number) {
    super(x, y + 2);
  }

  positions() : Position[] {
    return [
      { x: this.x + 2, y: this.y },
      { x: this.x + 2, y: this.y - 1 },
      { x: this.x + 2, y: this.y - 2 },
      { x: this.x + 1, y: this.y - 2 },
      { x: this.x, y: this.y - 2 },
    ];
  }
}

class I extends Shape {
  constructor(x: number, y: number) {
    super(x, y + 3);
  }

  positions() : Position[] {
    return [
      { x: this.x, y: this.y },
      { x: this.x, y: this.y - 1 },
      { x: this.x, y: this.y - 2 },
      { x: this.x, y: this.y - 3 },
    ];
  }
}

class Square extends Shape {
  constructor(x: number, y: number) {
    super(x, y + 1);
  }

  positions() : Position[] {
    return [
      { x: this.x, y: this.y },
      { x: this.x + 1, y: this.y },
      { x: this.x, y: this.y - 1 },
      { x: this.x + 1, y: this.y - 1 },
    ];
  }
}

function directionFromStr(str: string) {
  switch (str) {
    case "<": return -1;
    case ">": return 1;
    default: throw new Error("Unknown direction");
  }
}

const gasDirection : string[] = input.split("");

const shapeSequence : (typeof Line | typeof Plus | typeof L | typeof I | typeof Square)[] = [
  Line, Plus, L, I, Square
];

function draw(currentHeight: number, fallingPiece: Shape) {
  const fallingPiecePositions = fallingPiece.positions().map(p => `${p.x},${p.y}`)

  for (let y = currentHeight; y >= 0; y--) {
    const line = [];
    line.push("|");
    for (let x = 0; x < horizontalSize; x++) {
      const position = `${x},${y}`;
      if (fallingPiecePositions.includes(position)) {
        line.push("@");
      } else {
        if (drawnPieces.has(`${x},${y}`)) {
          line.push("#");
        } else {
          line.push(".");
        }
      }
    }
    line.push("|");
    console.log(line.join(""));
  }
  console.log("+" + "-".repeat(horizontalSize) + "+");
}

const maxFallenPieces = 2022;

const fallenPieces = [];
let currentY = 3;
let currentShapeSequence = 1;
let currentGasDirection = 0;
let fallingPiece : Shape = new shapeSequence[0](spawnHorizontal, spawnVertical);
let gasEffect = false;

while (fallenPieces.length < maxFallenPieces) {
  // console.clear();
  // draw(currentY, fallingPiece);

  if (gasEffect) {
    const success = fallingPiece.fall();
    gasEffect = false;
    if (!success) {
      fallenPieces.push(fallingPiece);
      for (const position of fallingPiece.positions()) {
        drawnPieces.add(`${position.x},${position.y}`);
      }
      fallingPiece = new shapeSequence[currentShapeSequence](spawnHorizontal, fallenPieces.reduce((prev, piece) => Math.max(prev, piece.y), 0) + spawnVertical + 1);
      currentY = fallingPiece.y;
      currentShapeSequence = (currentShapeSequence + 1) % shapeSequence.length;
    }
  } else {
    const direction = directionFromStr(gasDirection[currentGasDirection]);
    currentGasDirection = (currentGasDirection + 1) % gasDirection.length;
    fallingPiece.move(direction);
    gasEffect = true;
  }

  // sleepSync(1 / 8);
}

console.log("Solution:", fallenPieces.reduce((prev, piece) => Math.max(prev, piece.y), 0) + 1);
