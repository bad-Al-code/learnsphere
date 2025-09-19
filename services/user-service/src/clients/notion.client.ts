import { Client } from '@notionhq/client';
import type {
  CreatePageParameters,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

import logger from '../config/logger';

export interface CourseHubData {
  course: {
    title: string;
    modules: {
      title: string;
      lessons: { title: string }[];
    }[];
  };
  notes: { title: string; content: string | null }[];
  findings: { title: string; source: string | null; url: string | null }[];
}

export class NotionClient {
  private notion: Client;

  /**
   * Create a Notion client.
   * @param authToken Notion integration token or OAuth access token
   */
  constructor(authToken: string) {
    this.notion = new Client({ auth: authToken });
  }

  /**
   * Create a "Course Hub" page in the user's workspace containing:
   * - Course Outline (modules as toggles, lessons as bulleted items)
   * - Notes (heading + paragraph)
   * - Research findings (bulleted list with optional link)
   *
   * Uses CreatePageParameters['children'] to type the page children payload.
   *
   * @param data Aggregated course+notes+findings data
   * @returns The URL of the created Notion page
   * @throws If no accessible page is found or the Notion API returns an error
   */
  public async createCourseHubPage(data: CourseHubData): Promise<string> {
    logger.info(`Creating Notion page for course: ${data.course.title}`);

    const searchResponse = await this.notion.search({
      filter: { value: 'page', property: 'object' },
      page_size: 1,
    });

    if (searchResponse.results.length === 0) {
      throw new Error("No accessible pages found in user's Notion workspace.");
    }
    const parentPage = searchResponse.results[0] as PageObjectResponse;

    const children = [
      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'Course Outline' } }],
        },
      },

      ...data.course.modules.map((module) => ({
        type: 'toggle',
        toggle: {
          rich_text: [{ type: 'text', text: { content: module.title } }],
          children: module.lessons.map((lesson) => ({
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: [{ type: 'text', text: { content: lesson.title } }],
            },
          })),
        },
      })),

      { type: 'divider', divider: {} },

      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'My Smart Notes' } }],
        },
      },

      ...data.notes.flatMap((note) => [
        {
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: note.title } }],
          },
        },

        {
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: note.content ?? 'No content.' },
              },
            ],
          },
        },
      ]),

      { type: 'divider', divider: {} },

      {
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: 'My Research Board' } }],
        },
      },
      ...data.findings.map((finding) => ({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${finding.title} (${finding.source ?? 'N/A'})`,
                link: finding.url ? { url: finding.url } : null,
              },
            },
          ],
        },
      })),
    ] as unknown as CreatePageParameters['children'];

    const properties: CreatePageParameters['properties'] = {
      title: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: `LearnSphere Course Hub: ${data.course.title}`,
            },
          },
        ],
      },
    };

    const pageResponse = await this.notion.pages.create({
      parent: { page_id: parentPage.id },
      properties,
      children,
    });

    return (pageResponse as PageObjectResponse).url;
  }
}
