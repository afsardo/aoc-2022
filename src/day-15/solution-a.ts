export const solution = "a";

const input = await Bun.file("src/day-15/input.txt").text();

class Position {
  constructor(public x: number, public y: number, public label: string) {}

  get key() {
    return Position.key(this.x, this.y);
  }

  static key(x: number, y: number) {
    return `${x},${y}`;
  }
}

class Beacon extends Position {
  constructor(public x: number, public y: number) {
    super(x, y, "B");
  }
}

class Sensor extends Position {
  constructor(public x: number, public y: number, public closestBeacon: Beacon) {
    super(x, y, "S");
  }
}

class Empty extends Position {
  constructor(public x: number, public y: number) {
    super(x, y, "#");
  }
}

function calculatedDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function calculateEmptyPositions(sensor: Sensor, beacon: Beacon, checkY: number): Empty[] {
  const emptyPositions: Empty[] = [];
  const distance = calculatedDistance(sensor, beacon);

  const startingX = sensor.x;

  let units = 0;
  while(true) {
    const checkEmptyRightPosition = new Empty(startingX + units, checkY);
    const calculatedRightDistance = calculatedDistance(sensor, checkEmptyRightPosition);
    const checkEmptyLeftPosition = new Empty(startingX - units, checkY);
    const calculatedLeftDistance = calculatedDistance(sensor, checkEmptyLeftPosition);

    if (calculatedRightDistance > distance || calculatedLeftDistance > distance) {
      break;
    }

    emptyPositions.push(checkEmptyRightPosition);
    emptyPositions.push(checkEmptyLeftPosition);

    units++;
  }
  
  return emptyPositions;
}

const checkY = 2_000_000;

const grid = new Map<string, Position>();

for (const line of input.split("\n")) {
  const [sensorStr, beaconStr] = line.split(": ");
  const [x, y] = sensorStr.replace("Sensor at ", "").split(", ").map(str => Number(str.replace("x=", "").replace("y=", "")));
  const [closestX, closestY] = beaconStr.replace("closest beacon is at ", "").split(", ").map(str => Number(str.replace("x=", "").replace("y=", "")));
  const beacon = new Beacon(closestX, closestY);
  const sensor = new Sensor(x, y, beacon);
  grid.set(sensor.key, sensor);
  grid.set(beacon.key, beacon);
  const emptyPositions = calculateEmptyPositions(sensor, beacon, checkY);
  for (const emptyPosition of emptyPositions) {
    if (grid.has(emptyPosition.key)) continue;
    grid.set(emptyPosition.key, emptyPosition);
  }
}

console.log("Solution:", Array.from(grid.values()).filter(position => position instanceof Empty && position.y === checkY).length);
