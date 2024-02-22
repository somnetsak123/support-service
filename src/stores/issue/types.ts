import { PaginationResult, Result } from 'src/types';

export interface IssueStats {
  status: Record<IssueStatus, number>;
  category: { id: string; name: string; count: number }[];
}

export enum IssueStatus {
  New = 'new',
  OnGoing = 'ongoing',
  Resolved = 'resolved',
}

export interface Issue {
  id: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  solution: string;
  sla: string | null;
  unreadCount: number;
  lastMessage: string;
  status: IssueStatus;
  category: Omit<IssueCategory, 'createdAt' | 'updatedAt'> | null;
}

export type IssueResponse = PaginationResult<Issue>;

export interface MessageStatus {
  fromUserId: string;
  fromUserName: string;
  lastAccessDate: string;
  issueId: string;
}

export type MessageStatusResponse = Result<MessageStatus[]>;

export interface IssueCategory {
  id: string;
  name: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type IssueCategoryResponse = Result<IssueCategory[]>;

export interface IssueMessage {
  id: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  status: string;
  message: Message[];
}

export type IssueMessageResponse = Result<IssueMessage>;

export interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  issueId: string;
}
