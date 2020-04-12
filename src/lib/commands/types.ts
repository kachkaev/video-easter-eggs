export interface CommandContext {
  logger: Console;
}
export type Command = (context: CommandContext) => Promise<void>;

export class CommandError extends Error {}
