const fs = require("fs");
const { exec, execSync } = require("child_process");
const { stderr } = require("process");

const eval = (code, lang) => {
	if (lang === "cpp") {
		fs.writeFileSync("./utils/code/eval.cpp", code);
		let childp1
		try {
			childp1 = execSync("g++ ./utils/code/eval.cpp -o ./utils/code/eval.out");
		} catch (err) {
			return err.stderr.toString();
		}

		try {
			let childp2 = execSync("./utils/code/eval.out");
			return childp2.toString();
		}
		catch (err) {
			return err.stderr.toString();
		}
	}
	if (lang === "python") {
		fs.writeFileSync("./Compilation/evall.py", code);
		try {
			let childp2 = execSync("py ./Compilation/evall.py < ./Compilation/input.txt");
			return childp2.toString();
		}
		catch (err) {
			return err.stderr.toString();
		}
	}
	if (lang === "c") {
		fs.writeFileSync("./Compilation/evalC.c", code);
		let childp1;
		try {
			childp1 = execSync("gcc ./Compilation/evalC.c");
		}
		catch (err) {
			return err.stderr.toString();
		}
		try {
			let childp2 = execSync(".\\a.exe < ./Compilation/input.txt");
			return childp2.toString();
		}
		catch (err) {
			return err.stderr.toString();
		}
	}

	if (lang === "javascript") {
		fs.writeFileSync("./Compilation/evalJs.js", code);
		let childp1;
		try {
			childp1 = execSync("node ./Compilation/evaljs.js < ./Compilation/input.txt");
			return childp1.toString();
		}
		catch (err) {
			return err.stderr.toString();
		}
	}
};

module.exports = { eval };