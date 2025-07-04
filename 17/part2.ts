import fs from "fs";

const input = fs.readFileSync("./17/input3.txt").toString();

const lines = input.split("\r\n");

let iPointer = 0;
let registerA = 0;
let registerB = 0;
let registerC = 0;
let program: number[] = [];
const output: number[] = [];

lines.forEach((line) => {
  if (line.includes("Register A: ")) {
	registerA = Number(line.split(": ")[1]);
  } else if (line.includes("Register B: ")) {
	registerB = Number(line.split(": ")[1]);
  } else if (line.includes("Register C: ")) {
	registerC = Number(line.split(": ")[1]);
  } else if (line.includes("Program: ")) {
	program = line.split(": ")[1].split(',').map(Number);
  }
});

console.log(`Register A: ${registerA}`);
console.log(`Register B: ${registerB}`);
console.log(`Register C: ${registerC}`);
console.log(`Program: ${program}`);

function executeProgram(program: number[]) {
  // let programPointer = 0;
  let opcode = 0;
  let operand = 0;
  while(iPointer < program.length) {
	opcode = program[iPointer];
	operand = program[iPointer + 1];
	switch (opcode) {
	  case 0:
		adv(operand);
		break;
	  case 1:
		bxl(operand);
		break;
	  case 2:
		bst(operand);
		break;
	  case 3:
		{
		  const ip = jnz(operand);
		  if(ip !== null) {
			iPointer = ip;
			continue;
		  }
		}
		break;
	  case 4:
		bxc();
		break;
	  case 5:
		out(operand);
		break;
	  case 6:
		bdv(operand);
		break;
	  case 7:
		cdv(operand);
		break;
	  default:
		break;
	}
	iPointer = iPointer + 2
  }
  // print output
  console.log('output: ' + output.join(','))
}

// opcode 0
function adv(operand: number) {
  const opv = operandValue(operand);
  registerA = Math.trunc(registerA / Math.pow(2, opv));
}

// opcode 1
function bxl(operand: number) {
  registerB = registerB ^ operand;
}

// opcode 2
function bst(operand: number) {
  const opv = operandValue(operand);
  registerB = opv % 8;
}

// opcode 3
function jnz(operand: number) {
  if(registerA === 0)
	return null;
  return operand;
}

// opcode 4
function bxc() {
  registerB = registerB ^ registerC;
}

// opcode 5
function out(operand: number) {
  const opv = operandValue(operand);
  output.push(opv % 8);
  
}

// opcode 6
function bdv(operand: number) {
  const opv = operandValue(operand);
  registerB = Math.trunc(registerA / Math.pow(2, opv));
}

// opcode 7
function cdv(operand: number) {
  const opv = operandValue(operand);
  registerC = Math.trunc(registerA / Math.pow(2, opv));
}

function operandValue(operand) {
  if (operand === 4) {
	return registerA;
  } else if (operand === 5) {
	return registerB;
  } else if (operand === 6) {
	return registerC;
  } else if (operand === 7) {
	throw new Error("Invalid operand: 7");
  }

  return operand;
}

executeProgram(program);