import { equal } from "assert";
import fs from "fs";

const input = fs.readFileSync("./12/input.txt").toString();

const map2D = input.split("\r\n").map((line) => line.split(""));

const directions = new Map([
	['up', [-1, 0]],
	['right', [0, 1]],
	['down', [1, 0]],
	['left', [0, -1]],
]);

type Position = {
	row: number;
	col: number;
}

class Region {
	area: number = 0;
	perimeter: number = 0;
	plants: Position[] = [];
	constructor(public type: string) {
		this.type = type;
	}

	getPrice(): number {
		return this.area * this.perimeter;
	}

	isInRegion(position: Position) {
		return this.plants.find((plant) => equalPos(plant, position));
	}

	explore(position: Position) {
		attributed.push(position);
		this.plants.push(position);
		this.area++;
		directions.forEach((direction) => {
			const [dx, dy] = direction;
			const newPos = {row: position.row + dx, col: position.col + dy};
			
			if(!map2D[newPos.row] || !map2D[newPos.row][newPos.col] || map2D[newPos.row][newPos.col] !== this.type) {
				this.perimeter++;
			} else if(!this.isInRegion(newPos)) {
				this.explore(newPos);
			}
		});
	}

	toString() {
		return `type:${this.type}, area:${this.area}, perimeter:${this.perimeter}`;
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

console.log(`totalCost: ${totalCost}`);
