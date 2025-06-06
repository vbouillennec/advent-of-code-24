import fs from "fs";

let inputTextName = "input";
const args = process.argv.slice(2);
if (args.length > 0) {
	inputTextName = args[0];
}

type Position = {
	x: number;
	y: number;
};

class ClawMachine {
	constructor(public AButton: Position, public BButton: Position, public prize: Position) { }
}

const input = fs.readFileSync(`13/${inputTextName}.txt`).toString();

const extendedGcd = (a, b) => {
	if (b === 0) return { gcd: a, x: 1, y: 0 };
	const { gcd, x, y } = extendedGcd(b, a % b);
	return { gcd, x: y, y: x - Math.floor(a / b) * y };
}

const clawMachines = input.split('\r\n\r\n').map((block: string) => {
	const lines = block.split('\r\n');

	const AButton = lines[0].match(/(\d+)/g);
	const BButton = lines[1].match(/(\d+)/g);
	const prize = lines[2].match(/(\d+)/g);

	return new ClawMachine(
		{ x: parseInt(AButton[0]), y: parseInt(AButton[1]) },
		{ x: parseInt(BButton[0]), y: parseInt(BButton[1]) },
		{ x: parseInt(prize[0]), y: parseInt(prize[1]) }
	);
});

const minTokens = (clawMachines: ClawMachine[]) => {
	let totalTokens = 0;

	for (const clawMachine of clawMachines) {
		const [xA, yA] = [clawMachine.AButton.x, clawMachine.AButton.y];
		const [xB, yB] = [clawMachine.BButton.x, clawMachine.BButton.y];
		const [xP, yP] = [clawMachine.prize.x, clawMachine.prize.y];

		// Find the Bézout coefficients (s, t) such that s*xA + t*xB = gcd(xA, xB)
		const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
		const [s, t] = bezout(xA, xB);

		console.log({ s, t });
		

		// Check if the prize is reachable
		if ((xP - s * xA) % xB !== 0 || (yP - s * yA) % yB !== 0) {
			console.log(`No solution for ${clawMachine}`);
			
			continue; // Prize is unreachable
		}

		// Calculate the minimum number of button presses
		let A = (xP - s * xA) / xB;
		let B = s;

		console.log({ A, B });
		

		// Ensure A and B are positive and within the 100-press limit
		while (A < 0 || B < 0 || A > 100 || B > 100) {
			A += xB / gcd(xA, xB);
			B -= xA / gcd(xA, xB);
		}

		totalTokens += 3 * A + B;
		process.exit();
	}

	return totalTokens;
}

// Helper function to find Bézout coefficients
function bezout(a, b) {
	if (b === 0) {
		return [1, 0];
	} else {
		const [s, t] = bezout(b, a % b);
		return [t, s - Math.floor(a / b) * t];
	}
}


const minTokensRequired = minTokens(clawMachines);
console.log(minTokensRequired); // Output: 480

// clawMachines.forEach((clawMachine) => {
// 	const ax = clawMachine.AButton.x;
// 	const ay = clawMachine.AButton.y;
// 	const bx = clawMachine.BButton.x;
// 	const by = clawMachine.BButton.y;
// 	const px = clawMachine.prize.x;
// 	const py = clawMachine.prize.y;

// 	const gcdX = extendedGcd(ax, bx).gcd;
// 	const gcdY = extendedGcd(ay, by).gcd;

// 	console.log({ gcdX, gcdY });

// 	if (px % gcdX !== 0 || py % gcdY !== 0) {
// 		console.log(`No solution for ${clawMachine}`);

// 		return null; // Pas de solution possible
// 	}

// 	// Résoudre pour X avec le PGCD
// 	const { x: ux, y: vx } = extendedGcd(ax, bx);
// 	const scaleX = px / gcdX;
// 	console.log({ ux, vx, scaleX });
// 	let aX = ux * scaleX, bX = vx * scaleX;
// 	console.log({ aX, bX });

// 	// Réduire modulo pour minimiser les mouvements sur X
// 	const modX = bx / gcdX;
// 	const kX = Math.floor(bX / modX);
// 	aX -= kX * modX;
// 	bX += kX * (ax / gcdX);

// 	// Résoudre pour Y avec le PGCD
// 	const { x: uy, y: vy } = extendedGcd(ay, by);
// 	const scaleY = py / gcdY;
// 	let aY = uy * scaleY, bY = vy * scaleY;

// 	// Réduire modulo pour minimiser les mouvements sur Y
// 	const modY = by / gcdY;
// 	const kY = Math.floor(bY / modY);
// 	aY -= kY * modY;
// 	bY += kY * (ay / gcdY);

// 	// Calculer le coût total
// 	const totalA = Math.round(aX + aY);
// 	const totalB = Math.round(bX + bY);
// 	const cost = totalA * 3 + totalB;

// 	console.log({ cost, totalA, totalB });

// 	process.exit();

// 	return {
// 		totalCost: cost,
// 		aPress: totalA,
// 		bPress: totalB,
// 	};

// 	// console.log({movesForX, movesForY});
// });
