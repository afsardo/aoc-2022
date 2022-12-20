export const solution = "a";

const input = await Bun.file("src/day-18/input.txt").text();

type Point = {
  x: number;
  y: number;
  z: number;
};

function mapPointToKey(point: Point) : string {
  return `${point.x},${point.y},${point.z}`;
}

function compareSides(a: string, b: string) : number {
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
  ].sort(compareSides).join(";");
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

const totalSides = cubes.length * 6;
const touchingSides = Array.from(seenSides.values()).filter((count) => count > 1).reduce((a, b) => a + b, 0);

console.log("Solution:", totalSides - touchingSides);