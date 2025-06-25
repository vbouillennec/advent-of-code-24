import fs from "fs";

const input = fs.readFileSync("./17/input.txt").toString();

const lines = input.split("\r\n");

let registerA = 0;
let registerB = 0;
let registerC = 0;
let program = "";

lines.forEach((line) => {
  if (line.includes("Register A: ")) {
    registerA = Number(line.split(": ")[1]);
  } else if (line.includes("Register B: ")) {
    registerB = Number(line.split(": ")[1]);
  } else if (line.includes("Register C: ")) {
    registerC = Number(line.split(": ")[1]);
  } else if (line.includes("Program: ")) {
    program = line.split(": ")[1];
  }
});

console.log(`Register A: ${registerA}`);
console.log(`Register B: ${registerB}`);
console.log(`Register C: ${registerC}`);
console.log(`Program: ${program}`);
