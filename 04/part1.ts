import fs from "fs";

const input = fs.readFileSync("./04/input.txt").toString();

class Position {
	constructor(public row: number, public col: number) {
		this.row = row;
		this.col = col;
	}

	getLetter() {
		return map2D[this.row][this.col];
	}
	
	toString() {
		return `[${this.row},${this.col}]=>${this.getLetter()}`;
	}
}

const map2D = input.split("\n").map((row, i) => row.trim().split(""));

const wordToFind = "XMAS".split("");

let nbOfWordsFound = 0;

const directions = [
	new Position(-1, -1),
	new Position(-1, 0),
	new Position(-1, 1),
	new Position(0, -1),
	new Position(0, 1),
	new Position(1, -1),
	new Position(1, 0),
	new Position(1, 1),
];


const findNextLetterAround = (startingPos: Position, nextLetter: string) => {
	for(let i = 0; i < directions.length; i++) {
		const newPosition = new Position(startingPos.row + directions[i].row, startingPos.col + directions[i].col);
		if(newPosition.row < 0 || newPosition.row >= map2D.length || newPosition.col < 0 || newPosition.col >= map2D[newPosition.row].length) {
			continue;
		}
		if(newPosition.getLetter() === nextLetter) {
			const wordIsFound = findWordInDirection(newPosition, directions[i]);
			if(wordIsFound) {
				nbOfWordsFound++;
			}
		}
	}
}

const findWordInDirection = (startingPos: Position, direction: Position) => {
	let newPosition = new Position(startingPos.row + direction.row, startingPos.col + direction.col);
	let letterIndex = 2;
	while(!(newPosition.row < 0 || newPosition.row >= map2D.length || newPosition.col < 0 || newPosition.col >= map2D[newPosition.row].length)) {
		if(newPosition.getLetter() === wordToFind.at(letterIndex)) {			
			letterIndex++;
			if(letterIndex === wordToFind.length) {
				return true;
			}
			newPosition = new Position(newPosition.row + direction.row, newPosition.col + direction.col);
		} else {
			return false;
		}
	}
}

let letterToFindIndex = 0;
let letterToFind = wordToFind.at(letterToFindIndex);
for(let row = 0; row < map2D.length; row++) {
	for(let col = 0; col < map2D[row].length; col++) {
		if(map2D[row][col] === letterToFind) {
			findNextLetterAround(new Position(row, col), wordToFind.at(letterToFindIndex + 1) as string);
		}
	}
}

console.log({nbOfWordsFound});
