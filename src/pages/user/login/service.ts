import { request } from '@umijs/max';
import { FeishuAppIdResult, UserLoginRequest, UserLoginResult } from './data';

/** 登录接口 */
export async function login(body: UserLoginRequest) {
  return request<UserLoginResult>('/api/acc/login/05/', {
    // return request<UserLoginResult>('/api/acc/login/05/', {
    method: 'POST',
    data: body,
  });
}

// 登出接口
export async function logout() {
  return request('/api/acc/logout/', {
    method: 'POST',
  });
}

/** 获取飞书appId */
export async function getFeishuAppId() {
  return request<FeishuAppIdResult>('/api/acc/conf/', {
    method: 'GET',
  });
}
