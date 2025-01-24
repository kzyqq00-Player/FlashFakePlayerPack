import type { Player, Vector3 } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";

export interface CommandInfo {
    args: string[],
    entity?: Player,
    location?: Vector3,
    isEntity?: boolean,
    sim?: SimulatedPlayer
}
export interface CommandInfoNoArgs extends Omit<CommandInfo, "args"> {}

export class CommandError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandError";
    }
}

export class InvalidInputError extends CommandError {
    constructor(input: string) {
        super(`Invalid input: ${input}`);
        this.name = "InvalidInputError";
    }
}

export class CommandAlreadyExistsError extends CommandError {
    constructor(commandName: string) {
        super(`Command ${commandName} already exists`);
        this.name = "CommandAlreadyExistsError";
    }
}

export class CommandNotFoundError extends CommandError {
    constructor(commandName: string) {
        super(`Command ${commandName} not found`);
        this.name = "CommandNotFoundError";
    }
}

type CommandHandler = (cmdInfo: CommandInfo) => void;

// Parse command
/**
 * 解析命令字符串。
 *
 * @param input - 需要解析的命令输入字符串。
 * @returns 返回一个包含命令前缀和参数数组的对象。
 * @throws {InvalidInputError} 当输入无效时抛出异常。
 *
 * @example
 * ```typescript
 * > commandParse("say player 'Hello World'");
 * { prefix: 'say', args: [ 'player', 'Hello World' ] }
 * ```
 */
export function commandParse(input: string): { prefix: string; args: string[] } {
    const regex = /"([^"]*)"|'([^']*)'|(\S+)/g; // 正则匹配所有单词或引号内的文本
    const parts = [];
    let match: RegExpMatchArray | null;

    while (match = regex.exec(input)) {
        // 将捕获组中的内容添加到结果数组中
        parts.push(match[1] ?? match[2] ?? match[3]);
    }

    if (parts.length === 0)
        throw new InvalidInputError(input);

    // 性能略差于 const prefix = parts.shift(); 但可读性更佳
    const [prefix, ...args] = parts;
    return { prefix, args };
}

// const command = 'cmdHead arg1  "arg2" "arg3" \"_arg4\" 7 8 ~-5 ';
// const tokens = commandParse(command);
// console.log(tokens);
// tokens => [ 'cmdHead', 'arg1', 'arg2', 'arg3', '_arg4', '7', '8', '~-5' ]

class CommandManager {
    private commandParse = commandParse
    private commandMap: Map<string, Command> = new Map();

    /**
     * 注册命令实例。
     * 
     * @param prefixes - 触发该命令的前缀字符串或字符串数组。
     * @param command - 要注册的命令对象。
     * 
     * @throws {CommandAlreadyExistsError} 当给定的前缀已被注册时会抛出错误。
     * 
     * @example
     * ```typescript
     * registerCommand(['假人生成', '假人创建'], spawn);
     * ```
     */
    registerCommand(prefixes: string | string[], command: Command): void {
        const prefixesArray = Array.isArray(prefixes) ? prefixes : [prefixes];

        for (const prefix of prefixesArray) {
            if (this.commandMap.has(prefix)) {
                throw new CommandAlreadyExistsError(prefix);
            }
            this.commandMap.set(prefix, command);
        }
    }

    /**
     * 执行指定命令
     * 
     * @param prefix 命令前缀。
     * @param args 命令参数。
     * @param commandInfoNoArgs 命令信息。
     * 
     * @throws {CommandNotFoundError} 如果命令不存在。
     */
    executeCommand(prefix: string, args: string[], commandInfoNoArgs: CommandInfoNoArgs): void {
        const command = this.commandMap.get(prefix);
        if (!command)
            throw new CommandNotFoundError(prefix);

        // ding~
        // 都有?.了你还用&&
        commandInfoNoArgs?.entity?.playSound?.('random.levelup', { pitch: 8 + Math.floor(Math.random() * 12) })

        command.execute({ args, ...commandInfoNoArgs });
    }

