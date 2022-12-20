export const solution = "b";

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
  public name = "abstract Shape";

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
  public name = "Line";

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
  public name = "Plus";

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
  public name = "L";

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
  public name = "I";

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
  public name = "Square";

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

function lineDrawn(y: number): boolean {
  for (let x = 0; x < horizontalSize; x++) {
    if (!drawnPieces.has(`${x},${y}`)) {
      return false;
    }
  }
  return true;
}

let lastMemory : {
  key: string,
  totalFallenPieces: number,
  fallenPiecesInLoop: number,
  shapeSequence: number,
  gasDirection: number,
  height: number,
} | null = null;

let countFallenPiecesSinceLastMemory = 0;

const maxFallenPieces = 1_000_000_000_000;
let countFallenPieces = 0;
let fallenPieces = [];
let currentShapeSequence = 1;
let currentGasDirection = 0;
let fallingPiece : Shape = new shapeSequence[0](spawnHorizontal, spawnVertical);
let gasEffect = false;

while (countFallenPieces < maxFallenPieces) {
  if (gasEffect) {
    const success = fallingPiece.fall();
    gasEffect = false;
    if (!success) {
      fallenPieces.unshift(fallingPiece);
      countFallenPieces++;
      countFallenPiecesSinceLastMemory++;
      fallenPieces = fallenPieces.slice(0, 7);
      for (const position of fallingPiece.positions()) {
        drawnPieces.add(`${position.x},${position.y}`);
      }
      fallingPiece = new shapeSequence[currentShapeSequence](spawnHorizontal, fallenPieces.reduce((prev, piece) => Math.max(prev, piece.y), 0) + spawnVertical + 1);
      currentShapeSequence = (currentShapeSequence + 1) % shapeSequence.length;

      const maxHeight = fallenPieces.reduce((prev, piece) => Math.max(prev, piece.y), 0);
      if (lineDrawn(maxHeight)) {
        const memoryKey = `${currentShapeSequence},${currentGasDirection},${countFallenPiecesSinceLastMemory}`;
        if (lastMemory?.key === memoryKey) {
          const remainingPieces = maxFallenPieces - countFallenPieces;
          const remainingLoops = Math.floor(remainingPieces / lastMemory.fallenPiecesInLoop);
          const heightDiff = maxHeight - lastMemory.height;
          const newMaxHeight = maxHeight + remainingLoops * heightDiff;
          fallingPiece.y = fallingPiece.y + newMaxHeight - maxHeight;
          countFallenPieces = remainingLoops * lastMemory.fallenPiecesInLoop + countFallenPieces;
          fallenPieces = [];
          currentShapeSequence = lastMemory.shapeSequence;
          currentGasDirection = lastMemory.gasDirection;

          for (let x = 0; x < horizontalSize; x++) {
            drawnPieces.add(`${x},${newMaxHeight}`)
          }
        } else {
          lastMemory = {
            key: memoryKey,
            totalFallenPieces: countFallenPieces,
            fallenPiecesInLoop: countFallenPiecesSinceLastMemory,
            shapeSequence: currentShapeSequence,
            gasDirection: currentGasDirection,
            height: maxHeight,
          };
          countFallenPiecesSinceLastMemory = 0;
        }
      }
    }
  } else {
    const direction = directionFromStr(gasDirection[currentGasDirection]);
    currentGasDirection = (currentGasDirection + 1) % gasDirection.length;
    fallingPiece.move(direction);
    gasEffect = true;
  }
}

console.log("Solution:", fallenPieces.reduce((prev, piece) => Math.max(prev, piece.y), 0) + 1);
