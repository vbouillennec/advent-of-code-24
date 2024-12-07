import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const map2D = input.split("\r\n").map((row) => row.split(''));

class Position {
	constructor(public row: number, public col: number) {
		this.row = row;
		this.col = col;
	}
	
	toString() {
		return `[${this.row},${this.col}]}`;
	}
}

const directions = new Map([
	['up', new Position(-1, 0)],
	['right', new Position(0, 1)],
	['down', new Position(1, 0)],
	['left', new Position(0, -1)],
]);

class Guard {
	path: Position[];
	donePatrolling: boolean = false;
	constructor(public position: Position, public direction: Position) {
		this.position = position;
		this.direction = direction;
		this.path = [];
	}

	isObstacle(row: number, col: number) {
		return map2D[row][col] === '#';
	}

	move() {
		let nextRow = this.position.row + this.direction.row;
		let nextCol = this.position.col + this.direction.col;
		if(this.isDonePatrolling(nextRow, nextCol)) {
			this.donePatrolling = true;
			return;
		}
		while(this.isObstacle(nextRow, nextCol)) {
			this.turnRight();
			nextRow = this.position.row + this.direction.row;
			nextCol = this.position.col + this.direction.col
		}
		this.position = new Position(nextRow, nextCol);
		if(!this.alreadyVisited(this.position)){
			this.addToPath();
		}
	}

	isDonePatrolling(row: number, col: number) {
		return (
			row < 0 ||
			row >= map2D.length ||
			col < 0 ||
			col >= map2D[row].length
		);
	}

	alreadyVisited(position: Position) {
		return this.path.find((pos) => pos.row === position.row && pos.col === position.col);
	}

	turnRight() {
		// going right
		if(this.direction.row === -1 && this.direction.col === 0) {
			this.direction = new Position(0, 1);
		}
		// going down
		else if(this.direction.row === 0 && this.direction.col === 1) {
			this.direction = new Position(1, 0);
		}
		// going left
		else if(this.direction.row === 1 || this.direction.col === 0) {
			this.direction = new Position(0, -1);
		}
		// going up
		else if(this.direction.row === 0 && this.direction.col === -1) {
			this.direction = new Position(-1, 0);
		}
	}

	addToPath() {
		this.path.push(this.position);
	}
}

const isGuard = (char: string): boolean => {
	return (char === '>' || char === '<' || char === 'v' || char === '^');
}

const getDirection = (char: string): Position => {
	switch(char) {
		case '>':
			return directions.get('right') as Position;
		case '<':
			return directions.get('left') as Position;
		case 'v':
			return directions.get('down') as Position;
		case '^':
			return directions.get('up') as Position;
		default: 
			return directions.get('up') as Position
	}
};

const getGuardInitialPosAndDirection = (map2D: string[][]): Guard => {
	for(let i = 0; i < map2D.length; i++) {
		for(let j = 0; j < map2D[i].length; j++) {
			if(isGuard(map2D[i][j])) {
				return new Guard(new Position(i, j), getDirection(map2D[i][j]));
			}
		}
	}
	return new Guard(new Position(0, 0), <Position>directions.get('down'))
}

// console.log(map2D);

let guard  = getGuardInitialPosAndDirection(map2D);

guard.addToPath();
while(guard.donePatrolling === false) {
	guard.move();
	
}

console.log(`The guard has visits ${guard.path.length} distinct positions`);

