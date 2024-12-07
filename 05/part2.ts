import fs from "fs";

const input = fs.readFileSync("./05/input.txt").toString().split("\r\n\r\n");

class Order {
	constructor(public before: number, public after: number) {
		this.before = before;
		this.after = after;
	}
}

const sortPages = (orderingRules: Order[], update: number[]) => {
	let sortedPages = [...update].sort((a, b) => {
		if(orderingRules.find((rule) => rule.before === a && rule.after === b)){
			return -1;
		}
		if(orderingRules.find((rule) => rule.before === a && rule.after === b)){
			return 1;
		}
		return 0;
	});	
	return sortedPages;
}
const checkUpdateInvalidity = (initialUpdate: number[], sortedUpdate: number[]) => {
	return initialUpdate.toString() !== sortedUpdate.toString();
}

const orderingRules: Order[] = input.at(0)?.split("\r\n").map((rule) => {
	const [before, after] = rule.split("|");
	return new Order(parseInt(before), parseInt(after));
}) as Order[];

const pagesToProduce = input.at(1)?.split("\r\n").map((update) => update.split(',').map((page) => parseInt(page))) as number[][];

const sortedInvalidUpdates = pagesToProduce.map((update) => {
	const sortedUpdate = sortPages(orderingRules, update);
	if(checkUpdateInvalidity(update, sortPages(orderingRules, update))) {
		return sortedUpdate;
	}
}).filter((update) => update) as number[][];

const sumOfMiddlePages = sortedInvalidUpdates.reduce((acc, update: number[]) => {
	return acc + update[Math.floor(update.length / 2)];
}, 0);

console.log({sumOfMiddlePages});
