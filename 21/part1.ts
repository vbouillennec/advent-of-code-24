/**
 * ✅ Advent of Code 2024 - Day 21 - Part 1
 * https://adventofcode.com/2024/day/21
 *
 * Solution by: Valentin Bouillennec
 */

import fs from "fs";

const input = fs.readFileSync("./21/input.txt").toString();

type Position = { row: number; col: number };

const numPad = new Map<string, Position>([
['7', { row: 0, col: 0 }], ['8', { row: 0, col: 1 }], ['9', { row: 0, col: 2 }],
['4', { row: 1, col: 0 }], ['5', { row: 1, col: 1 }], ['6', { row: 1, col: 2 }],
['1', { row: 2, col: 0 }], ['2', { row: 2, col: 1 }], ['3', { row: 2, col: 2 }],
                           ['0', { row: 3, col: 1 }], ['A', { row: 3, col: 2 }]
]);

const dirPad = new Map<string, Position>([
                           ['^', { row: 0, col: 1 }], ['A', { row: 0, col: 2 }],
['<', { row: 1, col: 0 }], ['v', { row: 1, col: 1 }], ['>', { row: 1, col: 2 }],
]);

const codes = input.trim().split("\r\n");

const getKeysPressed = (code: string): string => {
    let totalSteps = 0;
    let keysPressed = '';
    let currNumPadPos = numPad.get('A'); // Start at 'A'
    let currDirPadPos = dirPad.get('A'); // Start at 'A'
    let targetPos= numPad.get('A');
    code.split('').forEach(char => {
        currNumPadPos = targetPos;
        targetPos = numPad.get(char);
        const rowDiff = targetPos.row - currNumPadPos.row;
        const colDiff = targetPos.col - currNumPadPos.col;
        keysPressed += '^'.repeat(Math.max(0, -rowDiff));
        keysPressed += 'v'.repeat(Math.max(0, rowDiff));
        keysPressed += '<'.repeat(Math.max(0, -colDiff));
        keysPressed += '>'.repeat(Math.max(0, colDiff));
        keysPressed += 'A';
        console.log(`Moving to ${char}: rowDiff=${rowDiff}, colDiff=${colDiff}, keysPressed=${keysPressed}`);
    });
    return keysPressed;
};

codes.forEach(code => {
    const keys = getKeysPressed(code);
    console.log(`Code: ${code} => Keys Pressed: ${keys}`);
});