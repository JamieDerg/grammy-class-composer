import { createOrFindClassEntry, MethodType } from "./Registry";

export function Hears(query: string):Function {
	return function (target:  {constructor: () => void}, propertyKey: string) : void {
		const classInstance = createOrFindClassEntry(target);
		if(classInstance == undefined){
			throw "No class Instance found for method: " + propertyKey;
		}

		classInstance.entries.push({
			propertyKey,
			query,
			type: MethodType.HEARS,
		});
	
	};
}