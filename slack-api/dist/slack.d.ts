import { SlackNotificationInputs, GitHubContext, SlackBlocks, TokenType } from './types';
export declare class SlackNotifier {
    private client;
    private tokenType;
    constructor(token: string, tokenType: TokenType);
    sendNotification(inputs: SlackNotificationInputs, context: GitHubContext): Promise<string>;
    sendCustomBlockMessage(channel: string, blocks: SlackBlocks, text?: string): Promise<string>;
    updateMessage(channel: string, timestamp: string, blocks: SlackBlocks, text?: string): Promise<void>;
    addReaction(channel: string, timestamp: string, emoji: string): Promise<void>;
}
