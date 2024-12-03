import fs from "fs";

const input = fs.readFileSync("./03/input.txt").toString();

const regex = /mul\((\d+),(\d+)\)/g

const multiply = (a: number, b: number) => a * b;

let matches = input.matchAll(regex);

let result = 0;
for (const match of matches) {
	result += multiply(parseInt(match[1]), parseInt(match[2]));
}

console.log({result});
