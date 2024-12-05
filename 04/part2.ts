import fs from "fs";

const input = fs.readFileSync("./04/input2.txt").toString();

const map2D = input.split("\n").map((row) => row.trim().split(""));

const wordToFind = "MAS".split("");

class Position {
	constructor(public row: number, public col: number) {
		this.row = row;
		this.col = col;
	}
}

const directions = [
	new Position(-1, -1),
	new Position(-1, 1),
	new Position(1, -1),
	new Position(1, 1),
];

let nbOfWordsFound = 0;

const wordsCenters: Position[] = [];

const getOppositeDirection = (startingPos: Position, direction: Position) => {
	const oppositeDirection = {
		row: startingPos.row - direction.row,
		col: startingPos.col - direction.col,
	};
	return oppositeDirection;
}

const findLetterBeforeAndAfter = (centralPos: Position, letterIndex: number) => {
	for(let i = 0; i < directions.length; i++) {
		const newRow = centralPos.row + directions[i].row;
		const newCol = centralPos.col + directions[i].col;
		if(newRow < 0 || newRow >= map2D.length || newCol < 0 || newCol >= map2D[newRow].length) {
			continue;
		}
		if(map2D[newRow][newCol] === wordToFind.at(letterIndex - 1)) {
			const oppositeDirection = getOppositeDirection(centralPos, directions[i]);
			const oppositeRow = oppositeDirection.row;
			const oppositeCol = oppositeDirection.col;
			if(!(oppositeRow >= 0 && oppositeRow < map2D.length && oppositeCol >= 0 && oppositeCol < map2D[oppositeRow].length)){
				continue;
			}
			if(map2D[oppositeRow][oppositeCol] === wordToFind.at(letterIndex + 1)) {
				nbOfWordsFound++;
				wordsCenters.push(centralPos);
			}
		}
	}
}

// We looking for A the central letter of the word MAS
let letterToFindIndex = 1;
let letterToFind = wordToFind.at(letterToFindIndex);
for(let row = 0; row < map2D.length; row++) {
	for(let col = 0; col < map2D[row].length; col++) {
		if(map2D[row][col] === letterToFind) {
			// Once we found the central letter, we look for the letters before and after: M and S
			findLetterBeforeAndAfter(new Position(row, col), (letterToFindIndex));
		}
	}
}

const xWords = wordsCenters.filter((center) => wordsCenters.filter((otherCenter) => otherCenter.row === center.row && otherCenter.col === center.col).length === 2);


console.log({xWords, nbOfXWords: xWords.length / 2});