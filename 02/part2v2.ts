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
	return levels.every((lvl, i) => {
		if(i === 0) return true;
		const lvlDiff = Math.abs(lvl - levels[i - 1]);
		return lvlDiff >= 1 && lvlDiff <= 3;
	});
}

function reportIsSafe(levels: number[]): boolean {
	return isIncreasingOrDecreasing(levels) && differenceIsSafe(levels);
}

function checkByRemovingLevel(levels: number[]): boolean {
	return levels.some((lvl, i) => {
		const newLevels = [...levels];
		newLevels.splice(i, 1);
		return reportIsSafe(newLevels);
	});
}

const safeReports = [];

for (let i = 0; i < reports.length; i++) {
	const report = reports[i];
	const levels = report.trim().split(" ").map(level => parseInt(level));
	const isSafe = reportIsSafe(levels);
	
	if(isSafe) {
		safeReports.push(i);
	} else if(checkByRemovingLevel(levels)) {
		safeReports.push(i);
	}
}

console.log({nbSafeReports: safeReports.length});
