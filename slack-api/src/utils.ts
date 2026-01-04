import { GitHubContext } from './types';

export function getGitHubContext(): GitHubContext {
  const github = require('@actions/github');
  const context = github.context;
  
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

export function validateInputs(inputs: any): void {
  if (!inputs.slackBotToken) {
    throw new Error('slack-bot-token is required');
  }
  
  if (!inputs.channel) {
    throw new Error('channel is required');
  }
  
  if (!inputs.slackBotToken.startsWith('xoxb-')) {
    throw new Error('Invalid Slack bot token format. Token should start with "xoxb-"');
  }
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