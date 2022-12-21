export const solution = "a";

const input = await Bun.file("src/day-19/input.txt").text();

type Blueprint = {
  id: number;
  oreRobotCost: {
    ore: number;
  };
  clayRobotCost: {
    ore: number;
  };
  obsidianRobotCost: {
    ore: number;
    clay: number;
  };
  geodeRobotCost: {
    ore: number;
    obsidian: number;
  };
}

const blueprints : Blueprint[] = [];

for (const line of input.split("\n")) {
  const [blueprintIdStr, costsStr] = line.split(": ");
  const blueprintId = parseInt(blueprintIdStr.replace("Blueprint", "").trim(), 10);
  
  const oreRobotCost = {
    ore: parseInt(costsStr.match(/Each ore robot costs (\d+) ore./)[1]),
  };

  const clayRobotCost = {
    ore: parseInt(costsStr.match(/Each clay robot costs (\d+) ore./)[1]),
  };

  const obsidianRobotCost = {
    ore: parseInt(costsStr.match(/Each obsidian robot costs (\d+) ore and (\d+) clay./)[1]),
    clay: parseInt(costsStr.match(/Each obsidian robot costs (\d+) ore and (\d+) clay./)[2]),
  };

  const geodeRobotCost = {
    ore: parseInt(costsStr.match(/Each geode robot costs (\d+) ore and (\d+) obsidian./)[1]),
    obsidian: parseInt(costsStr.match(/Each geode robot costs (\d+) ore and (\d+) obsidian./)[2]),
  };

  blueprints.push({
    id: blueprintId,
    oreRobotCost,
    clayRobotCost,
    obsidianRobotCost,
    geodeRobotCost,
  });
}

type Game = {
  timeRemaining: number;
  oreRobot: number;
  clayRobot: number;
  obsidianRobot: number;
  geodeRobot: number;
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
};

function mapGameToKey(game: Game): string {
  return `${game.timeRemaining},${game.oreRobot},${game.clayRobot},${game.obsidianRobot},${game.geodeRobot},${game.ore},${game.clay},${game.obsidian},${game.geode}`;
}

function calculateBestScore(blueprint: Blueprint, initialTimeRemaining: number) : number {
  let bestScore = 0;

  let seenGame : Set<string> = new Set();
  let queue = [{ timeRemaining: initialTimeRemaining, oreRobot: 1, clayRobot: 0, obsidianRobot: 0,  geodeRobot: 0, ore: 0, clay: 0, obsidian: 0,  geode: 0 }];

  while (queue.length > 0) {
    const game = queue.shift()!;

    if (game.geode > bestScore) {
      bestScore = game.geode;
    }

    if (game.timeRemaining === 0) {
      continue;
    }

    const maxOreCost = Math.max(blueprint.oreRobotCost.ore, blueprint.clayRobotCost.ore, blueprint.obsidianRobotCost.ore, blueprint.geodeRobotCost.ore);
		const oreRobot = Math.min(game.oreRobot, maxOreCost);
		const ore = Math.min(game.ore, (game.timeRemaining * maxOreCost) - (oreRobot * (game.timeRemaining - 1)))
		const clayRobot = Math.min(game.clayRobot, blueprint.obsidianRobotCost.clay)
		const clay = Math.min(game.clay, (game.timeRemaining * blueprint.obsidianRobotCost.clay) - (clayRobot * (game.timeRemaining - 1)))
		const geodeRobot = Math.min(game.geodeRobot, blueprint.geodeRobotCost.obsidian)
		const obsidian = Math.min(game.obsidian, (game.timeRemaining * blueprint.geodeRobotCost.obsidian) - (geodeRobot * (game.timeRemaining - 1)))

    const key = mapGameToKey({
      ...game,
      ore,
      oreRobot,
      clay,
      clayRobot,
      obsidian,
      geodeRobot,
    });

    if (seenGame.has(key)) {
      continue;
    }

    seenGame.add(key);

    const newTimeRemaining = game.timeRemaining - 1;
    const newGame = {
      ...game,
      timeRemaining: newTimeRemaining,
      ore: ore + oreRobot,
      oreRobot,
      clay: clay + clayRobot,
      clayRobot,
      obsidian: obsidian + game.obsidianRobot,
      geode: game.geode + geodeRobot,
      geodeRobot,
    };

    queue.push(newGame);

    if (ore >= blueprint.geodeRobotCost.ore && obsidian >= blueprint.geodeRobotCost.obsidian) { // is able to buy geode robot
      queue.push({
        ...newGame,
        ore: newGame.ore - blueprint.geodeRobotCost.ore,
        obsidian: newGame.obsidian - blueprint.geodeRobotCost.obsidian,
        geodeRobot: newGame.geodeRobot + 1,
      });
    } else if (game.ore >= blueprint.obsidianRobotCost.ore && game.clay >= blueprint.obsidianRobotCost.clay) { // is able to buy obsidian robot
      queue.push({
        ...newGame,
        ore: newGame.ore - blueprint.obsidianRobotCost.ore,
        clay: newGame.clay - blueprint.obsidianRobotCost.clay,
        obsidianRobot: newGame.obsidianRobot + 1,
      });
    } else {
      if (game.ore >= blueprint.clayRobotCost.ore) { // is able to buy clay robot
        queue.push({
          ...newGame,
          ore: newGame.ore - blueprint.clayRobotCost.ore,
          clayRobot: newGame.clayRobot + 1,
        });
      }
      if (game.ore >= blueprint.oreRobotCost.ore) { // is able to buy ore robot
        queue.push({
          ...newGame,
          ore: newGame.ore - blueprint.oreRobotCost.ore,
          oreRobot: newGame.oreRobot + 1,
        });
      }
    }
  }

  return bestScore;
}

let totalScore = 0;

for (const blueprint of blueprints) {
  const score = calculateBestScore(blueprint, 24);
  totalScore += score * blueprint.id;
}

console.log("Solution:", totalScore);