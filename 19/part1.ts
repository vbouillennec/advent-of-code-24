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

console.log("Patterns:", patterns[0], "...", patterns[patterns.length -1]);
console.log("Designs:", designs.length);
// Sort patterns by length in descending order
const sortedPatterns = patterns.sort((a, b) => b.length - a.length);

const isPossibleDesign = (design: string, patterns: string[]): boolean => {
    let tmpDesign = design;
    // console.log('design original: ' + tmpDesign);
    while(tmpDesign.length > 0) {
        let patternMatch = false;
        for (const pattern of patterns) {
            // console.log('index of ' + pattern + ': ' + tmpDesign.indexOf(pattern));
            if(tmpDesign.indexOf(pattern) === 0){
                // console.log('je trouve une correspondance');
                tmpDesign = tmpDesign.slice(pattern.length);
                patternMatch = true;
                break;
            }
        }
        if(!patternMatch) return false;
    }
    return true;
};


const countPossibleDesigns = (sortedPatterns: string[], designs: string[]): Number => {
    let count = 0;
    for (const design of designs) {
        if(isPossibleDesign(design, sortedPatterns)) {
            // console.log('le design ' + design + ' est possible');
            count++;
        } else {
            // console.error('le design ' + design + ' n\'est pas possible');
        }
    }
    return count;
};

const nbPossibleDesigns = countPossibleDesigns(sortedPatterns, designs);
console.log("nb Possible designs:", nbPossibleDesigns);

