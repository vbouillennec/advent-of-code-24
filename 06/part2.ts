import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const map2D = input.split("\r\n").map((row) => row.split(''));

class Position {
	constructor(public row: number, public col: number) {
		this.row = row;
		this.col = col;
	}

	compareTo(pos: Position) {
		return this.row === pos.row && this.col === pos.col;
	}
	
	toString() {
		return `[${this.row},${this.col}]`;
	}
}

const directions = new Map([
	['up', new Position(-1, 0)],
	['right', new Position(0, 1)],
	['down', new Position(1, 0)],
	['left', new Position(0, -1)],
]);

class Guard {
	path: {position: Position, direction: Position}[];
	donePatrolling: boolean = false;
	looping: boolean = false;
	constructor(
		public patrollingMap: string[][] = map2D,
		public position: Position = new Position(0, 0), 
		public direction: Position = <Position>directions.get('up')
	) {
		this.position = position;
		this.direction = direction ;
		this.path = [];
		this.looping = false;
	}

	init() {
		for(let i = 0; i < this.patrollingMap.length; i++) {
			for(let j = 0; j < this.patrollingMap[i].length; j++) {
				if(isGuard(this.patrollingMap[i][j])) {
					if (this.position) this.position.row = i;
					this.position = new Position(i, j);
					this.direction = getDirection(this.patrollingMap[i][j]);
				}
			}
		}
	}

	isObstacle(row: number, col: number) {
		return this.patrollingMap[row][col] === '#';
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
		if(this.isLooping()) {
			this.donePatrolling = true;
			this.looping = true;
		}
		if(!this.alreadyVisited(this.position)){
			this.addToPath();
		}
	}

	isDonePatrolling(row: number, col: number) {
		return (
			row < 0 ||
			row >= this.patrollingMap.length ||
			col < 0 ||
			col >= this.patrollingMap[row].length
		);
	}

	isLooping() {
		return this.path.find((pos) => 
			this.position.compareTo(pos.position) &&
			this.direction.compareTo(pos.direction)
		);
	}

	alreadyVisited(position: Position) {
		return this.path.find((pos) => pos.position.compareTo(position));
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
		this.path.push({position: this.position, direction: this.direction});
	}

	buildInitialPath() {
		this.addToPath();
		while(this.donePatrolling === false) {
			this.move();
		}
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

const checkLoop = (pos: Position) => {
	const newMap2D = map2D.map((row) => row.slice());
	newMap2D[pos.row][pos.col] = '#';
	const newGuard = new Guard(newMap2D);
	newGuard.init();
	newGuard.buildInitialPath();
	return newGuard.looping;
}

let guard  = new Guard();
guard.init();
guard.buildInitialPath();

let nbOfObstructions = 0;
for(let i = 1; i < guard.path.length; i++) {
	if(checkLoop(guard.path[i].position)) {
		nbOfObstructions++;
	}
}

console.log(`There are ${nbOfObstructions} possible obstruction positions to loop the guard`);

