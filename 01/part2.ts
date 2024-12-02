import fs from "fs";

const input = fs.readFileSync("./01/input.txt").toString();

const lines = input.split("\n");

// split each line into left and right locations
const leftLocations = [];
const rightLocations = [];
for (let i = 0; i < lines.length; i++) {
	const [left, right] = lines[i].split("   ");
	leftLocations.push(parseInt(left));
	rightLocations.push(parseInt(right));
}

// sort the locations
const leftLocationsSorted = leftLocations.sort((a, b) => a - b);
const rightLocationsSorted = rightLocations.sort((a, b) => a - b);

// calculate the similarity score
// sum of the product of the left location and the number of times it appears in the right locations
const similarityScore = leftLocationsSorted.reduce((acc, location, index) => {
	const score = location * rightLocationsSorted.filter(rloc => rloc === location).length;
	return acc + score;
}, 0);

console.log({leftLocationsSorted, rightLocationsSorted, similarityScore});