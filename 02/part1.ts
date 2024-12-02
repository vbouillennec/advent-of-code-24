import fs from "fs";

const input = fs.readFileSync("./02/input.txt").toString();

const reports = input.split("\n");

function isIncreasingOrDecreasing(levels: number[]): boolean {
	const levelStr = levels.toString();
	const increasingSortStr = [...levels].sort((a: number, b: number) => a - b).toString();
	const decreasingSortStr = [...levels].sort((a: number, b: number) => b - a).toString();
	
	return increasingSortStr === levelStr || decreasingSortStr === levelStr;
}

function differenceIsSafe(levels: number[]): boolean {
	let prevLevel = levels[0];
	for(let j = 1; j < levels.length; j++) {
		const lvlDiff = Math.abs(prevLevel - levels[j]);
		if(lvlDiff > 3 || lvlDiff < 1) {
			return false;
		}
		prevLevel = levels[j];
	}
	return true;
}

const safeReports = [];

for (let i = 0; i < reports.length; i++) {
	const report = reports[i];
	const levels = report.trim().split(" ").map(level => parseInt(level));
	
	if(isIncreasingOrDecreasing(levels) && differenceIsSafe(levels)) {
		safeReports.push(levels);
	}
}

console.log({safeReports, nbSafeReports: safeReports.length});
