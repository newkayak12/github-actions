import { WebClient, ChatPostMessageArguments } from '@slack/web-api';
import { SlackNotificationInputs, GitHubContext, SlackBlocks, TokenType } from './types';
import { getTemplate } from './templates';

export class SlackNotifier {
  private client: WebClient;
  private tokenType: TokenType;

  constructor(token: string, tokenType: TokenType) {
    this.client = new WebClient(token);
    this.tokenType = tokenType;
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
      // Configure message options based on token type
      const messageOptions: ChatPostMessageArguments = {
        channel: inputs.channel,
        text: inputs.message || 'GitHub Action notification',
        blocks: blocks,
      };

      // Bot tokens can set username and icon, OAuth tokens use the authenticated user
      if (this.tokenType === 'bot') {
        messageOptions.username = 'GitHub Actions';
        messageOptions.icon_emoji = ':github:';
      }

      const result = await this.client.chat.postMessage(messageOptions);

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
      const messageOptions: ChatPostMessageArguments = {
        channel,
        text: text || 'Custom notification',
        blocks,
      };

      // Bot tokens can set username and icon, OAuth tokens use the authenticated user
      if (this.tokenType === 'bot') {
        messageOptions.username = 'GitHub Actions';
        messageOptions.icon_emoji = ':github:';
      }

      const result = await this.client.chat.postMessage(messageOptions);

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