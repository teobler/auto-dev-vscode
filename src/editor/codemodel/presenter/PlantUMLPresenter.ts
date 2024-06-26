import { CodeFile, CodeFunction, CodeStructure } from "../CodeFile";
import { Presenter } from "./Presenter";

export class PlantUMLPresenter implements Presenter {
	convert(file: CodeFile): string {
		return this.render(file);
	}

	protected render(file: CodeFile): string {
		let plantUmlString = `@startuml\n`;

		// Add package if available
		if (file.package) {
			plantUmlString += `'package ${file.package}\n`;
		}

		// Iterate through imports and add them to the PlantUML string as comments
		file.imports.forEach(importItem => {
			plantUmlString += `'${importItem}\n`;
		});

		// Iterate through classes and convert them to PlantUML syntax
		file.classes.forEach(classItem => {
			plantUmlString += this.convertClassToPlantUml(classItem);
		});

		plantUmlString += `@enduml\n`;
		return plantUmlString;
	}

	private convertClassToPlantUml(classItem: CodeStructure): string {
		let plantUmlString = `class ${classItem.name} {\n`;

		// Iterate through methods and convert them to PlantUML syntax
		classItem.methods.forEach(method => {
			plantUmlString += this.convertFunctionToPlantUml(method, true);
		});

		plantUmlString += `}\n`;
		return plantUmlString;
	}

	private convertFunctionToPlantUml(functionItem: CodeFunction, isMethod: boolean = false): string {
		// FIXME: the space before the string should be calculated based on the nest level
		let plantUmlString = `  ${isMethod ? '+' : ''}${functionItem.name}(`;

		// Iterate through function parameters and convert them to PlantUML syntax
		functionItem.vars.forEach((variable, index) => {
			plantUmlString += `${variable.name}: ${variable.typ}${index !== functionItem.vars.length - 1 ? ', ' : ''}`;
		});

		plantUmlString += `)`;

		// Add return type if present
		if (functionItem.returnType) {
			plantUmlString += `: ${functionItem.returnType}`;
		}

		plantUmlString += `\n`;
		return plantUmlString;
	}
}
