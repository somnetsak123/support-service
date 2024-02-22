import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from 'boot/axios';

import type {
  IssueStats,
  IssueStatus,
  IssueResponse,
  IssueCategoryResponse,
} from './types';

export const useIssueStore = defineStore('issue-store', () => {
  const issue = ref<IssueResponse>();
  const issueStats = ref<IssueStats>();
  const issueCategory = ref<IssueCategoryResponse>();

  async function fetchIssueStats() {
    const res = await api.get<IssueStats>('/api/v1/support/stats');
    if (res && res.status === 200) {
      issueStats.value = res.data;
    }
  }

  async function fetchIssue(opts?: {
    page?: number;
    pageSize?: number;
    userId?: string;
    categoryId?: string;
    search?: string;
  }) {
    const query = new URLSearchParams({
      ...opts,
      page: `${opts?.page ?? 1}`,
      pageSize: `${opts?.pageSize ?? 30}`,
    }).toString();
    const res = await api.get<IssueResponse>(
      `/api/v1/support/issue${query.length > 0 ? `?${query}` : ''}`,
    );
    if (res && res.status === 200) {
      issue.value = res.data;
    }
  }

  async function createIssue(issue: {
    title: string;
    description: string;
    categoryId: string;
  }) {
    const res = await api.post('/api/v1/support/issue', issue);
    if (res && res.status === 204) return true;
    return false;
  }

  async function editIssue(
    id: string,
    data: {
      title?: string;
      categoryId?: string | null;
      solution?: string;
      sla?: string | null | Date;
      status?: IssueStatus;
    },
  ) {
    const res = await api.patch(`/api/v1/support/issue/${id}`, data);
    if (res) return true;
    return false;
  }

  async function fetchIssueCategory() {
    const res = await api.get<IssueCategoryResponse>(
      '/api/v1/support/issue-category',
    );
    if (res && res.status === 200) {
      issueCategory.value = res.data;
    }
  }

  async function createIssueCategory(issueCategory: { name: string }) {
    const res = await api.post('/api/v1/support/issue-category', issueCategory);
    if (res && res.status === 204) return true;
    return false;
  }

  const selectedIssueId = ref<string>();
  const selectedIssueCateId = ref<string>();

  return {
    issue,
    fetchIssue,
    createIssue,
    editIssue,

    issueStats,
    fetchIssueStats,

    issueCategory,
    fetchIssueCategory,
    createIssueCategory,

    selectedIssueId,
    selectedIssueCateId,
  };
});
