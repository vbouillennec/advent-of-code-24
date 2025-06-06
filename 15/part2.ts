import fs from "fs";

let inputTextName = "input";
const args = process.argv.slice(2);
if (args.length > 0) {
	inputTextName = args[0];
}

const input = fs.readFileSync(`15/${inputTextName}.txt`).toString();

type Position = {
	x: number;
	y: number;
};

class Robot {
	constructor(public position: Position, public movements: string[]) { }
}

class Warehouse {
	map2D: string[][];
	robot = new Robot({ x: 0, y: 0 }, []);
	constructor(public input: string) {
		const [initialState, movements] = input.split('\r\n\r\n');
		this.map2D = initialState.split('\r\n')
		.map(line => line.split('')
			.map(cell => {
				if(cell === 'O') {
					return '[]';
				}
				else if(cell === '#') {
					return '##';
				}
				else if (cell === '.') {
					return '..';
				}
				else if (cell === '@') {
					return '@.';
				}
				return cell;
			})
		);

		const robotMovements = movements.trim().replace('\r\n', '').split('');

		this.findRobot();
		this.robot.movements = robotMovements;
	}

	findRobot() {
		for (let x = 0; x < this.map2D.length; x++) {
			for (let y = 0; y < this.map2D[x].length; y++) {
				if (this.map2D[x][y] === '@') {
					this.robot.position = { x, y };
				}
			}
		}
	}

	print() {
		const map = this.map2D.map(line => line.join('')).join('\n');
		console.log(map);
		console.log('\n');
	}

	getNextPos(position: Position, movement: string) {
		let { x: newPosX, y: newPosY } = position;
		switch (movement) {
			case '^': // Move up
				newPosX += - 1;
				break;
			case '>': // Move right
				newPosY += 1;
				break;
			case 'v': // Move down
				newPosX += 1;
				break;
			case '<': // Move left
				newPosY += - 1;
				break;
		}
		return { x: newPosX, y: newPosY };
	}

	moveObject(object: string, position: Position, movement: string): boolean {
		let {x, y} = this.getNextPos(position, movement);
		if(this.map2D[x][y] === '#') {
			return false;
		}
		else if(
			(this.map2D[x][y] === 'O' && 
			this.moveObject('O', {x: x, y: y}, movement)) ||
			this.map2D[x][y] === '.'
		){
			this.map2D[position.x][position.y] = '.';
			this.map2D[x][y] = object;
			if(object === '@') {
				this.robot.position = {x, y};
			}
			return true;
			
		}
	}

	moveRobot() {
		const movement = this.robot.movements.shift();
		const rPos = this.robot.position;
		this.moveObject('@', rPos, movement);
	}

	calculateGPSCoord() {
		let result = 0;
		for (let x = 0; x < this.map2D.length; x++) {
			for (let y = 0; y < this.map2D[x].length; y++) {
				if (this.map2D[x][y] === 'O') {
					result += 100 * x + y;
				}
			}
		}
		return result;
	}
}

const warehouse = new Warehouse(input);

warehouse.print();

// while(warehouse.robot.movements.length > 0) {
// 	warehouse.moveRobot();
// }

// console.log(warehouse.calculateGPSCoord());
