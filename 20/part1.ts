/**
 * ✅ Advent of Code 2024 - Day 20 - Part 1
 * https://adventofcode.com/2024/day/20
 *
 * Solution by: Valentin Bouillennec
 */

import fs from "fs";

const input = fs.readFileSync("./20/input.txt").toString();

const map2D = input.split("\r\n").map((line) => line.split(""));

type Position = {
	row: number;
	col: number;
};

type QueueItem = {
	cost: number,
	pos: Position,
	dir: string,
    hasCheated: boolean
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

const isCheatingPossible = (pos: Position, dir: string, hasCheated: boolean): boolean => {
    return !hasCheated && canMove(calcNextPos(pos, dir));
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

const stateKey = (pos: Position, dir: string) => {
	return `${pos.row},${pos.col},${dir}`
}

const findLowestCost = (map2D) => {
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
			pos: startPos,
			dir: 'right',
            hasCheated: false
		}
	];

	const visited = new Map<string, number>();

	while (heap.length > 0) {
		// Faire le déplacement
		heap.sort((a, b) => a.cost - b.cost);
		const currPos = heap.shift();
		const { cost, pos, dir, hasCheated } = currPos;

		// Si on est arrivé à la fin, on retourne le coût
		if(hasArrived(pos)) {
			console.log(`Arrived at end position: ${pos.row}, ${pos.col} with cost: ${cost}`);
			return cost;
		}

		const key = stateKey(pos, dir);
		if (visited.has(key) && visited.get(key) <= cost) continue;
		visited.set(key, cost);

		const nextPos = calcNextPos(pos, dir);

		if (canMove(nextPos)) {
			heap.push({ cost: cost + 1, pos: nextPos, dir, hasCheated });
			// console.log(`pos: [${nextPos.row},${nextPos.col}] ${dir}`);
		} else if(isCheatingPossible(nextPos, dir, hasCheated)) {
            heap.push({ cost: cost + 1, pos: nextPos, dir, hasCheated: true });
        }

		heap.push({ cost: cost, pos, dir: rotateClockwise(dir), hasCheated });

		heap.push({ cost: cost, pos, dir: rotateClockwise(dir, true), hasCheated });
	}

	console.log(heap.length);

	console.log("No path found");
	return -1; // No path found
}

const lowestScore = findLowestCost(map2D);

console.log(`Lowest cost to reach the end: ${ lowestScore } picoseconds`);
