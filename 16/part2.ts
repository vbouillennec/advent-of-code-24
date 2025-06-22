import fs from "fs";

const input = fs.readFileSync("./16/input2.txt").toString();

const map2D = input.split("\r\n").map((line) => line.split(""));

type Position = {
    row: number;
    col: number;
};

type QueueItem = {
    cost: number,
    pos: Position,
    dir: string,
    viewed: string[],
}

const directions = new Map([
    ['right', { row: 0, col: 1 }],
    ['down', { row: 1, col: 0 }],
    ['left', { row: 0, col: -1 }],
    ['up', { row: -1, col: 0 }],
]);

let score = 0;
let invert = false;
// let currDir = 'right';
let currPos: Position = { row: 0, col: 0 };

const canMove = (nextPos: Position): boolean => {
    return (map2D[nextPos.row][nextPos.col] !== '#');
}

const hasArrived = (pos: Position): boolean => {
    return (map2D[pos.row][pos.col] === 'E');
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

const getDistinctPositions = (viewedArray: string[][]): number => {
    const distinctPositions = new Set<string>();
    viewedArray.forEach(viewed => {
        viewed.forEach(pos => {
            distinctPositions.add(pos);
        });
    });
    return distinctPositions.size;
}
const findLowestCost = (map2D) => {
    const rows = map2D.length;
    const cols = map2D[0].length;
    let startPos: Position = { row: -1, col: -1 };
    let endPos: Position = { row: -1, col: -1 };
    let bestPaths = 0;
    let pathsFound = 0;
    const viewedArray: string[][] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (map2D[row][col] === 'S') {
                startPos = { row, col };
            } else if (map2D[row][col] === 'E') {
                endPos = { row, col }
            }
        }
    }

    const heap: QueueItem[] = [
        {
            cost: 0,
            pos: startPos,
            dir: 'right',
            viewed: [`[${startPos.row},${startPos.col}]`],
        }
    ];

    const visited = new Map<string, number>();

    while (heap.length > 0) {
        // Faire le déplacement
        heap.sort((a, b) => a.cost - b.cost);
        const currPos = heap.shift();
        const { cost, pos, dir, viewed } = currPos;

        const viewedCopy1 = [...viewed];
        const viewedCopy2 = [...viewed];
        const viewedCopy3 = [...viewed];

        // Si on est arrivé à la fin, on retourne le coût
        if(hasArrived(pos) && (bestPaths === 0 || bestPaths >= cost)) {
            pathsFound++;
            // console.log(`viewed : `+ viewed.toString());
            viewedArray.push(viewedCopy1);
            // console.log(`Path found: ${viewed.toString()}`);
            // console.log(`Arrived at end position: ${pos.row}, ${pos.col} with cost: ${cost}`);
            bestPaths = cost;
            // return cost;
        }

        const key = stateKey(pos, dir);
        if (visited.has(key) && visited.get(key) < cost) continue;
        visited.set(key, cost);

        const nextPos = {
            row: pos.row + directions.get(dir).row,
            col: pos.col + directions.get(dir).col
        };
        
        if (canMove(nextPos)) {
            viewedCopy1.push(`[${nextPos.row},${nextPos.col}]`);
            heap.push({ cost: cost + 1, pos: nextPos, dir, viewed: viewedCopy1 });
        }

        heap.push({ cost: cost + 1000, pos, dir: rotateClockwise(dir),  viewed: viewedCopy2 });
        heap.push({ cost: cost + 1000, pos, dir: rotateClockwise(dir, true),  viewed: viewedCopy3 });
    }

    if( pathsFound > 0) {
        console.log(`Found ${ pathsFound } paths with cost: ${ bestPaths }`);
        const distinctPositions = getDistinctPositions(viewedArray);
        console.log(`Distinct positions viewed: ${ distinctPositions }`);
        return bestPaths; // Return the lowest cost found
    }

    console.log("No path found");
    return -1; // No path found
}

const lowestScore = findLowestCost(map2D);
