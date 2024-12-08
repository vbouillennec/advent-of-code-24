import fs from 'fs';

const input = fs.readFileSync('./08/input.txt').toString();

class Position {
	constructor(public row: number, public col: number, public value: string) {
		this.row = row;
		this.col = col;
		this.value = value;
	}

	compareTo(pos: Position) {
		return this.row === pos.row && this.col === pos.col;
	}
}

class Vector {
	constructor(public row: number, public col: number) {
		this.row = row;
		this.col = col;
	}
}


class Map {
	positions: Position[] = [];
	antennas: Position[] = [];
	antinodes: Position[] = [];
	constructor(public input: string) {
		const lines = input.split("\r\n");
		lines.forEach((line, row) => {
			line.split('').forEach((value, col) => {
				const newPos = new Position(row, col, value);
				this.positions.push(newPos);
				if(value !== '.') {
					this.antennas.push(newPos);
				}
			});
		});
	}

	getPos(row: number, col: number) {
		return this.positions.find((pos) => pos.row === row && pos.col === col);
	}

	printMap() {
		for (let i = 0; i < this.positions.length; i++) {
			if(this.positions[i].col === 0) {
				process.stdout.write('\n');
			}
			process.stdout.write(`[${this.positions[i].value}]`);
		}
		process.stdout.write('\n');
	}

	isSameFrequencyAntenna(antenna1, antenna2) {
		return (!antenna1.compareTo(antenna2)) && antenna1.value === antenna2.value;
	}

	getVector(pos1: Position, pos2: Position) {
		return new Vector((pos2.row - pos1.row), (pos2.col - pos1.col));
	}

	setAntinode(antenna: Position, vector: Vector) {
		const antinodePos = this.getPos(antenna.row + vector.row, antenna.col + vector.col);
		if(!antinodePos) return;
		if(this.notInAntinodes(antinodePos)) { 
			this.antinodes.push(antinodePos);
		}
		if(antinodePos.value === '.') {
			antinodePos.value = '#';
		}
	}

	notInAntinodes(pos: Position) {
		return !this.antinodes.find((antinode) => antinode.compareTo(pos));
	}

	generateAntinodes() {
		this.antennas.forEach((antenna1) => {
			this.antennas.forEach((antenna2) => {
				if(this.isSameFrequencyAntenna(antenna1, antenna2)) {
					const vectorBetweenAntennas = this.getVector(antenna1, antenna2);
					this.setAntinode(antenna2, vectorBetweenAntennas);
				}
			});
		});
	}
}

const map = new Map(input);

map.printMap();
map.generateAntinodes();
console.log('\n------------------------------------');
map.printMap();

console.log({nbOfAntinodes: map.antinodes.length});