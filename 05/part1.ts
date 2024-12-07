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
		else if(orderingRules.find((rule) => rule.before === a && rule.after === b)){
			return 1;
		}
		return 0;
	});	
	return sortedPages;
}
const checkUpdateValidity = (initialUpdate: number[], sortedUpdate: number[]) => {
	return initialUpdate.toString() === sortedUpdate.toString();
}

const orderingRules: Order[] = input.at(0)?.split("\r\n").map((rule) => {
	const splittedRule = rule.split("|");
	const before = splittedRule.shift()!;
	const after = splittedRule.shift()!;
	return new Order(parseInt(before), parseInt(after));
}) as Order[];

const pagesToProduce = input.at(1)?.split("\r\n").map((update) => update.split(',').map((page) => parseInt(page))) as number[][];

const validUpdates = pagesToProduce.filter((update) => {
	return checkUpdateValidity(update, sortPages(orderingRules, update));
});

const sumOfMiddlePages = validUpdates.reduce((acc, update: number[]) => {
	return acc + update[Math.floor(update.length / 2)];
}, 0);

console.log({validUpdates, sumOfMiddlePages});
