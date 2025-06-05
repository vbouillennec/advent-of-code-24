import fs from "fs";

let inputTextName = "input";
const args = process.argv.slice(2);
if (args.length > 0) {
	inputTextName = args[0];
}

const input = fs.readFileSync(`./12/${inputTextName}.txt`).toString();


const map2D = input.split("\r\n").map((line) => line.split(""));

const directions = new Map([
	['right', [0, 1]],
	['down', [1, 0]],
	['left', [0, -1]],
	['up', [-1, 0]],
]);

const diagDirections = new Map([
	['right-up', [-1, 1]],
	['right-down', [1, 1]],
	['left-down', [1, -1]],
	['left-up', [-1, -1]],
]);

type Position = {
	row: number;
	col: number;
}

class Region {
	area: number = 0;
	plants: Position[] = [];
	nbRightAngle: number = 0;
	nbReflexAngle: number = 0;
	constructor(public type: string) {
		this.type = type;
	}

	getPrice(): number {
		return this.area * this.getSides();
	}

	isInRegion(position: Position) {
		return this.plants.find((plant) => equalPos(plant, position));
	}

	getAngles(position: Position) {
		diagDirections.forEach((direction, dirName) => {
			const [dx, dy] = direction;
			const newPos = {row: position.row + dx, col: position.col + dy};
			if(
				map2D?.[newPos.row]?.[newPos.col] !== this.type &&
				map2D?.[position.row]?.[newPos.col] === this.type &&
				map2D?.[newPos.row]?.[position.col] === this.type
			) {
				this.nbReflexAngle++;
			}
			if(
				map2D?.[position.row]?.[newPos.col] !== this.type &&
				map2D?.[newPos.row]?.[position.col] !== this.type
			) {
				this.nbRightAngle++;
			}
		});
	}

	getSides() {
		return this.nbRightAngle + this.nbReflexAngle;
	}

	explore(position: Position) {
		attributed.push(position);
		this.plants.push(position);
		this.area++;
		this.getAngles(position);
		directions.forEach((direction) => {
			const [dx, dy] = direction;
			const newPos = {row: position.row + dx, col: position.col + dy};
			if(map2D?.[newPos.row]?.[newPos.col] === this.type && !this.isInRegion(newPos)) {
				this.explore(newPos);
			}
		});
	}

	toString() {
		return `\ntype:${this.type}, area:${this.area}, sides:${this.getSides()} => right:${this.nbRightAngle}, reflex:${this.nbReflexAngle}`;
	}
}

const equalPos = (pos1: Position, pos2: Position) => {
	return pos1.row === pos2.row && pos1.col === pos2.col;
}

const isAttributed = (position: Position) => {
	return attributed.find((pos) => equalPos(pos, position));
}

const regions: Region[] = [];
const attributed: Position[] = [];
map2D.forEach((line, i) => {
	line.forEach((cell, j) => {
		const plantPos = {row: i, col: j};
		if(isAttributed(plantPos)) {
			return;
		}
		const region = new Region(cell);
		region.explore(plantPos);
		regions.push(region);
	});
});

const totalCost = regions.reduce((acc, region) => {
	return acc + region.getPrice();
}, 0);

console.log({totalCost});
