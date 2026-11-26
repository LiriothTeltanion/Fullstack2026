export interface User {
  id: number;
  username: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  author: User;
  contributors: (User & { contributionId?: number })[];
  createdAt: string;
  updatedAt: string;
}

export interface StoryComment {
  id: number;
  storyId: number;
  author: User;
  body: string;
  createdAt: string;
}

export interface CommentSettings {
  supported: boolean;
  commentsOpen: boolean;
  canChange: boolean;
}
