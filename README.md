quei# Class Composer
`grammy-class-composer` is a proof of concept Plugin to add a class based Syntax to grammy. <br>
DISCLAIMER this is a proof of concept and will not be developed further, feel free to modify or use this as a springboard for a full pfledged plugin in the future.


# Installation
`npm i grammy-class-composer` <br>
Requires the use of typescript decorators. You activate them by adding the following entry in yout tsconfig.json:
```  JSON
{
    "compilerOptions": {
		"experimentalDecorators": true,
	}
}
```

# Use
## ClassComposer
The ClassComposer is the heart of this Plugin, it will allow you to create classes with a decorator based syntax, to Express grammy functionalities. 
Those classes can be in multiple Files, folders and so on.
The ClassComposer must be registered as follows: 

``` Typescript
import { Bot, Context } from "grammy";
import { ClassComposer } from "grammy-class-composer";

const bot = new Bot<Context>("BOT TOKEN");

/*
First parameter is an Array of glob patterns, 
every file found by these patterns will be scanned for decorators.
Second parameter sets devMode on, prints extra information
*/
const classComposer = new ClassComposer<Context>(["out/**/queries/*Queries*.js"], true);

bot.use(classComposer);

bot.start();
```

In this Example the Class composer will scan every JS file that contains the string "Queries" in it and is located in any "queries" folder. <br> IMPORTANT: The classes MUST be exported in order for this to work e.g:

```Typescript
export class testQueries{...}
```

## Decorators
Decorators are used to mark Methods in classes as Middleware, every Method has access to that middlewares `ctx` and `next` parameter. `ctx` will always be the First parameter, and `next` the second.
### Command decorator
```Typescript
export class CommandQueries{
	//First Decorator parameter is the command name, can either be a single String or an Array
	//Second parameter is the command description.
	//Equals out to Bot.command("help", (ctx,next) => ctx.reply("Use Google"))
	@Command("help", "displays helpfull information")
	public displayHelp(ctx, next){
		ctx.reply("Use Google");
	}	
}
```
The commands description is optional, if it gets left emtpy no BotCommand object will be created for that specific command.

You can register the resulting BotCommand objects as follows:
```Typescript
bot.api.setMyCommands(classComposer.BotCommands);
```

### Inline decorator
```Typescript
export class InlineQueries{
	//Decorator parameter can either be a string or a regex
	//is equal to Bot.inlineQuery("help", (ctx,next)=> ctx.answerInlineQuery([{...}]))
	@Inline(/dog/)
	public dogQuery(ctx, next){
		ctx.answerInlineQuery([{
			type: "article",
			id: "1",
			title:"dog goes: ",
			input_message_content: "woof"
		}]);
	}
}
```


### Hears
```Typescript
export HearsQueries(){ 
	//is equal to Bot.hears("hello", (ctx,next) => ctx.reply("Hey, how's it goin?"))
	@Hears("Hello")
	public hearsTest(ctx, next){
		ctx.reply("Hey, how's it goin?");
	}
}
```

### On
```Typescript
export HearsQueries(){ 
	//is equal to Bot.On("message::spoiler", (ctx,next) => ctx.reply("allright keep your secrets"))
	@On("message::spoiler")
	public hearsSpoiler(ctx, next){
		ctx.reply("allright keep your secrets");
	}
}
```


### AfterConstruct
The Decorated Method will be run immediatly after the corresponding class has been registered. Any method Decorated with this decorator will have direct acces to the corresponding  ClassComposer instance via its first method parameter:

```Typescript
class afterConstructExample{
	@AfterConstruct()
	public afterConstruct(composer: ClassComposer<Context>){
		composer.command("start", ctx => ctx.reply("Heya, im a bot with no usable functionality!"));
	}
}
```






