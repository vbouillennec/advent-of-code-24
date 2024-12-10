import fs from 'fs';

const input = fs.readFileSync('./10/input.txt').toString();

class Position {
	constructor(public row: number, public col: number, public value: number = -1) {
		this.row = row;
		this.col = col;
		this.value = value;
	}

	equals(pos: Position) {
		return this.row === pos.row && this.col === pos.col;
	}

	addPos = (pos: Position): Position => {
		return map.getPos(this.row + pos.row, this.col + pos.col);
	}

	isValidNextPos = (nextPos) => {
		return (this.value + 1) === nextPos.value;
	}

	toString() {
		return `[${this.row+1},${this.col+1}]=>${this.value}`;
	}
}

const directions = new Map([
	['up', new Position(-1, 0)],
	['right', new Position(0, 1)],
	['down', new Position(1, 0)],
	['left', new Position(0, -1)],
]);

class Map2D {
	positions: Position[] = [];
	trailheads: Position[] = [];
	trailsFound: number = 0;

	constructor(public input: string) {
		const lines = input.split("\r\n");
		lines.forEach((line, row) => {
			line.split('').forEach((value, col) => {
				const newPos = new Position(row, col, Number(value));
				this.positions.push(newPos);
				if(newPos.value === 0) {
					this.trailheads.push(newPos);
				}
			});
		});
	}

	getPos(row: number, col: number) {
		return this.positions.find((pos) => pos.row === row && pos.col === col);
	}

	printMap() {
		this.positions.forEach((pos) => {
			if(pos.col === 0) {
				process.stdout.write('\n');
			}
			process.stdout.write(`[${pos.value}]`);
		});
		process.stdout.write('\n');
	}

	findTrails(trailhead: Position, trailTails: Set<Position>) {
		if(trailhead.value === 9) {
			this.trailsFound++;
			// trailTails.add(trailhead);
		}
		let currentTrail = trailhead;
		directions.forEach((direction, key) => {
			const newPos = currentTrail.addPos(direction);
			if(newPos && currentTrail.isValidNextPos(newPos)) {
				this.findTrails(newPos, trailTails);
			}
		});
	}

	findAllTrails() {
		this.trailheads.forEach((trailhead) => {
			const trailTails = new Set<Position>();
			this.findTrails(trailhead, trailTails);
			// this.trailsFound += trailTails.size;
		});
	}
}

const map = new Map2D(input);

// map.printMap();
map.findAllTrails();

console.log(`found ${map.trailsFound} trails`);