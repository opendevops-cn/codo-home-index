import { GlobalCategoryData, GlobalServiceData } from '@/pages/home/components/GlobalServices';
import { request } from '@umijs/max';
import type { AnalysisData } from './data';

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/fake_analysis_chart_data');
}

/**
 * 通用的获取接口返回数据结构
 */
export type CommonGetApiResonse<T> = {
  code: number;
  count?: number;
  data: T;
  msg: string;
  result?: boolean;
};

export interface ResStepData {
  // stepEntry: StepEntry;
  id: number;
  title: string;
  description: string;
  cards: string;
  faqs: string;
}

/**
 * 获取首页的step数据
 */
export async function getStepList() {
  return request<CommonGetApiResonse<ResStepData[]>>('/api/acc/index-step/');
}

/**
 * 获取首页的全球项目定制服务数据
 */
export async function getServiceList() {
  return request<CommonGetApiResonse<GlobalServiceData[]>>('/api/acc/index-service/');
}

/**
 * 获取首页的全球项目分类数据
 */
export async function getCatetoryList() {
  return request<CommonGetApiResonse<GlobalCategoryData[]>>('/api/acc/index-service-categories/');
}
