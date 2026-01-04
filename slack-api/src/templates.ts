import { Block, KnownBlock } from '@slack/web-api';
import { GitHubContext } from './types';

export interface TemplateOptions {
  title?: string;
  description?: string;
  color?: string;
  authorName?: string;
  authorLink?: string;
  authorIcon?: string;
  footer?: string;
  footerIcon?: string;
}

export function createSuccessTemplate(
  context: GitHubContext,
  options: TemplateOptions = {}
): (Block | KnownBlock)[] {
  const title = options.title || '✅ Success';
  const description = options.description || `Workflow ${context.workflow} completed successfully`;
  
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${title}*\n${description}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `🔗 <${context.repositoryUrl}|${context.repository}> • 🌿 ${context.ref} • 👤 ${context.actor}`
        }
      ]
    }
  ];
}

export function createErrorTemplate(
  context: GitHubContext,
  options: TemplateOptions = {}
): (Block | KnownBlock)[] {
  const title = options.title || '❌ Error';
  const description = options.description || `Workflow ${context.workflow} failed`;
  
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${title}*\n${description}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `🔗 <${context.repositoryUrl}|${context.repository}> • 🌿 ${context.ref} • 👤 ${context.actor}`
        }
      ]
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View Logs'
          },
          url: `https://github.com/${context.repository}/actions/runs/${context.runId}`,
          style: 'danger'
        }
      ]
    }
  ];
}

export function createWarningTemplate(
  context: GitHubContext,
  options: TemplateOptions = {}
): (Block | KnownBlock)[] {
  const title = options.title || '⚠️ Warning';
  const description = options.description || `Workflow ${context.workflow} completed with warnings`;
  
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${title}*\n${description}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `🔗 <${context.repositoryUrl}|${context.repository}> • 🌿 ${context.ref} • 👤 ${context.actor}`
        }
      ]
    }
  ];
}

export function createInfoTemplate(
  context: GitHubContext,
  options: TemplateOptions = {}
): (Block | KnownBlock)[] {
  const title = options.title || 'ℹ️ Info';
  const description = options.description || `Workflow ${context.workflow} notification`;
  
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${title}*\n${description}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `🔗 <${context.repositoryUrl}|${context.repository}> • 🌿 ${context.ref} • 👤 ${context.actor}`
        }
      ]
    }
  ];
}

export function createDeploymentTemplate(
  context: GitHubContext,
  options: TemplateOptions = {}
): (Block | KnownBlock)[] {
  const title = options.title || '🚀 Deployment';
  const description = options.description || `Deployment from ${context.ref}`;
  
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${title}*\n${description}`
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Repository:*\n<${context.repositoryUrl}|${context.repository}>`
        },
        {
          type: 'mrkdwn',
          text: `*Branch:*\n${context.ref}`
        },
        {
          type: 'mrkdwn',
          text: `*Commit:*\n\`${context.sha.substring(0, 7)}\``
        },
        {
          type: 'mrkdwn',
          text: `*Deployed by:*\n${context.actor}`
        }
      ]
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View Deployment'
          },
          url: `https://github.com/${context.repository}/actions/runs/${context.runId}`,
          style: 'primary'
        }
      ]
    }
  ];
}

export function getTemplate(
  templateName: string,
  context: GitHubContext,
  options: TemplateOptions = {}
): (Block | KnownBlock)[] {
  switch (templateName) {
    case 'success':
      return createSuccessTemplate(context, options);
    case 'error':
      return createErrorTemplate(context, options);
    case 'warning':
      return createWarningTemplate(context, options);
    case 'deployment':
      return createDeploymentTemplate(context, options);
    case 'info':
    default:
      return createInfoTemplate(context, options);
  }
}