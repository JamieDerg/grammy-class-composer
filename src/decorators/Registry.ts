export const classEntries: ClassEntry[] = [];

export type Constructor = () => void;
export class ClassEntry {
	instance: any;
	classConstructor: Constructor;
	entries: MethodEntry[]

	constructor(instance: any, constructor: Constructor){
		this.instance = instance;
		this.classConstructor = constructor;
		this.entries = [];
	}

	public findEntryByType(type: MethodType): MethodEntry[]{
		return this.entries.filter(entry => entry.type == type);
	}

}

export interface  MethodEntry{
	propertyKey: string;
	query?: string | string[] | RegExp;
	type: MethodType;
}

export interface CommandMethodEntry extends MethodEntry{
	description: string;
}


export enum MethodType {
	COMMAND,
	INLINE,
	AFTER_CONSTRUCT,
	HEARS,
	ON
}

export type Target =  {constructor: Constructor};

export function createOrFindClassEntry(target: Target): ClassEntry{
	let classEntry = classEntries.filter(classInstance => classInstance.constructor == target.constructor)[0];
	if(!classEntry){
		const classInstance = new target.constructor();
		classEntry = new ClassEntry(classInstance, target.constructor);
		classEntries.push(classEntry);

	}
	return classEntry;
}