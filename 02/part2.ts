import fs from "fs";

const input = fs.readFileSync("./02/input.txt").toString();

const reports = input.split("\n");

function getLevelDirection(level1: number, level2: number): number {
	if(level1 < level2) {
		return 1;
	} else if(level1 > level2) {
		return -1;
	} else {
		return 0;
	}
}

function reportIsSafe(levels: number[]): boolean {
	let prevLevel = levels[0];
	let prevDirection = getLevelDirection(prevLevel, levels[1]);
	for(let i = 1; i < levels.length; i++) {
		if(prevDirection !== getLevelDirection(prevLevel, levels[i])) {
			return false;
		}
		prevDirection = getLevelDirection(prevLevel, levels[i]);
		const lvlDiff = Math.abs(prevLevel - levels[i]);
		if(lvlDiff > 3 || lvlDiff < 1) {
			return false;
		}
		prevLevel = levels[i];
	}
	return true;
}

function checkByRemovingLevel(levels: number[]): boolean {
	for(let j = 0; j < levels.length; j++) {
		const newLevels = [...levels];
		newLevels.splice(j, 1);
		if(reportIsSafe(newLevels)) {
			return true;
		}
	}
	return false;
}

const safeReports = [];

for (let i = 0; i < reports.length; i++) {
	const report = reports[i];
	const levels = report.trim().split(" ").map(level => parseInt(level));
	const isSafe = reportIsSafe(levels);
	
	if(isSafe) {
		safeReports.push(i);
		continue;
	} else if(checkByRemovingLevel(levels)) {
		safeReports.push(i);
	}
}

console.log({safeReports, nbSafeReports: safeReports.length});
