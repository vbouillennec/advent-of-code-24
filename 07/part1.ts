import fs from 'fs';

const input = fs.readFileSync('./07/input.txt').toString();

const possibleOpe = ['+', '*'];

class Equation {
	constructor(public result: number, public numbers: number[]) {
		this.result = result;
		this.numbers = numbers;
	}
}

const executeOperation = (numbers: number[], execution: string[]) => {
	return execution.reduce((prev, curr, i) => {
		if(curr === '+') {
			return prev + numbers[i + 1];
		} else {
			return prev * numbers[i + 1];
		}
	}, numbers[0]);
}

const recursiveLoop = (nbOfLoops: number, opeToExecute: string [][], line:number, copyOpe: string[]): number => {
	if(nbOfLoops === 0) return line;
	for(let i = 0; i < possibleOpe.length; i++) {
		const copyOpe = [...opeToExecute[line]];
		opeToExecute[line].push(possibleOpe[i]);
		if(nbOfLoops === 1) {
			line++;
		}
		line = recursiveLoop(nbOfLoops - 1, opeToExecute, line, copyOpe);
		opeToExecute[line] = copyOpe;
	}
	return line;
}

const generateOperatorsToExecute = (nbOperatorsPerLine: number) => {
	const opeToExecute: string[][] = [];
	let line = 0;
	opeToExecute[line] = [];
	recursiveLoop(nbOperatorsPerLine, opeToExecute, line, []);
	opeToExecute.pop();
	return opeToExecute;
}


const findCorrectEquation = (equation: Equation) => {
	const { result, numbers } = equation;
	const operatorsToExecute = generateOperatorsToExecute(numbers.length - 1);
	return operatorsToExecute.find((ope) => {
		return executeOperation(numbers, ope) === result;
	});
}

const equations = input.split('\r\n').map((eq) => {
	const [result, numbers] = eq.split(':');
	return new Equation(parseInt(result), numbers.trim().split(' ').map((n) => parseInt(n)));
});

const correctEquations = equations.filter((eq, i) => findCorrectEquation(eq));

const result = correctEquations.reduce((prev, curr) => {
	return prev + curr.result;
}, 0);

console.log({correctEquations, result});
