import fs from 'fs';

const input = fs.readFileSync('./09/input.txt').toString();

class BlockFile {
	position: number;
	constructor(public id: number, public size: number) {
	}

	toString() {
		return `[${this.id}, ${this.position}, ${this.size}]`;
	}
}

class FreeSpace extends BlockFile {
	position: number;
	constructor(public id: number, public size: number) {
		super(id, size);
	}
}

class Disk {
	blockFiles: BlockFile[] = [];
	freeSpaces: FreeSpace[] = [];
	diskMap: string[] = [];
	constructor(public input: string) {
		this.initalizeFilesAndFreeBlocks(input);
		this.createDiskMap();
	}

	initalizeFilesAndFreeBlocks = (input) => {
		const inputIte = [...input].entries();
		for(const [i, digit] of inputIte) {
			if(i % 2 === 0) {
				this.blockFiles.push(new BlockFile(this.blockFiles.length, Number(digit)));
			}
			else {
				this.freeSpaces.push(new FreeSpace(this.freeSpaces.length, Number(digit)));
			}
		}
	}

	createDiskMap() {
		this.diskMap = this.blockFiles.reduce((acc, cur, i) => {
			let blockPart = new Array(cur.size).fill(cur.id);
			let freePart = [];
			if(i < this.freeSpaces.length) {
				freePart = new Array(this.freeSpaces[i].size).fill('.');
				this.freeSpaces[i].position = acc.length + blockPart.length;
			}
			cur.position = acc.length;
			return [...acc, ...blockPart, ...freePart];
		}, []);
	}

	leftmostFreeSpaceIndex() {
		return this.diskMap.indexOf('.');
	}
	compactingFiles() {
		for(let i = this.diskMap.length - 1; i >= 0; i--) {
			if(this.diskMap[i] !== '.') {
				const tmpFile = this.diskMap[i];
				this.diskMap[i] = '.';
				this.diskMap[this.leftmostFreeSpaceIndex()] = tmpFile;
			}
		}
	}

	leftmostFreeSpaceBlockIndex(blockPos: number, blockSize: number) {
		return this.freeSpaces.find((freeSpace) => freeSpace.size >= blockSize && freeSpace.position < blockPos);
	}

	moveBlockToFreeSpace = (block: BlockFile, freeSpace: FreeSpace) => {
		this.diskMap.splice(freeSpace.position, block.size, ...(new Array(block.size).fill(block.id)))
		this.diskMap.splice(block.position, block.size, ...(new Array(block.size).fill('.')))
		const tmpBlockPos = block.position;
		block.position = freeSpace.position;
		if(freeSpace.size === block.size) {
			freeSpace.position = tmpBlockPos;
		} else {
			freeSpace.position = freeSpace.position + block.size;
			freeSpace.size = freeSpace.size - block.size;
		}
	}

	upgradedCompactingFiles() {
		for(let i = this.blockFiles.length - 1; i >= 0; i--) {
			const tmpBlock = this.blockFiles[i];
			const leftmostFreeSpaceBlock = this.leftmostFreeSpaceBlockIndex(tmpBlock.position, tmpBlock.size);
			if(!leftmostFreeSpaceBlock) continue;
			this.moveBlockToFreeSpace(tmpBlock, leftmostFreeSpaceBlock);
		}
	}

	toString() {
		return this.diskMap.join('');
	}
}

const disk = new Disk(input);
disk.upgradedCompactingFiles();

const filesystemChecksum = disk.diskMap.reduce((acc, cur, i) => {
	if(cur === '.') return acc;
	return acc + (Number(cur) * i);
}, 0);

console.log({filesystemChecksum});
