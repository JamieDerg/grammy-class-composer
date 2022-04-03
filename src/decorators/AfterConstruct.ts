/* eslint-disable @typescript-eslint/ban-types */
import { createOrFindClassEntry, MethodType } from "./Registry";

export function AfterConstruct():Function {
	return function (target:  {constructor: () => void}, propertyKey: string) : void {
		const classInstance = createOrFindClassEntry(target);
		if(classInstance == undefined){
			throw "No class Instance found for method: " + propertyKey;
		}
		
		classInstance.entries.push({
			propertyKey,
			type: MethodType.AFTER_CONSTRUCT
		})

	};
}
