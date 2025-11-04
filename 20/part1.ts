/**
 * ✅ Advent of Code 2024 - Day 20 - Part 1
 * https://adventofcode.com/2024/day/20
 *
 * Solution by: Valentin Bouillennec
 */

import fs from "fs";

const input = fs.readFileSync("./20/input2.txt").toString();

const map2D = input.split("\r\n").map((line) => line.split(""));

type Position = {
	row: number;
	col: number;
};

type QueueItem = {
	cost: number,
	pico: number,
	pos: Position,
	dir: string,
    cheatPos: string,
}

type PossibleCheat = {
	picoSaved: number,
	cheatPos: string,
}

const directions = new Map([
	['right', { row: 0, col: 1 }],
	['down', { row: 1, col: 0 }],
	['left', { row: 0, col: -1 }],
	['up', { row: -1, col: 0 }],
]);

const canMove = (nextPos: Position): boolean => {
	return (
        nextPos.row >= 0 &&
        nextPos.row < map2D.length &&
        nextPos.col >= 0 &&
        nextPos.col < map2D[0].length &&
        map2D[nextPos.row][nextPos.col] !== '#'
    );
}

const hasArrived = (pos: Position): boolean => {
	return (map2D[pos.row][pos.col] === 'E');
}

const isCheatingPossible = (pos: Position, dir: string, cheatPos: string): boolean => {
	// if(cheatPos === '-1,-1') console.log(`Checking cheating possibility at pos: [${pos.row},${pos.col}] ${dir} | cheatPos: ${cheatPos}`);
    return (cheatPos === '-1,-1') && canMove(calcNextPos(pos, dir));
}

const calcNextPos = (pos: Position, dir: string) => {
    return {
        row: pos.row + directions.get(dir).row,
        col: pos.col + directions.get(dir).col
    };
}

/* @param dir - current direction
 * 
 * This function updates the global variable `currDir` to the next direction in clockwise order.
 */
const rotateClockwise = (dir: string, counter: boolean = false): string => {
	const keys = Array.from(directions.keys());
	const index = keys.indexOf(dir);
	// the modulo operator is used to wrap around the array
	let nextIndex = (index + 1) % keys.length;
	if (counter) {
		nextIndex = (index - 1 + keys.length) % keys.length;
	}
	return keys[nextIndex];
}

const stateKey = (pos: Position, dir: string, cheatPos: string) => {
	return `${pos.row},${pos.col},${dir},${cheatPos}`;
}

const findLowestCost = (map2D, cheatIsActivated: boolean = false): number|PossibleCheat => {
	const rows = map2D.length;
	const cols = map2D[0].length;
	let startPos: Position = { row: -1, col: -1 };

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (map2D[row][col] === 'S') {
				startPos = { row, col };
			}
		}
	}

	const heap: QueueItem[] = [
		{
			cost: 0,
			pico: 0,
			pos: startPos,
			dir: 'up',
            cheatPos: '-1,-1',
		}
	];

	const visited = new Map<string, number>();

	while (heap.length > 0) {
		// Faire le déplacement
		heap.sort((a, b) => a.cost - b.cost);
		const currPos = heap.shift();
		const { cost, pico, pos, dir, cheatPos } = currPos;

		// Si on est arrivé à la fin, on retourne le coût
		if(hasArrived(pos)) {
			// console.warn(`Arrived at end position: ${pos.row}, ${pos.col} with cost: ${cost}`);
			if(cheatIsActivated) {
				if(!possibleCheats.has(cheatPos)) {
					const picoSaved = (fastestPicoWithoutCheat as number) - pico;
					return { picoSaved: picoSaved, cheatPos: cheatPos} as PossibleCheat;
				}
			} else {
				return pico;
			}
		}

		const key = stateKey(pos, dir, cheatPos);
		if (visited.has(key) && visited.get(key) <= cost) continue;
		visited.set(key, cost);

		const nextPos = calcNextPos(pos, dir);

		if (canMove(nextPos)) {
			heap.push({ cost: cost + 1, pico: pico + 1, pos: nextPos, dir, cheatPos: cheatPos });
			// console.log(`pos: [${nextPos.row},${nextPos.col}] ${dir}`);
		}
		else if(cheatIsActivated && isCheatingPossible(nextPos, dir, cheatPos)) {
			// console.error(`Cheating from pos: [${pos.row},${pos.col}] ${dir}`);
            heap.push({ cost: cost + 2,  pico: pico + 2, pos: calcNextPos(nextPos, dir), dir, cheatPos: `${nextPos.row},${nextPos.col}` });
        }

		heap.push({ cost: cost + 1000, pico , pos, dir: rotateClockwise(dir), cheatPos: cheatPos });

		heap.push({ cost: cost + 1000, pico, pos, dir: rotateClockwise(dir, true), cheatPos: cheatPos });
	}

	console.log(heap.length);

	console.log("No path found");
	return -1; // No path found
}

const possibleCheats = new Map<string, number>();

const fastestPicoWithoutCheat = findLowestCost(map2D);

while(fastestPicoWithoutCheat) {
	const cheatPossibility = findLowestCost(map2D, true);
	if(cheatPossibility === -1 || typeof cheatPossibility === 'number') break;
	possibleCheats.set(cheatPossibility.cheatPos, cheatPossibility.picoSaved);
	console.log(`Possible cheat at ${cheatPossibility.cheatPos} saving ${cheatPossibility.picoSaved} picoseconds`);
}

// const results = new Map<number, number>();
// possibleCheats.forEach((picoSaved, cheatPos) => {
// 	results.set(picoSaved, (results.get(picoSaved) || 0) + 1);
// });

// console.log("Possible cheats and their savings:\n", new Map([...results.entries()].sort((a, b) => b[0] - a[0])));
console.log(`Lowest cost to reach the end: ${ possibleCheats } picoseconds`);
