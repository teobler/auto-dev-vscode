import { GradleTooling } from "./GradleTooling";
import { channel } from "../../channel";

export class ToolingDetector {
	async execute() {
		let deps = await new GradleTooling().findDeps();
		channel.append("Detected dependencies: " + JSON.stringify(deps) + "\n");
		return deps;
	}
}