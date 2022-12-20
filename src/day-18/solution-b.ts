export const solution = "b";

const input = await Bun.file("src/day-18/input.txt").text();

type Point = {
  x: number;
  y: number;
  z: number;
};

function mapPointToKey(point: Point) : string {
  return `${point.x},${point.y},${point.z}`;
}

function compareKeys(a: string, b: string) : number {
  return a.localeCompare(b);
}

type Side = {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
};

function mapSideToKey(side: Side) : string {
  return [
    mapPointToKey(side.topLeft),
    mapPointToKey(side.topRight),
    mapPointToKey(side.bottomLeft),
    mapPointToKey(side.bottomRight),
  ].sort(compareKeys).join(";");
}

class Cube {
  constructor(public x: number, public y: number, public z: number) {}

  sides() : Side[] {
    return [
      // Bottom
      {
        topLeft: { x: this.x, y: this.y + 1, z: this.z },
        topRight: { x: this.x + 1, y: this.y + 1, z: this.z },
        bottomLeft: { x: this.x, y: this.y, z: this.z },
        bottomRight: { x: this.x + 1, y: this.y, z: this.z },
      },
      // Top
      {
        topLeft: { x: this.x, y: this.y + 1, z: this.z + 1 },
        topRight: { x: this.x + 1, y: this.y + 1, z: this.z + 1 },
        bottomLeft: { x: this.x, y: this.y, z: this.z + 1 },
        bottomRight: { x: this.x + 1, y: this.y, z: this.z + 1 },
      },

      // Front
      {
        topLeft: { x: this.x, y: this.y, z: this.z + 1 },
        topRight: { x: this.x + 1, y: this.y, z: this.z + 1 },
        bottomLeft: { x: this.x, y: this.y, z: this.z },
        bottomRight: { x: this.x + 1, y: this.y, z: this.z },
      },
      // Back
      {
        topLeft: { x: this.x, y: this.y + 1, z: this.z + 1 },
        topRight: { x: this.x + 1, y: this.y + 1, z: this.z + 1 },
        bottomLeft: { x: this.x, y: this.y + 1, z: this.z },
        bottomRight: { x: this.x + 1, y: this.y + 1, z: this.z },
      },

      // Left
      {
        topLeft: { x: this.x, y: this.y, z: this.z + 1 },
        topRight: { x: this.x, y: this.y + 1, z: this.z + 1 },
        bottomLeft: { x: this.x, y: this.y, z: this.z },
        bottomRight: { x: this.x, y: this.y + 1, z: this.z },
      },
      // Right
      {
        topLeft: { x: this.x + 1, y: this.y, z: this.z + 1 },
        topRight: { x: this.x + 1, y: this.y + 1, z: this.z + 1 },
        bottomLeft: { x: this.x + 1, y: this.y, z: this.z },
        bottomRight: { x: this.x + 1, y: this.y + 1, z: this.z },
      },
    ];
  }
}

const cubes : Cube[] = [];

for (const line of input.split("\n")) {
  const [x, y, z] = line.split(",").map(Number);
  cubes.push(new Cube(x, y, z));
}

const seenSides : Map<string, number> = new Map();

for (const cube of cubes) {
  for (const side of cube.sides()) {
    const key = mapSideToKey(side);
    const count = seenSides.get(key) || 0;
    seenSides.set(key, count + 1);
  }
}

const MIN = Math.min(...cubes.flatMap((cube) => [cube.x, cube.y, cube.z]));
const MAX = Math.max(...cubes.flatMap((cube) => [cube.x, cube.y, cube.z]));

let sidesTouched = 0;
let pointsVisited : Set<string> = new Set();
let pointsToVisit : Point[] = [{ x: 0, y: 0, z: 0 }];
while (pointsToVisit.length > 0) {
  const point = pointsToVisit.shift()!;

  const pointKey = mapPointToKey(point);
  if (pointsVisited.has(pointKey)) {
    continue;
  }

  if (point.x < MIN - 1 || point.x > MAX + 1 || point.y < MIN - 1 || point.y > MAX + 1 || point.z < MIN - 1 || point.z > MAX + 1) {
    continue;
  }

  if (cubes.some((cube) => cube.x === point.x && cube.y === point.y && cube.z === point.z)) {
    continue;
  }

  const cube = new Cube(point.x, point.y, point.z);
  const sides = cube.sides();
  for (const side of sides) {
    const key = mapSideToKey(side);
    const count = seenSides.get(key) || 0;
    if (count === 1) {
      sidesTouched++;
    }
  }

  pointsVisited.add(pointKey);

  pointsToVisit.push({ x: point.x + 1, y: point.y, z: point.z });
  pointsToVisit.push({ x: point.x - 1, y: point.y, z: point.z });
  pointsToVisit.push({ x: point.x, y: point.y + 1, z: point.z });
  pointsToVisit.push({ x: point.x, y: point.y - 1, z: point.z });
  pointsToVisit.push({ x: point.x, y: point.y, z: point.z + 1 });
  pointsToVisit.push({ x: point.x, y: point.y, z: point.z - 1 });
}

console.log("Solution:", sidesTouched);