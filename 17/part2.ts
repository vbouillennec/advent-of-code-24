/**
 * ❌ Advent of Code 2024 - Day 17 - Part 2 (Abandoned)
 * https://adventofcode.com/2024/day/17
 *
 * Solution by: Valentin Bouillennec
 */

import fs from "fs";

const input = fs.readFileSync("./17/input2.txt").toString();

const lines = input.split("\r\n");

let iPointer = 0;
let initRegisterA = 0;
let initRegisterB = 0;
let initRegisterC = 0;
let globalRegisterA = initRegisterA;
let globalRegisterB = initRegisterB;
let globalRegisterC = initRegisterC;
let initProgram: number[] = [];
let output: number[] = [];

lines.forEach((line) => {
  if (line.includes("Register A: ")) {
	  initRegisterA = Number(line.split(": ")[1]);
  } else if (line.includes("Register B: ")) {
	  initRegisterB = Number(line.split(": ")[1]);
  } else if (line.includes("Register C: ")) {
	  initRegisterC = Number(line.split(": ")[1]);
  } else if (line.includes("Program: ")) {
	  initProgram = line.split(": ")[1].split(',').map(Number);
  }
});

console.log(`Register A: ${initRegisterA}`);
console.log(`Register B: ${initRegisterB}`);
console.log(`Register C: ${initRegisterC}`);
console.log(`Program: ${initProgram}`);

function executeProgram(program: number[]): number[] {
  iPointer = 0;
  output = [];
  let opcode = 0;
  let operand = 0;
  globalRegisterA = initRegisterA;
  globalRegisterB = initRegisterB;
  globalRegisterC = initRegisterC;
  
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
  return output;
}

// opcode 0
function adv(operand: number) {
  const opv = operandValue(operand);
  globalRegisterA = Math.trunc(globalRegisterA / Math.pow(2, opv));
}

// opcode 1
function bxl(operand: number) {
  globalRegisterB = globalRegisterB ^ operand;
}

// opcode 2
function bst(operand: number) {
  const opv = operandValue(operand);
  globalRegisterB = opv % 8;
}

// opcode 3
function jnz(operand: number) {
  if(globalRegisterA === 0)
	return null;
  return operand;
}

// opcode 4
function bxc() {
  globalRegisterB = globalRegisterB ^ globalRegisterC;
}

// opcode 5
function out(operand: number) {
  const opv = operandValue(operand);
  output.push(opv % 8);
  
}

// opcode 6
function bdv(operand: number) {
  const opv = operandValue(operand);
  globalRegisterB = Math.trunc(globalRegisterA / Math.pow(2, opv));
}

// opcode 7
function cdv(operand: number) {
  const opv = operandValue(operand);
  globalRegisterC = Math.trunc(globalRegisterA / Math.pow(2, opv));
}

function operandValue(operand) {
  if (operand === 4) {
	return globalRegisterA;
  } else if (operand === 5) {
	return globalRegisterB;
  } else if (operand === 6) {
	return globalRegisterC;
  } else if (operand === 7) {
	throw new Error("Invalid operand: 7");
  }

  return operand;
}

let result: number[] = [];
while (JSON.stringify(result) !== JSON.stringify(initProgram)) {
  result = executeProgram(initProgram);
  initRegisterA++;
}
console.log(`Found matching input: ${initRegisterA}`);
console.log(`result: ${result}`);
console.log(`expected: ${initProgram}`);