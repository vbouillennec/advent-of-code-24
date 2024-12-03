import fs from "fs";

const input = fs.readFileSync("./03/input.txt").toString();

const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

const multiply = (a: number, b: number) => a * b;

let matches = input.matchAll(regex);

let result = 0;
let calculate = true;
for (const match of matches) {
	if(match.at(0) === "do()") {
		calculate = true;
		continue;
	} else if(match.at(0) === "don't()") {
		calculate = false;
		continue;
	}
	if(calculate) {
		result += multiply(parseInt(match[1]), parseInt(match[2]));
	}
}

console.log({result});