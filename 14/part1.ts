import fs from "fs";

let inputTextName = "input";
const args = process.argv.slice(2);
if (args.length > 0) {
	inputTextName = args[0];
}

type Position = {
	x: number;
	y: number;
};

class Robot {
	constructor(public position: Position, public velocity: Position) { }
}

class Map {
	constructor(public robots: Robot[], public height: number, public width: number) { }

	print() {
		const map = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => '.'));

		for (const robot of this.robots) {
			const value = map[robot.position.y][robot.position.x];
			if(value !== '.') {
				map[robot.position.y][robot.position.x] = (Number(value) + 1).toString();
			} else {
				map[robot.position.y][robot.position.x] = '1';
			}
		}

		console.log(map.map(line => line.join('')).join('\n'));
		console.log('\n');
		
	}

	executeRobots(nbOfExecutions: number) {
		for (let i = 0; i < nbOfExecutions; i++) {
			for (const robot of this.robots) {
				let newPosY = robot.position.y + robot.velocity.y;
				let newPosX = robot.position.x + robot.velocity.x;
				if(newPosY < 0) {
					newPosY = this.height + newPosY;
				}
				else if(newPosY >= this.height) {
					newPosY = newPosY - this.height;
				}
				if(newPosX < 0) {
					newPosX = this.width + newPosX;
				}
				if(newPosX >= this.width) {
					newPosX = newPosX - this.width;
				}
				robot.position.x = newPosX;
				robot.position.y = newPosY;
			}
		}
		
	}

	getQuadrants() {
		let [nbQuad1, nbQuad2, nbQuad3, nbQuad4] = [0, 0 ,0, 0];
		for (const robot of this.robots) {
			if(robot.position.y < Math.floor(this.height / 2) && robot.position.x < Math.floor(this.width / 2)) {
				nbQuad1++;
			}
			if(robot.position.y < Math.floor(this.height / 2) && robot.position.x > Math.floor(this.width / 2)) {
				nbQuad2++;
			}
			if(robot.position.y > Math.floor(this.height / 2) && robot.position.x < Math.floor(this.width / 2)) {
				nbQuad3++;
			}
			if(robot.position.y > Math.floor(this.height / 2) && robot.position.x > Math.floor(this.width / 2)) {
				nbQuad4++;
			}
		}
		return [nbQuad1, nbQuad2, nbQuad3, nbQuad4];
	}
}

const input = fs.readFileSync(`14/${inputTextName}.txt`).toString();

const robots = input.split('\r\n').map((line: string) => {
	const [xPos, yPos, xVel, yVel]= line.match(/(-?\d+)/g);

	return new Robot(
		{ x: parseInt(xPos), y: parseInt(yPos) },
		{ x: parseInt(xVel), y: parseInt(yVel) }
	);
});

// console.log(robots);
const map = new Map(robots, 103, 101);
// map.print();
map.executeRobots(100)
// map.print();
console.log({safetyFactor: map.getQuadrants().reduce((acc, val) => acc * val, 1)});