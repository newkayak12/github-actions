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
export declare function createSuccessTemplate(context: GitHubContext, options?: TemplateOptions): (Block | KnownBlock)[];
export declare function createErrorTemplate(context: GitHubContext, options?: TemplateOptions): (Block | KnownBlock)[];
export declare function createWarningTemplate(context: GitHubContext, options?: TemplateOptions): (Block | KnownBlock)[];
export declare function createInfoTemplate(context: GitHubContext, options?: TemplateOptions): (Block | KnownBlock)[];
export declare function createDeploymentTemplate(context: GitHubContext, options?: TemplateOptions): (Block | KnownBlock)[];
export declare function getTemplate(templateName: string, context: GitHubContext, options?: TemplateOptions): (Block | KnownBlock)[];
