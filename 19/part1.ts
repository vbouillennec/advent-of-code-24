/**
 * ✅ Advent of Code 2024 - Day 19 - Part 1
 * https://adventofcode.com/2024/day/19
 *
 * Solution by: Valentin Bouillennec
 */

import fs from "fs";

const input = fs.readFileSync("./19/input2.txt").toString();

const splitInput = input.split("\r\n\r\n");
const patterns = splitInput[0].split(", ");
const designs = splitInput[1].split("\r\n");
// Sort patterns by length in descending order
const sortedPatterns = patterns.sort((a, b) => b.length - a.length);

const isPossibleDesign = (design: string, patterns: string[]): boolean => {

    let designsToTest = [design];
    while(designsToTest.length > 0) {
        let nextDesignsToTest: string[] = [];
        for (let i = 0; i < designsToTest.length; i++) {
            let designToTest = designsToTest[i];
            for (const pattern of patterns) {
                if(designToTest.indexOf(pattern) === 0){
                    let slicedDesign = designToTest.slice(pattern.length);
                    if(slicedDesign.length === 0) {
                        return true;
                    }
                    if(!nextDesignsToTest.includes(slicedDesign))
                        nextDesignsToTest.push(slicedDesign);
                }
            }
        }
        designsToTest = nextDesignsToTest;
    }
    return false;
};


const countPossibleDesigns = (sortedPatterns: string[], designs: string[]): Number => {
    let count = 0;
    for (const design of designs) {
        if(isPossibleDesign(design, sortedPatterns)) {
            count++;
        }
    }
    return count;
};

const nbPossibleDesigns = countPossibleDesigns(sortedPatterns, designs);
console.log("nb Possible designs:", nbPossibleDesigns);

