import fs from "fs";

let inputTextName = "input";
const args = process.argv.slice(2);
if (args.length > 0) {
	inputTextName = args[0];
}

const input = fs.readFileSync(`./12/${inputTextName}.txt`).toString();
