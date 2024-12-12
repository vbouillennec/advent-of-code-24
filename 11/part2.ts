import fs from 'fs';

const input = fs.readFileSync('./11/input2.txt').toString();

const split = (stone: number) => {
	const str = stone.toString();
	const half = Math.floor(str.length / 2);
	const left = Number(str.slice(0, half));
	const right = Number(str.slice(half));
	return [left, right];
}

const print = (stones: number[]) => {
	console.log(stones.join(' '));
}

let cache = new Map();

const calcForAStone = (stone: number, nbOfBlinks: number) => {
	for (let i = 0; i < nbOfBlinks; i++) {
		// console.log(`stone: ${stone.engravedNumber}`);
		if(stone === 0) {
			console.log(`zero`);
			stone = 1;
			cache.set(stone, new Map().set(i, 0));
			continue;
		}
		if(stone.toString().length % 2 === 0) {
			console.log(`split`);
			const [left, right] = split(stone);
			stone = left;
			calcForAStone(right, nbOfBlinks - (i + 1));
			
		} else {
			console.log(`by2024`);
			stone *= 2024;
		}
	}
	nbOfStones++;
}

const stoneLine = input.trim().split(" ").map(Number);

let nbOfStones = 0;
const nbOfblinks = 25;
for(let i = 0; i < stoneLine.length; i++) {
	// process.stdout.write(`progress: ${Math.floor(i * 100 / stoneLine.stones.length)}%\r`);
	calcForAStone(stoneLine[i], nbOfblinks);
}

console.log(`nb of stones: ${nbOfStones}`);
