/**
 * ❌ Advent of Code 2024 - Day 19 - Part 2 (abandoned)
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

const possibleDesigns = (design: string, patterns: string[]): number => {
    let designsToTest = [design];
    let nbPossibleDesigns = 0;
    let step = 0;
    while(designsToTest.length > 0) {
        ++step;
        let nextDesignsToTest: string[] = [];
        // console.log('designs to test: ' + designsToTest);
        let removedParts: string[] = [];
        for (let i = 0; i < designsToTest.length; i++) {
            let designToTest = designsToTest[i];
            for (const pattern of patterns) {
                if(designToTest.indexOf(pattern) === 0){
                    removedParts.push(designToTest.substring(0, pattern.length));
                    let slicedDesign = designToTest.slice(pattern.length);
                    if(slicedDesign.length === 0) {
                        nbPossibleDesigns++;
                        // console.log('possible designs: '+ nbPossibleDesigns);
                    }
                    if(slicedDesign.length > 0)
                        nextDesignsToTest.push(slicedDesign);
                }
            }
        }
        // console.log('step ' + step + ' removed parts: ' + removedParts);
        designsToTest = nextDesignsToTest;
    }
    console.log('nb possible designs for ' + design + ': ' + nbPossibleDesigns);
    return nbPossibleDesigns;
};


const countPossibleDesigns = (sortedPatterns: string[], designs: string[]): Number => {
    let count = 0;
    let designIndex = 0;
    for (const design of designs) {
        console.warn('design N°'+ ++designIndex);
        count += possibleDesigns(design, sortedPatterns);
    }
    return count;
};

const nbPossibleDesigns = countPossibleDesigns(sortedPatterns, designs);
console.log("nb Possible designs:", nbPossibleDesigns);

