/* eslint-disable @typescript-eslint/ban-types */

import { createOrFindClassEntry, CommandMethodEntry, MethodType } from "./Registry";

export function Command(query: string | string[], description = ""):Function {
	return function (target:  {constructor: () => void}, propertyKey: string) : void {
		const classInstance = createOrFindClassEntry(target);
		if(classInstance == undefined){
			throw "No class Instance found for method: " + propertyKey;
		}

		classInstance.entries.push({
			propertyKey,
			query,
			type: MethodType.COMMAND,
			description,
		} as CommandMethodEntry);
	
	};
}