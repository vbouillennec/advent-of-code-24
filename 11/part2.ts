import fs from 'fs';

const input = fs.readFileSync('./11/input.txt').toString();

const split = (stone: number) => {
	const str = stone.toString();
	const half = Math.floor(str.length / 2);
	const left = Number(str.slice(0, half));
	const right = Number(str.slice(half));
	return [left, right];
}

let cache = new Map();

const calcForAStone = (stone: number, nbOfBlinks: number) => {
	let result = 0;
	if(nbOfBlinks === 0) {
		return 1;
	}
	if(cache.has(stone)) {
		if(cache.get(stone).has(totalBlinks - nbOfBlinks)){
			return cache.get(stone).get(totalBlinks - nbOfBlinks);
		}
	}
	if(stone === 0) {
		result += calcForAStone(1, nbOfBlinks - 1);
	}
	else if(stone.toString().length % 2 === 0) {
		const [left, right] = split(stone);
		result += calcForAStone(left, nbOfBlinks - 1);
		result += calcForAStone(right, nbOfBlinks - 1);
		
	} else {
		result += calcForAStone(stone * 2024, nbOfBlinks - 1);
	}
	if(!cache.has(stone)) {
		cache.set(stone, new Map().set(totalBlinks - nbOfBlinks, result));
	} else if (!cache.get(stone)?.has(totalBlinks - nbOfBlinks)) {
		cache.get(stone)?.set(totalBlinks - nbOfBlinks, result);
	}
	return result;
}

const stoneLine = input.trim().split(" ").map(Number);

let nbOfStones = 0;
const totalBlinks = 75;
for(let i = 0; i < stoneLine.length; i++) {
	nbOfStones += calcForAStone(stoneLine[i], totalBlinks);
}

console.log(`nb of stones: ${nbOfStones}`);