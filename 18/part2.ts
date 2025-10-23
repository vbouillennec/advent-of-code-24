/**
 * ✅ Advent of Code 2024 - Day 18 - Part 2
 * https://adventofcode.com/2024/day/18
 *
 * Solution by: Valentin Bouillennec
 */

import fs from "fs";

const input = fs.readFileSync("./18/input2.txt").toString();

const lastLine = 70;
const lastCol = lastLine;

const allBytesPos = input.split("\r\n");
let posLastByte = allBytesPos.length - 1;
const bytesPos = [...allBytesPos];

type Position = {
  row: number;
  col: number;
};

type QueueItem = {
  cost: number,
  pos: Position,
  dir: string
}

const directions = new Map([
  ['right', { row: 0, col: 1 }],
  ['down', { row: 1, col: 0 }],
  ['left', { row: 0, col: -1 }],
  ['up', { row: -1, col: 0 }],
]);

const canMove = (nextPos: Position): boolean => {
  return !bytesPos.includes(`${nextPos.col},${nextPos.row}`) && 
    nextPos.row >= 0 && nextPos.col >= 0 &&
    nextPos.row <= lastLine &&
    nextPos.col <= lastCol;
}

const hasArrived = (pos: Position): boolean => {
  return pos.row === lastLine && pos.col === lastCol;
}

/* @param dir - current direction
 * 
 * This function updates the global variable `currDir` to the next direction in clockwise order.
 */
const rotateClockwise = (dir: string, counter: boolean = false): string => {
  const keys = Array.from(directions.keys());
  const index = keys.indexOf(dir);
  // the modulo operator is used to wrap around the array
  let nextIndex = (index + 1) % keys.length;
  if (counter) {
    nextIndex = (index - 1 + keys.length) % keys.length;
  }
  return keys[nextIndex];
}

const stateKey = (pos: Position, dir: string) => {
  return `${pos.row},${pos.col},${dir}`
}

const findLowestCost = (bytesPos: string[]) => {
  const rows = lastLine + 1;
  const cols = rows;
  let startPos: Position = { row: 0, col: 0 };

  const heap: QueueItem[] = [
    {
      cost: 0,
      pos: startPos,
      dir: 'right'
    }
  ];

  const visited = new Map<string, number>();

  while (heap.length > 0) {
    // Faire le déplacement
    heap.sort((a, b) => a.cost - b.cost);
    const currPos = heap.shift();
    const { cost, pos, dir } = currPos;

    // Si on est arrivé à la fin, on retourne le coût
    if(hasArrived(pos)) {
      // console.log(`Arrived at end position: ${pos.row}, ${pos.col} with cost: ${cost}`);
      return cost;
    }

    const key = stateKey(pos, dir);
    if (visited.has(key) && visited.get(key) <= cost) continue;
    visited.set(key, cost);

    const nextPos = {
      row: pos.row + directions.get(dir).row,
      col: pos.col + directions.get(dir).col
    };

    if (canMove(nextPos)) {
      heap.push({ cost: cost + 1, pos: nextPos, dir });
      // console.log(`pos: [${nextPos.row},${nextPos.col}] ${dir}`);
    }

    heap.push({ cost: cost, pos, dir: rotateClockwise(dir) });

    heap.push({ cost: cost, pos, dir: rotateClockwise(dir, true) });
  }

  return -1; // No path found
}

let currCost = -1;
while (currCost === -1 && posLastByte !== -1) {
  posLastByte--;
  bytesPos.pop();
  currCost = findLowestCost(bytesPos);
}

console.log(`Lowest cost to reach the end: ${ currCost }`);
console.log(`First byte to block exit: ${ allBytesPos[++posLastByte] }`);