    /**
     * 处理字符串命令并执行。
     * 
     * @param commandString - 要执行的完整命令字符串。
     * @param commandInfoNoArgs - 命令信息。
     * 
     * @throws {CommandNotFoundError} 如果命令不存在。
     * 
     * 该方法首先解析命令字符串，提取命令前缀和参数数组，
     * 然后将这些信息用于执行相应的命令。
     */
    execute(commandString: string, commandInfoNoArgs?: CommandInfoNoArgs): void {
        const { prefix, args } = this.commandParse(commandString);

        this.executeCommand(prefix, args, commandInfoNoArgs);
    }

    /**
     * 获取已注册的所有命令前缀。
     * 
     * @returns 返回一个字符串数组，包含所有已注册的命令前缀。
     */
    listRegisteredPrefixes(): string[] {
        return Array.from(this.commandMap.keys())
    }
}

// 导出实例（单例模式）
export const commandManager = new CommandManager();

export class Command {
    private conditionsHandlers: Map<Function, Function[]> = new Map();

    /**
     * 注册命令处理回调。
     * 
     * @param handler 注册的命令 handler，接受命令信息对象。
     */
    register(handler: CommandHandler): void;

    /**
     * 注册有条件约束的命令处理回调。
     * 用于实现命令的分支或重载。
     * 
     * @param condition 条件回调，接受命令信息对象，返回一个布尔值，仅当返回布尔值为 true 时才会执行对应的 handler。
     * @param handler 命令处理回调，接受命令信息对象。
     */
    register(condition: (commandInfo: CommandInfo) => boolean, handler: CommandHandler): void;
    register(conditionOrHandler: (commandInfo: CommandInfo) => any, handler?: CommandHandler): void {
        let condition: (commandInfo: CommandInfo) => boolean;
        if (handler)
            condition = conditionOrHandler;
        else {
            handler = conditionOrHandler;

            // 如果未提供 condition, 使用永真条件
            condition = () => true;
        }

        if (!this.conditionsHandlers.has(condition))
            this.conditionsHandlers.set(condition, []);

        this.conditionsHandlers.get(condition).push(handler);
    }

    /**
     * 执行命令。
     * 
     * @param commandInfo 命令信息对象。
     * 
     * @description
     * 按命令注册先后顺序，
     * 只有第一个满足条件的 handler 会被执行。

     */
    execute(commandInfo: CommandInfo): void {
        for (const [condition, handlers] of this.conditionsHandlers)
            if (condition(commandInfo)) {
                handlers.forEach(handler => handler(commandInfo));

                // 只执行首个条件满足的 handler
                break;
            }
    }
}
// const {executeCommand, registerCommand, removeCommand} = new CommandRegistry();

// create a CommandRegistry object
// const commandRegistry: CommandRegistry = new CommandRegistry();

// Registry command
// function sayHello({args:string[],entity:Entity|Player|Dimension,location?:Vector3,isEntity:boolean,commandName:string}) {
//         entity.sendMessage(`Hello, ${args}!`);
// }
//
// function sayGoodbye(name) {
//         console.log(`Goodbye, ${name}!`);
// }
//
// commandRegistry.registerCommand('hello', sayHello);
// commandRegistry.registerAlias('hi', 'hello');
// commandRegistry.registerCommand('goodbye', sayGoodbye);
//
// Execute command
// commandRegistry.executeCommand('hello', {args:string[],entity:Entity|Player|Dimension,location?:Vector3,isEntity:boolean,commandName:string}); // 输出：Hello, Alice!
// commandRegistry.executeCommand('goodbye', {args:string[],entity:Entity|Player|Dimension,location?:Vector3,isEntity:boolean,commandName:string});   // 输出：Goodbye, Bob!
//
// Removed command
// commandRegistry.removeCommand('hello', sayHello);
//
// try ti execute the command again
// commandRegistry.executeCommand('hello', {args:string[],entity:Entity|Player|Dimension,location?:Vector3,isEntity:boolean,commandName:string});     // 不会有任何输出，因为已经移除了 sayHello 回调
