import fs from "fs";

const input = fs.readFileSync("./16/input.txt").toString();

const map2D = input.split("\r\n").map((line) => line.split(""));

type Position = {
	row: number;
	col: number;
};

type QueueItem = {
	cost: number,
	pos: Position,
	dir: string
}

class Matrix {
	matrix : number[][];
	constructor(strMatric: string) {
		this.matrix = strMatric.split("\r\n").map((line) => line.split("").map(Number));
	}

}

const directions = new Map([
	['right', { row: 0, col: 1 }],
	['down', { row: 1, col: 0 }],
	['left', { row: 0, col: -1 }],
	['up', { row: -1, col: 0 }],
]);

let score = 0;
let invert = false;
let currDir = 'right';
let currPos: Position = { row: 0, col: 0 };

const canMove = (nextPos: Position): boolean => {
	return (map2D[nextPos.row][nextPos.col] !== '#');
}

const move = (pos: Position, dir: string): void => {
	const nextRow = pos.row + directions.get(dir).row;
	const nextCol = pos.col + directions.get(dir).col;
	const nextPos: Position = { row: nextRow, col: nextCol };
	if (canMove(nextPos)) {
		currPos = nextPos;
		invert = !invert;
		score++;
	} else {
		if(!invert) {
			rotateClockwise(dir);
		}
		else {
			rotateCounterClockwise(dir);
		}
		score += 1000;
		console.log(`Cannot move to ${nextPos.row}, ${nextPos.col}`);
		console.log(`Rotating to ${currDir}`);
	}
}

const hasArrived = (pos: Position): boolean => {
	return (map2D[pos.row][pos.col] === 'E');
}

/* @param dir - current direction
 * 
 * This function updates the global variable `currDir` to the next direction in clockwise order.
 */
const rotateClockwise = (dir: string): void => {
	const keys = Array.from(directions.keys());
	const index = keys.indexOf(dir);
	// the modulo operator is used to wrap around the array
	const nextIndex = (index + 1) % keys.length;
	currDir = keys[nextIndex];
}

/* @param dir - current direction
 * 
 * This function updates the global variable `currDir` to the next direction in counter-clockwise order.
 */
const rotateCounterClockwise = (dir: string): void => {
	const keys = Array.from(directions.keys());
	const index = keys.indexOf(dir);
	// the modulo operator is used to wrap around the array
	const nextIndex = (index - 1 + keys.length) % keys.length;
	currDir = keys[nextIndex];
}

const stateKey = (pos: Position, dir: string) => {
	return `${pos.row},${pos.col},${dir}`
}

const findLowestCost = (map2D) => {
	const rows = map2D.length;
	const cols = map2D[0].length;
	let startPos: Position = {row: -1, col:-1};
	let endPos: Position = {row: -1, col:-1};

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (map2D[row][col] === 'S') {
				startPos = { row, col };
			} else if (map2D[row][col] === 'E') {
				endPos = {row, col}
			}
		}
	}

	const heap: QueueItem[] = [
		{
			cost: 0,
			pos: startPos,
			dir: 'right'
		}
	];

	const visited = new Map<string, number>();

	while(heap.length > 0) {
		// Faire le déplacement
		heap.sort((a, b) => a.cost - b.cost);
		const currPos = heap.shift();
		const {cost, pos, dir} = currPos;

		// Si on est arrivé à la fin, on retourne le coût
		if(pos === endPos) return cost;

		const nextPos = {
			row: pos.row + directions.get(dir).row,
			col: pos.col + directions.get(dir).col
		};

		const key = stateKey(pos, dir);
		if(visited.has(key) && visited.get(key) <= cost) continue;
		visited.set(key, cost);
		
		if(canMove(nextPos)) {
			heap.push({cost: cost + 1, pos: nextPos, dir})
		}
	}
}

// Move until we reach the end
while (hasArrived) {
	move(currPos, currDir);
	console.log(`Current position: ${currPos.row}, ${currPos.col}, Direction: ${currDir}, Score: ${score}`);
}
