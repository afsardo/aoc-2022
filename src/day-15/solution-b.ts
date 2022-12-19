export const solution = "b";

const input = await Bun.file("src/day-15/input.txt").text();

class Position {
  constructor(public x: number, public y: number) {}

  get key() {
    return Position.key(this.x, this.y);
  }

  static key(x: number, y: number) {
    return `${x},${y}`;
  }

  distance(pos: Position): number {
    return Math.abs(this.x - pos.x) + Math.abs(this.y - pos.y);
  }
}

class Beacon extends Position {
  constructor(public x: number, public y: number) {
    super(x, y);
  }
}

class Sensor extends Position {
  public closestBeaconDistance: number;

  constructor(public x: number, public y: number, public closestBeacon: Beacon) {
    super(x, y);
    this.x = x;
    this.y = y;
    this.closestBeaconDistance = this.distance(closestBeacon);
  }
}

const sensors : Sensor[] = [];

for (const line of input.split("\n")) {
  const [sensorStr, beaconStr] = line.split(": ");
  const [x, y] = sensorStr.replace("Sensor at ", "").split(", ").map(str => Number(str.replace("x=", "").replace("y=", "")));
  const [closestX, closestY] = beaconStr.replace("closest beacon is at ", "").split(", ").map(str => Number(str.replace("x=", "").replace("y=", "")));
  const beacon = new Beacon(closestX, closestY);
  const sensor = new Sensor(x, y, beacon);
  sensors.push(sensor);
}

const min = 0;
const max = 4_000_000;

let foundPosition : Position | null = null;

for (const sensor of sensors) {
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  for (let dx = 0; dx <= sensor.closestBeaconDistance + 1; dx++) {
    const dy = (sensor.closestBeaconDistance + 1) - dx;

    for (const [xDir, yDir] of directions) {
      const x = sensor.x + (dx * xDir);
      const y = sensor.y + (dy * yDir);

      if (x < min || x > max || y < min || y > max) {
        continue;
      }

      const position = new Position(x, y);
      if (sensors.every(sensor => sensor.distance(position) > sensor.closestBeaconDistance)) {
        foundPosition = position;
        break;
      }
    }

    if (foundPosition) {
      break;
    }
  }

  if (foundPosition) {
    break;
  }
}

console.log("Solution:", foundPosition.x * 4_000_000 + foundPosition.y);