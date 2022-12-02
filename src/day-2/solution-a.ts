export const solution = "a";

const input = await Bun.file("src/day-2/input.txt").text();

enum Shape {
  Rock,
  Paper,
  Scissors,
}

enum GameOutcome {
  Win,
  Draw,
  Lose,
}

const mapToShape = (char: string): Shape => {
  switch (char) {
    case "A":
      return Shape.Rock;
    case "B":
      return Shape.Paper;
    case "C":
      return Shape.Scissors;
    case "X":
      return Shape.Rock;
    case "Y":
      return Shape.Paper;
    case "Z":
      return Shape.Scissors;
    default:
      throw new Error(`Unknown shape: ${char}`);
  }
}

const player1GameOutcome = (player1: Shape, player2: Shape): GameOutcome => {
  switch (player1) {
    case Shape.Rock:
      if (player2 === Shape.Rock) {
        return GameOutcome.Draw;
      } else if (player2 === Shape.Paper) {
        return GameOutcome.Lose;
      } else if (player2 === Shape.Scissors) {
        return GameOutcome.Win;
      }
    case Shape.Paper:
      if (player2 === Shape.Rock) {
        return GameOutcome.Win;
      } else if (player2 === Shape.Paper) {
        return GameOutcome.Draw;
      } else if (player2 === Shape.Scissors) {
        return GameOutcome.Lose;
      }
    case Shape.Scissors:
      if (player2 === Shape.Rock) {
        return GameOutcome.Lose;
      } else if (player2 === Shape.Paper) {
        return GameOutcome.Win;
      } else if (player2 === Shape.Scissors) {
        return GameOutcome.Draw;
      }
  }
}

const mapGameOutcomeToScore = (outcome: GameOutcome): number => {
  switch (outcome) {
    case GameOutcome.Win:
      return 6;
    case GameOutcome.Draw:
      return 3;
    case GameOutcome.Lose:
      return 0;
  }
}

const mapShapeToScore = (shape: Shape): number => {
  switch (shape) {
    case Shape.Rock:
      return 1;
    case Shape.Paper:
      return 2;
    case Shape.Scissors:
      return 3;
  }
}

let player1Score = 0;

for (const line of input.split("\n")) {
  const [elfPlay, playerPlay] = line.split(" ");

  const elfShape = mapToShape(elfPlay);
  const playerShape = mapToShape(playerPlay);

  const outcome = player1GameOutcome(playerShape, elfShape);

  player1Score += mapShapeToScore(playerShape);
  player1Score += mapGameOutcomeToScore(outcome);
}

console.log("Solution:", player1Score);