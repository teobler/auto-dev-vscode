/**
 * PostCodeProcessor is a class that processes code by adding or removing indentation and unnecessary braces.
 * It is designed to format code in a way that improves readability and adheres to a consistent style.
 *
 * @class PostCodeProcessor
 * @example
 * const processor = new PostCodeProcessor("prefix", "suffix", "code to process");
 * const formattedCode = processor.execute();
 *
 * @param {string} prefixCode The prefix code to be added before the processed code.
 * @param {string} suffixCode The suffix code to be added after the processed code.
 * @param {string} completeCode The complete code that needs to be processed.
 * @param {number} [indentSize=4] The size of the indentation, in spaces.
 */
export class PostCodeProcessor {
	private prefixCode: string;
	private suffixCode: string;
	private completeCode: string;
	private indentSize: number;
	private indent: string;
	private methodDeclLine: RegExp;

	constructor(prefixCode: string, suffixCode: string, completeCode: string, indentSize: number = 4) {
		this.prefixCode = prefixCode;
		this.suffixCode = suffixCode;
		this.completeCode = completeCode;
		this.indentSize = indentSize;
		this.indent = " ".repeat(indentSize);
		this.methodDeclLine = /^(?:^|\s+)(?:@[A-Z]\w+|(?:(?:public|private|protected)\s+)?.*\{)/;
	}

	// todo: find a better way to format code
	execute(): string {
		if (this.completeCode === "") {
			return this.completeCode;
		}

		let lines: string[] = this.completeCode.split("\n");
		const isFirstLineNeedIndent = !this.prefixCode.endsWith(this.indent);

		if (this.methodDeclLine.test(lines[0])) {
			if (isFirstLineNeedIndent && lines[0].startsWith(this.indent)) {
				lines[0] = lines[0].substring(this.indent.length);
			}
		}

		// if lastLine not indented, indent all lines
		if (!lines[lines.length - 1].startsWith(this.indent)) {
			lines = lines.map(line => this.indent + line);
		}

		let results = lines.join("\n");
		const leftBraceCount = (this.prefixCode + this.completeCode + this.suffixCode).split('{').length - 1;
		const rightBraceCount = (this.prefixCode + this.completeCode + this.suffixCode).split('}').length - 1;

		const reversed = results.split('').reverse();
		let toRemoveBrace = rightBraceCount - leftBraceCount;
		const stringBuilder = [];

		// Loop through the reversed string and remove unnecessary right braces
		for (const char of reversed) {
			if (toRemoveBrace > 0 && (char === '}' || char === '\n' || char === ' ')) {
				if (char === '}') {
					toRemoveBrace--;
				} else {
					stringBuilder.push(char);
				}
			} else {
				stringBuilder.push(char);
			}
		}

		const output = stringBuilder.reverse().join('');

		const regex = /\n\s+\n\s+|\n\s+\n|\n\n\s+/g;
		return output.replace(regex, "\n");
	}
}
