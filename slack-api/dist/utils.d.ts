import { GitHubContext, TokenType, TokenInfo } from './types';
export declare function getGitHubContext(): GitHubContext;
export declare function sanitizeChannel(channel: string): string;
export declare function detectTokenType(token: string): TokenInfo;
export declare function validateToken(token: string, expectedType?: TokenType): TokenInfo;
export declare function validateInputs(inputs: any): TokenInfo;
export declare function parseColor(color?: string): string;
export declare function truncateText(text: string, maxLength?: number): string;
export declare function formatDuration(startTime: Date, endTime?: Date): string;
