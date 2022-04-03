import {Composer, Context, FilterQuery } from "grammy";
import { BotCommand } from "grammy/out/platform.node";
import { glob, IOptions } from "glob";
import { classEntries, ClassEntry, CommandMethodEntry, MethodEntry, MethodType } from "../decorators";


export class ClassComposer<T extends Context> extends Composer<T>{
	private botCommands: BotCommand[];
	constructor(patterns: string[], devMode = false){
		super();
		this.botCommands = [];
		this.registerClasses(patterns);
		this.populateComposers();

	}

	private populateComposers(){
		classEntries.forEach(entry => {	
			entry.findEntryByType(MethodType.AFTER_CONSTRUCT).forEach( afterConstructEntry => entry.instance[afterConstructEntry.propertyKey](this));
			entry.entries.forEach(methodEntry => {
				const {query, propertyKey} = methodEntry;
				switch(methodEntry.type){
					case MethodType.COMMAND:
						this.handleCommandCase(entry, methodEntry as CommandMethodEntry, this);
						break;
					case MethodType.INLINE:
						this.inlineQuery(query, (ctx, next) => entry.instance[propertyKey](ctx,next));
						break;
					case MethodType.HEARS:
						this.hears(query, (ctx, next) => entry.instance[propertyKey](ctx,next));
						break;
					case MethodType.ON:
						this.on(query as FilterQuery, (ctx, next) => entry.instance[propertyKey](ctx,next))
					break;

				}
			})
		})
	}

	private handleCommandCase(entry: ClassEntry, methodEntry: CommandMethodEntry, composer: Composer<T>){
		const {query, description} = methodEntry;

		composer.command(query as string | string[], (ctx, next) => entry.instance[methodEntry.propertyKey](ctx,next));
		
		if(description.length == 0) return;

		if(!Array.isArray(query)){
			this.botCommands.push({
				command: `${query}`,
				description: description
			});
			return;
		}

		(query as string[]).forEach(commandName => {
			this.botCommands.push({
				command: `${commandName}`,
				description: description
			});
		})
	}

	private registerClasses(patterns: string[], options: IOptions = {}){
		const files: string[] = [];
		
		patterns.forEach(pattern => files.push(...glob.sync(pattern,options)));

		const workingDirectory = options.cwd ? options.cwd : process.cwd();
		files.forEach(file => {
			require(`${workingDirectory}/${file}`);
		});	
	}

	get BotCommands(): BotCommand[]{
		return this.botCommands;
	}

}

