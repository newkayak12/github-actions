import * as core from '@actions/core';
import { SlackNotifier } from './slack';
import { SlackNotificationInputs } from './types';
import { getGitHubContext, validateInputs, sanitizeChannel } from './utils';

async function run(): Promise<void> {
  try {
    // Get inputs
    const inputs: SlackNotificationInputs = {
      slackToken: core.getInput('slack-token', { required: true }),
      tokenType: core.getInput('token-type') as any || 'auto',
      channel: core.getInput('channel', { required: true }),
      message: core.getInput('message') || 'GitHub Action notification',
      blocks: core.getInput('blocks'),
      template: core.getInput('template') as any || 'info',
      title: core.getInput('title'),
      description: core.getInput('description'),
      color: core.getInput('color'),
      authorName: core.getInput('author-name'),
      authorLink: core.getInput('author-link'),
      authorIcon: core.getInput('author-icon'),
      footer: core.getInput('footer'),
      footerIcon: core.getInput('footer-icon'),
    };

    // Validate inputs and detect token type
    const tokenInfo = validateInputs(inputs);

    // Sanitize channel
    inputs.channel = sanitizeChannel(inputs.channel);

    // Get GitHub context
    const context = getGitHubContext();

    core.info(`Sending Slack notification to ${inputs.channel}`);
    core.info(`Token type: ${tokenInfo.type} (${tokenInfo.prefix})`);
    core.info(`Template: ${inputs.template}`);
    core.info(`Repository: ${context.repository}`);

    // Create Slack notifier and send message
    const slackNotifier = new SlackNotifier(inputs.slackToken, tokenInfo.type);
    const timestamp = await slackNotifier.sendNotification(inputs, context);

    // Set output
    core.setOutput('message-timestamp', timestamp);
    
    core.info(`✅ Slack notification sent successfully! Message timestamp: ${timestamp}`);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    core.setFailed(`❌ Action failed: ${errorMessage}`);
  }
}

// Export for testing
export { SlackNotifier };
export * from './types';
export * from './templates';
export * from './utils';

// Run the action
void run();