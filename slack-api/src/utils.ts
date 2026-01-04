import * as github from '@actions/github';
import { GitHubContext, TokenType, TokenInfo } from './types';

export function getGitHubContext(): GitHubContext {
  const { context } = github;
  
  return {
    actor: context.actor,
    eventName: context.eventName,
    sha: context.sha,
    ref: context.ref,
    workflow: context.workflow,
    job: context.job,
    runId: context.runId.toString(),
    runNumber: context.runNumber.toString(),
    repository: context.payload.repository?.full_name || 'unknown/unknown',
    repositoryUrl: context.payload.repository?.html_url || 'https://github.com',
  };
}

export function sanitizeChannel(channel: string): string {
  // Remove # if present and ensure valid channel format
  return channel.startsWith('#') ? channel : `#${channel}`;
}

export function detectTokenType(token: string): TokenInfo {
  if (token.startsWith('xoxb-')) {
    return {
      type: 'bot',
      isValid: true,
      prefix: 'xoxb-'
    };
  } else if (token.startsWith('xoxp-')) {
    return {
      type: 'oauth',
      isValid: true,
      prefix: 'xoxp-'
    };
  } else {
    return {
      type: 'bot', // default fallback
      isValid: false,
      prefix: token.substring(0, 5)
    };
  }
}

export function validateToken(token: string, expectedType?: TokenType): TokenInfo {
  const tokenInfo = detectTokenType(token);
  
  if (!tokenInfo.isValid) {
    throw new Error(`Invalid Slack token format. Token should start with "xoxb-" (bot) or "xoxp-" (oauth), but got "${tokenInfo.prefix}"`);
  }
  
  if (expectedType && tokenInfo.type !== expectedType) {
    throw new Error(`Expected ${expectedType} token (${expectedType === 'bot' ? 'xoxb-' : 'xoxp-'}) but got ${tokenInfo.type} token (${tokenInfo.prefix})`);
  }
  
  return tokenInfo;
}

export function validateInputs(inputs: any): TokenInfo {
  if (!inputs.slackToken) {
    throw new Error('slack-token is required');
  }
  
  if (!inputs.channel) {
    throw new Error('channel is required');
  }
  
  // Validate token and determine type
  let expectedType: TokenType | undefined;
  if (inputs.tokenType && inputs.tokenType !== 'auto') {
    expectedType = inputs.tokenType as TokenType;
  }
  
  const tokenInfo = validateToken(inputs.slackToken, expectedType);
  
  return tokenInfo;
}

export function parseColor(color?: string): string {
  if (!color) return '#36a64f'; // default green
  
  const colorMap: Record<string, string> = {
    good: '#36a64f',
    warning: '#ffcc00',
    danger: '#ff0000',
    info: '#0099cc',
    success: '#36a64f',
    error: '#ff0000',
  };
  
  return colorMap[color.toLowerCase()] || color;
}

export function truncateText(text: string, maxLength: number = 3000): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function formatDuration(startTime: Date, endTime: Date = new Date()): string {
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);
  
  if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds}s`;
  }
  return `${diffSeconds}s`;
}