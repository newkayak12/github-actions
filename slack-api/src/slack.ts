import { WebClient } from '@slack/web-api';
import { SlackNotificationInputs, GitHubContext, SlackBlocks } from './types';
import { getTemplate } from './templates';

export class SlackNotifier {
  private client: WebClient;

  constructor(token: string) {
    this.client = new WebClient(token);
  }

  async sendNotification(
    inputs: SlackNotificationInputs,
    context: GitHubContext
  ): Promise<string> {
    let blocks: SlackBlocks | undefined;

    // Use custom blocks if provided
    if (inputs.blocks) {
      try {
        blocks = JSON.parse(inputs.blocks);
      } catch (error) {
        throw new Error(`Invalid blocks JSON: ${error}`);
      }
    } 
    // Use template if specified
    else if (inputs.template) {
      const templateOptions = {
        title: inputs.title,
        description: inputs.description,
        color: inputs.color,
        authorName: inputs.authorName,
        authorLink: inputs.authorLink,
        authorIcon: inputs.authorIcon,
        footer: inputs.footer,
        footerIcon: inputs.footerIcon,
      };
      
      blocks = getTemplate(inputs.template, context, templateOptions);
    }

    try {
      const result = await this.client.chat.postMessage({
        channel: inputs.channel,
        text: inputs.message || 'GitHub Action notification',
        blocks: blocks,
        username: 'GitHub Actions',
        icon_emoji: ':github:',
      });

      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }

      return result.ts as string;
    } catch (error) {
      throw new Error(`Failed to send Slack message: ${error}`);
    }
  }

  async sendCustomBlockMessage(
    channel: string,
    blocks: SlackBlocks,
    text?: string
  ): Promise<string> {
    try {
      const result = await this.client.chat.postMessage({
        channel,
        text: text || 'Custom notification',
        blocks,
        username: 'GitHub Actions',
        icon_emoji: ':github:',
      });

      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }

      return result.ts as string;
    } catch (error) {
      throw new Error(`Failed to send custom block message: ${error}`);
    }
  }

  async updateMessage(
    channel: string,
    timestamp: string,
    blocks: SlackBlocks,
    text?: string
  ): Promise<void> {
    try {
      const result = await this.client.chat.update({
        channel,
        ts: timestamp,
        text: text || 'Updated notification',
        blocks,
      });

      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }
    } catch (error) {
      throw new Error(`Failed to update Slack message: ${error}`);
    }
  }

  async addReaction(
    channel: string,
    timestamp: string,
    emoji: string
  ): Promise<void> {
    try {
      const result = await this.client.reactions.add({
        channel,
        timestamp,
        name: emoji,
      });

      if (!result.ok) {
        throw new Error(`Slack API error: ${result.error}`);
      }
    } catch (error) {
      throw new Error(`Failed to add reaction: ${error}`);
    }
  }
}