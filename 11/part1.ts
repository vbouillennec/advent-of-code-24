import fs from 'fs';

const input = fs.readFileSync('./11/input.txt').toString();

class Stone {
	constructor(public engravedNumber: number) {
		this.engravedNumber = engravedNumber;
	}

	hasEvenSize() {
		return this.engravedNumber.toString().length % 2 === 0;
	}

	isZero() {
		if (this.engravedNumber === 0) {
			this.engravedNumber = 1;
			return true;
		}
		return false
	}

	by2024() {
		this.engravedNumber *= 2024;
		return this.engravedNumber;
	}

	split() {
		if(!this.hasEvenSize()) return;
		const str = this.engravedNumber.toString();
		const half = Math.floor(str.length / 2);
		const left = new Stone(Number(str.slice(0, half)));
		const right = new Stone(Number(str.slice(half)));
		return [left, right];
	}

	toString() {
		return `${this.engravedNumber}`;
	}
}

class StoneLine {
	constructor(public stones: Stone[]) {
		this.stones = stones;
	}

	print() {
		console.log(this.stones.join(' '));
	}

	blink() {
		const tmpStones = [...this.stones];
		let nbOfShifts = 0;
		for(let i = 0; i < this.stones.length; i++) {
			const stone = this.stones[i];
			if(stone.isZero()) {
				tmpStones.splice(i + nbOfShifts, 1, stone);
				continue;
			}
			if(stone.hasEvenSize()) {
				const [left, right] = stone.split();
				tmpStones.splice(i + nbOfShifts, 1, left, right);
				nbOfShifts++;
			} else {
				stone.by2024();
				tmpStones.splice(i + nbOfShifts, 1, stone);
			}
		}
		this.stones = tmpStones;
	}
}

const stoneLine = new StoneLine(input.trim().split(" ").map((stone, index) => {
	return new Stone(Number(stone));
}));

for(let i = 0; i < 25; i++) {
	process.stdout.write(`progress: ${Math.floor(i * 100 / 25)}%\r`);
	stoneLine.blink();
	// stoneLine.print();
}

console.log(`nb of stones: ${stoneLine.stones.length}`);
