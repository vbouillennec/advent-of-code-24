import fs from "fs";

const input = fs.readFileSync("./01/input.txt").toString();

const lines = input.split("\n");

// split each line into left and right locations
const leftLocations = lines.map((line) => parseInt(line.split("   ")[0]));
const rightLocations = lines.map((line) => parseInt(line.split("   ")[1]));

// sort the locations
const leftLocationsSorted = leftLocations.sort((a, b) => a - b);
const rightLocationsSorted = rightLocations.sort((a, b) => a - b);

// calculate the total distance
// sum of the absolute difference between the left and right locations
const totalDistance = leftLocationsSorted.reduce((acc, location, index) => acc + Math.abs(location - rightLocationsSorted[index]), 0);

console.log({leftLocationsSorted, rightLocationsSorted, totalDistance});