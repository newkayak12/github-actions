# Slack Block Kit Notification Action

A GitHub Action to send rich Slack notifications using Block Kit with pre-built templates and custom block support.

## Features

- 🎨 **Rich Block Kit Support**: Send beautiful, interactive Slack messages
- 📋 **Pre-built Templates**: Success, error, warning, info, and deployment templates
- 🔧 **Custom Blocks**: Full support for custom Block Kit JSON
- 🚀 **Easy to Use**: Simple configuration with sensible defaults
- 💪 **TypeScript**: Built with TypeScript for type safety
- 🔗 **GitHub Integration**: Automatic GitHub context integration

## Quick Start

### Basic Usage

#### Bot Token (Recommended)

```yaml
- name: Notify Slack
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    template: 'success'
    title: 'Deployment Successful'
    description: 'Application deployed to production'
```

#### OAuth Token

```yaml
- name: Notify Slack (OAuth)
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_OAUTH_TOKEN }}
    token-type: 'oauth'
    channel: '#deployments'
    template: 'success'
    title: 'Deployment Successful'
    description: 'Application deployed to production'
```

### Custom Blocks

```yaml
- name: Custom Slack Notification
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#general'
    blocks: |
      [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Hello from GitHub Actions!* 👋"
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "View Repository"
              },
              "url": "https://github.com/${{ github.repository }}"
            }
          ]
        }
      ]
```

## Setup

This action supports both **Bot Tokens** and **OAuth Tokens**. Choose the approach that best fits your needs.

### Option 1: Bot Token Setup (Recommended)

#### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Enter app name and select your workspace
4. Go to "OAuth & Permissions" in the sidebar

#### 2. Configure Bot Permissions

Add these OAuth scopes to your **bot**:

- `chat:write` - Send messages as the bot
- `chat:write.public` - Send messages to channels without joining

#### 3. Install App & Get Bot Token

1. Click "Install to Workspace"
2. Copy the **"Bot User OAuth Token"** (starts with `xoxb-`)
3. Add this token to your GitHub repository secrets as `SLACK_BOT_TOKEN`

#### 4. Invite Bot to Channel

Invite your bot to the channel where you want to send notifications:
```
/invite @your-bot-name
```

### Option 2: OAuth Token Setup

#### 1. Create a Slack App (same as above)

Follow steps 1-2 from Bot Token setup.

#### 2. Configure User Permissions

Add these OAuth scopes to your **user**:

- `chat:write` - Send messages as the authenticated user
- `chat:write.public` - Send messages to channels without joining

#### 3. Install App & Get OAuth Token

1. Click "Install to Workspace"
2. Copy the **"User OAuth Token"** (starts with `xoxp-`)
3. Add this token to your GitHub repository secrets as `SLACK_OAUTH_TOKEN`

#### 4. Join Channels

The authenticated user must be a member of the channels where notifications will be sent.

### Key Differences

| Feature | Bot Token (`xoxb-`) | OAuth Token (`xoxp-`) |
|---------|--------------------|-----------------------|
| **Message Author** | Bot user | Authenticated user |
| **Custom Username** | ✅ Supported | ❌ Not supported |
| **Custom Icon** | ✅ Supported | ❌ Not supported |
| **Channel Access** | Needs invitation | User's existing access |
| **Setup Complexity** | Medium | Low |
| **Recommended** | ✅ Yes | For personal use |

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `slack-token` | Slack Token (Bot: xoxb-... or OAuth: xoxp-...) | ✅ | - |
| `token-type` | Token type (`bot`, `oauth`, or `auto`) | ❌ | `auto` |
| `channel` | Slack channel ID or name | ✅ | - |
| `message` | Fallback message text | ❌ | 'GitHub Action notification' |
| `blocks` | Custom Block Kit JSON | ❌ | - |
| `template` | Pre-defined template | ❌ | 'info' |
| `title` | Title for notification | ❌ | - |
| `description` | Description text | ❌ | - |
| `color` | Notification color | ❌ | '#36a64f' |
| `author-name` | Author name | ❌ | - |
| `author-link` | Author link | ❌ | - |
| `author-icon` | Author icon URL | ❌ | - |
| `footer` | Footer text | ❌ | - |
| `footer-icon` | Footer icon URL | ❌ | - |

