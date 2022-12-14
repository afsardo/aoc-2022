import { sleepSync } from "bun";

export const solution = "b";

const input = await Bun.file("src/day-14/input.txt").text();

class Point {
  constructor(public x: number, public y: number) {}

  copy() {
    return new Point(this.x, this.y);
  }
}

class SandPoint extends Point {
  private _lastPosition: SandPoint | null = null;
  private _isFalling = true;

  constructor(x: number, y: number, lastPosition: SandPoint | null = null, isFalling = true) {
    super(x, y);
    this._lastPosition = lastPosition;
    this._isFalling = isFalling;
  }

  private _fallTo(map: string[][], newX: number, newY: number) {
    if (!this._isFalling) return false;

    if (newY >= maxY) {
      return false;
    }

    const newPositionValue = map[newY - minY][newX - minX];
    if (newPositionValue === "#" || newPositionValue === "o") {
      return false;
    }


    this.y = newY;
    this.x = newX;
    return true;
  }

  fall(map: string[][]) {
    if (!this._isFalling) return false;

    const possibleLastPosition = this.copy();

    if (this._fallTo(map, this.x, this.y + 1)) {
      this._lastPosition = possibleLastPosition;
      return true;
    }

    if (this._fallTo(map, this.x - 1, this.y + 1)) {
      this._lastPosition = possibleLastPosition;
      return true;
    }

    if (this._fallTo(map, this.x + 1, this.y + 1)) {
      this._lastPosition = possibleLastPosition;
      return true;
    }

    this._isFalling = false;
    return false;
  }

  isFalling() {
    return this._isFalling;
  }

  lastPosition() {
    return this._lastPosition.copy();
  }

  copy() {
    return new SandPoint(this.x, this.y, this._lastPosition?.copy(), this._isFalling);
  }
}

class Path {
  constructor(public points: Point[]) {}

  get length() {
    return this.points.length;
  }

  get start() {
    return this.points[0];
  }

  get end() {
    return this.points[this.points.length - 1];
  }
}

const rocks = input.split("\n");
const rockPaths = rocks.map((line) => {
  const coordinates = line.split(" -> ");
  return new Path(coordinates.map(point => {
    const [x, y] = point.split(",");
    return new Point(parseInt(x), parseInt(y));
  }));
});
const sandStartingPoint = new SandPoint(500, 0);
const allPoints = [sandStartingPoint, ...rockPaths.flatMap(rockPath => rockPath.points)]
const minX = Math.min(...allPoints.map(point => point.x)) - 5;
const maxX = Math.max(...allPoints.map(point => point.x)) + 5;
const minY = Math.min(...allPoints.map(point => point.y));
const maxY = Math.max(...allPoints.map(point => point.y)) + 2;

function draw(rockPaths: Path[], sandPoints: SandPoint[], options: { display?: { clear: () => void; log: (text: string) => void } }) {
  const map: string[][] = [];

  for (let y = 0; y <= maxY - minY; y++) {
    map[y] = [];

    for (let x = 0; x <= maxX - minX; x++) {
      map[y][x] = ".";
    }
  }

  for (let x = 0; x <= maxX - minX; x++) {
    map[maxY - minY][x] = "#";
  }

  map[sandStartingPoint.y - minY][sandStartingPoint.x - minX] =  "+";
  
  for (const sandPoint of sandPoints) {
    map[sandPoint.y - minY][sandPoint.x - minX] = sandPoint.isFalling() ? "+" : "o";
  }

  for (const rockPath of rockPaths) {
    for (let i = 0; i < rockPath.points.length; i++) {
      if (i + 1 === rockPath.points.length) continue;

      const point = rockPath.points[i];
      const nextPoint = rockPath.points[i + 1];

      if (point.x === nextPoint.x) {
        const pathMinY = Math.min(point.y, nextPoint.y);
        const pathMaxY = Math.max(point.y, nextPoint.y);

        for (let y = pathMinY; y <= pathMaxY; y++) {
          map[y - minY][point.x - minX] = "#";
        }
      } else if (point.y === nextPoint.y) {
        const pathMinX = Math.min(point.x, nextPoint.x);
        const pathMaxX = Math.max(point.x, nextPoint.x);
        for (let x = pathMinX; x <= pathMaxX; x++) {
          map[point.y - minY][x - minX] = "#";
        }
      }
    }
  }

  if (options.display) {
    options.display.clear();
    for (let y = 0; y < map.length; y++) {
      options.display.log(map[y].join(""));
    }
  }

  return map;
}

const sandPoints : SandPoint[] = [];
let currentSandPoint = sandStartingPoint.copy();

while (true) {
  const map = draw(rockPaths, [currentSandPoint, ...sandPoints], { display: console });
  console.log("Sand units:", sandPoints.length);
  sleepSync(1 / 120);
  
  const success = currentSandPoint.fall(map);
  if (!success) {
    sandPoints.push(currentSandPoint);
    if (currentSandPoint.y === sandStartingPoint.y && currentSandPoint.x === sandStartingPoint.x) break;
    currentSandPoint = currentSandPoint.lastPosition();
  }
}

console.log("Sand units:", sandPoints.length);