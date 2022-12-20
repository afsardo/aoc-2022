export const solution = "a";

const input = await Bun.file("src/day-16/input.txt").text();

type Valve = {
  id: string;
  tunnels: string[];
  flowRate: number;
}

const valves : Map<string, Valve> = new Map();

for (const line of input.split("\n")) {
  const [valveStr, tunnelsStr] = line.split("; ");
  const [valveIdStr, flowRateStr] = valveStr.split(" has ").map(str => str.trim());
  const valveId = valveIdStr.replace("Valve ", "");
  const flowRate = Number(flowRateStr.replace("flow rate=", ""));
  const tunnels = tunnelsStr.replace("tunnels lead to valves", "").replace("tunnel leads to valve", "").split(", ").map(str => str.trim());
  valves.set(valveId, { id: valveId, tunnels, flowRate });
}

const distanceCache = new Map<string, number>();

function distanceBetween(valve1: Valve, valve2: Valve): number {
  const cachedDistance = distanceCache.get(`${valve1.id}-${valve2.id}`) || distanceCache.get(`${valve2.id}-${valve1.id}`);
  if (!!cachedDistance) {
    return cachedDistance;
  }

  const visited = new Set<string>();
  const queue = [{ valve: valve1, distance: 0 }];
  while (queue.length > 0) {
    const { valve, distance } = queue.shift()!;
    if (valve.id === valve2.id) {
      distanceCache.set(`${valve1.id}-${valve2.id}`, distance);
      distanceCache.set(`${valve2.id}-${valve1.id}`, distance);
      return distance;
    }
    if (visited.has(valve.id)) {
      continue;
    }
    visited.add(valve.id);
    for (const tunnel of valve.tunnels) {
      const nextValve = valves.get(tunnel)!;
      queue.push({ valve: nextValve, distance: distance + 1 });
    }
  }
  return -1;
}

function bestNextValve(currentValve: Valve, currentTime: number, possibleValves: Valve[]) : { valve: Valve, totalPressure: number } {
  let bestValve : Valve | null = null;
  let totalPressure = 0;

  for (const valve of possibleValves) {
    const newPossibleVales = [...possibleValves].filter(v => v.id !== valve.id);
    const newTime = currentTime - distanceBetween(currentValve, valve) - 1;
    if (newTime <= 0) {
      continue;
    }

    const newTotalPressure = (newTime * valve.flowRate) + bestNextValve(valve, newTime, newPossibleVales).totalPressure;
    if (newTotalPressure > totalPressure) {
      totalPressure = newTotalPressure;
      bestValve = valve;
    }
  }

  return { valve: bestValve, totalPressure };
}

const highestTunnels = Array.from(valves.values()).filter(valve => valve.flowRate > 0);
console.log("Solution:", bestNextValve(valves.get("AA"), 30, highestTunnels).totalPressure);