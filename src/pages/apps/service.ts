import {
  AppListResult,
  ChangeFavoriteReq,
  FavoriteAppListResult,
  GetFavoritesReq,
} from '@/pages/apps/data';
import { request } from '@umijs/max';

// 登出接口
export async function listAPP() {
  return request<AppListResult>('/api/acc/apps/list/', {
    method: 'GET',
  });
}

// 查询收藏
export async function getFavorites(params: GetFavoritesReq) {
  return request<FavoriteAppListResult>('/api/p/v4/favorites/', {
    params,
  });
}

// 修改收藏（包含添加和删除）
export async function changeFavorites(body: ChangeFavoriteReq) {
  return request<AppListResult>('/api/p/v4/favorites/', {
    method: 'POST',
    data: body,
  });
}
