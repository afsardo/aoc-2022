export const solution = "b";

const input = await Bun.file("src/day-12/input.txt").text();

interface Comparable {
  compareTo(other: Comparable): number;
}

interface HasKey<T> {
  getKey(): T;
}

export class Node<T extends (Comparable & HasKey<U>), U> {
  value: T;
  adjacent: Node<T, U>[];

  constructor(value: T) {
    this.value = value;
    this.adjacent = [];
  }

  addAdjacent(node: Node<T, U>): void {
    this.adjacent.push(node);
  }

  removeAdjacent(value: T): Node<T, U> | null {
    const index = this.adjacent.findIndex(
      (node) => this.value.compareTo(node.value) === 0
    );

    if (index > -1) {
      return this.adjacent.splice(index, 1)[0];
    }

    return null;
  }
}

class Graph<T extends Comparable & HasKey<U>, U> {
  nodes: Map<U, Node<T, U>> = new Map();

  get length(): number {
    return this.nodes.size;
  }

  addNode(value: T): Node<T, U> {
    let node = this.nodes.get(value.getKey());

    if (node) return node;

    node = new Node(value);
    this.nodes.set(value.getKey(), node);

    return node;
  }

  removeNode(value: T): Node<T, U> | null {
    const nodeToRemove = this.nodes.get(value.getKey());

    if (!nodeToRemove) return null;

    this.nodes.forEach((node) => {
      node.removeAdjacent(nodeToRemove.value);
    });

    this.nodes.delete(value.getKey());

    return nodeToRemove;
  }


  addEdge(source: T, destination: T): void {
    const sourceNode = this.addNode(source);
    const destinationNode = this.addNode(destination);

    sourceNode.addAdjacent(destinationNode);
  }

  removeEdge(source: T, destination: T): void {
    const sourceNode = this.nodes.get(source.getKey());
    const destinationNode = this.nodes.get(destination.getKey());

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destination);
    }
  }
}

class Elevation {
  public score : number;
  
  constructor(public value: string) {
    this.score = Elevation.score(value);
  }

  static score(value: string): number {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    if (value === "S") {
      return alphabet.indexOf("a");
    }

    if (value === "E") {
      return alphabet.indexOf("z");
    }

    return alphabet.indexOf(value);
  }

  public compareTo(other: Elevation): number {
    return this.score - other.score;
  }
}

class Position implements Comparable, HasKey<string> {
  constructor(public x: number, public y: number, public elevation: Elevation) {}

  static isValid(x: number, y: number, matrix: Elevation[][]): boolean {
    return x >= 0 && x < matrix.length && y >= 0 && y < matrix[x].length;
  }

  static canMoveTo(from: Position, to: Position): boolean {
    return to.elevation.compareTo(from.elevation) >= -1;
  }

  public getPossibleAdjacentPositions(matrix: Elevation[][]): Position[] {
    let positions : Position[] = [];
  
    if (Position.isValid(this.x - 1, this.y, matrix)) {
      const left = new Position(this.x - 1, this.y, matrix[this.x - 1][this.y]);
      if (Position.canMoveTo(this, left)) {
        positions.push(left);
      }
    }

    if (Position.isValid(this.x + 1, this.y, matrix)) {
      const right = new Position(this.x + 1, this.y, matrix[this.x + 1][this.y]);
      if (Position.canMoveTo(this, right)) {
        positions.push(right);
      }
    }

    if (Position.isValid(this.x, this.y + 1, matrix)) {
      const down = new Position(this.x, this.y + 1, matrix[this.x][this.y + 1]);
      if (Position.canMoveTo(this, down)) {
        positions.push(down);
      }
    }

    if (Position.isValid(this.x, this.y - 1, matrix)) {
      const up = new Position(this.x, this.y - 1, matrix[this.x][this.y - 1]);
      if (Position.canMoveTo(this, up)) {
        positions.push(up);
      }
    }
  
    return positions;
  }

  public getKey(): string {
    return `(${this.x},${this.y})`;
  }

  public compareTo(other: Position): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }
}

const graph = new Graph<Position, string>();
const matrix: Elevation[][] = input.split("\n").map((line) => line.split("").map((elevation) => new Elevation(elevation)));

let startPosition : Position = null;
let possibleStartPositions : Position[] = [];
let endPosition : Position = null;

for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    const position = new Position(i, j, matrix[i][j]);
    graph.addNode(position);
    position.getPossibleAdjacentPositions(matrix).forEach((adjacentPosition) => {
      graph.addEdge(position, adjacentPosition);
    });

    if (matrix[i][j].value === "S") {
      startPosition = position;
    }

    if (matrix[i][j].value === "a") {
      possibleStartPositions.push(position);
    }

    if (matrix[i][j].value === "E") {
      endPosition = position;
    }
  }
}

function dijkstra<T extends (Comparable & HasKey<U>), U>(graph: Graph<T, U>, destination: T) {
  const distance: Map<U, number> = new Map<U, number>();

  for (const [key] of graph.nodes) {
    distance.set(key, Number.MAX_SAFE_INTEGER);
  }

  distance.set(destination.getKey(), 0);

  let pathsToVisit = [{ node: graph.nodes.get(destination.getKey()), cost: distance.get(destination.getKey()) }];
  while (pathsToVisit.length > 0) {
    const path = pathsToVisit.shift();
    if (!path) continue;

    for (const adjacent of path.node.adjacent) {
      const cost = path.cost + 1;
      if (!pathsToVisit.find((path) => path.node.value.getKey() === adjacent.value.getKey()) && cost < distance.get(adjacent.value.getKey())) {
        distance.set(adjacent.value.getKey(), cost);
        pathsToVisit.push({ node: adjacent, cost });
      }
    }
  }

  return distance;
}

const distances = dijkstra(graph, endPosition);

console.log("Solution:", [startPosition, ...possibleStartPositions].map((position) => distances.get(position.getKey())).sort((a, b) => a - b)[0]);