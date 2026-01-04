import { Block, KnownBlock } from '@slack/web-api';

export interface SlackNotificationInputs {
  slackBotToken: string;
  channel: string;
  message?: string;
  blocks?: string;
  template?: 'success' | 'error' | 'warning' | 'info' | 'deployment';
  title?: string;
  description?: string;
  color?: string;
  authorName?: string;
  authorLink?: string;
  authorIcon?: string;
  footer?: string;
  footerIcon?: string;
}

export interface GitHubContext {
  actor: string;
  eventName: string;
  sha: string;
  ref: string;
  workflow: string;
  job: string;
  runId: string;
  runNumber: string;
  repository: string;
  repositoryUrl: string;
}

export type SlackBlocks = (Block | KnownBlock)[];