## Templates

### Available Templates

| Template | Description | Use Case |
|----------|-------------|----------|
| `success` | Green checkmark with success styling | Successful deployments, tests |
| `error` | Red X with error styling and action button | Failed workflows, errors |
| `warning` | Yellow warning with alert styling | Warnings, non-critical issues |
| `info` | Blue info styling | General notifications |
| `deployment` | Rocket icon with deployment details | Deployment notifications |

### Template Examples

#### Success Template
```yaml
- name: Success Notification
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    template: 'success'
    title: '✅ Production Deploy Complete'
    description: 'Version 2.1.0 successfully deployed to production'
```

#### Error Template
```yaml
- name: Error Notification
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#alerts'
    template: 'error'
    title: '❌ Build Failed'
    description: 'Tests failed on main branch'
```

#### Deployment Template
```yaml
- name: Deployment Notification
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    template: 'deployment'
    title: '🚀 Staging Deployment'
    description: 'New features deployed to staging environment'
```

## Advanced Usage

### Conditional Notifications

```yaml
- name: Notify on Failure
  if: failure()
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#alerts'
    template: 'error'
    title: 'Workflow Failed'
    description: 'Check the logs for details'

- name: Notify on Success
  if: success()
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    template: 'success'
    title: 'Deployment Complete'
```

### Multiple Notifications

```yaml
- name: Notify Start
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    template: 'info'
    title: 'Deployment Started'
    description: 'Beginning deployment process...'

# ... your deployment steps ...

- name: Notify Complete
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    template: 'success'
    title: 'Deployment Complete'
    description: 'Successfully deployed to production!'
```

### Complex Custom Blocks

```yaml
- name: Advanced Custom Notification
  uses: newkayak12/github-actions/slack-api@main
  with:
    slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: '#deployments'
    blocks: |
      [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🚀 Production Deployment"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Environment:*\nProduction"
            },
            {
              "type": "mrkdwn", 
              "text": "*Version:*\nv${{ github.sha }}"
            },
            {
              "type": "mrkdwn",
              "text": "*Deployed by:*\n${{ github.actor }}"
            },
            {
              "type": "mrkdwn",
              "text": "*Branch:*\n${{ github.ref_name }}"
            }
          ]
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "View Deployment"
              },
              "url": "https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}",
              "style": "primary"
            },
            {
              "type": "button", 
              "text": {
                "type": "plain_text",
                "text": "View App"
              },
              "url": "https://your-app.com"
            }
          ]
        }
      ]
```

## Outputs

| Output | Description |
|--------|-------------|
| `message-timestamp` | Timestamp of the sent message (for updates/reactions) |

## Development

### Building

```bash
cd slack-api
npm install
npm run build
```

### Testing

```bash
npm test
```

### Local Development

1. Create a `.env` file with your Slack bot token
2. Run the action locally for testing

## Block Kit Builder

Use Slack's [Block Kit Builder](https://app.slack.com/block-kit-builder) to design custom blocks, then copy the JSON to the `blocks` input.

## Troubleshooting

### Common Issues

1. **"channel_not_found" error**
   - Ensure your bot is invited to the channel
   - Use channel ID instead of name for private channels

2. **"invalid_auth" error**
   - Check that your token is valid (starts with `xoxb-` for bot or `xoxp-` for OAuth)
   - Ensure the token has required permissions
   - For OAuth tokens, ensure the user is a member of the target channel

3. **"missing_scope" error**
   - Add required OAuth scopes to your Slack app
   - Reinstall the app after adding scopes

### Getting Channel ID

To get a channel ID:
1. Right-click on the channel in Slack
2. Select "View channel details"
3. Copy the channel ID from the bottom of the modal

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request