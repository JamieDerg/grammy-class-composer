import { createOrFindClassEntry, MethodType, Target } from "./Registry";

export function Inline(query: string | RegExp = ""):Function {
	return function (target: Target, propertyKey: string) : void {
		const classInstance = createOrFindClassEntry(target);

		if(classInstance == undefined){
			throw "No class Instance found for method: " + propertyKey;
		}
		
		classInstance.entries.push({
			propertyKey: propertyKey,
			query: query,
			type: MethodType.INLINE,
		});
	};
}