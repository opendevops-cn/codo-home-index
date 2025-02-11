import { ResponseStructure } from '@/requestErrorConfig';

export type UserInfo = {
  username: string; // 用户名
  nickname: string; // 昵称 中文名
  avatar: string; // 头像
  password?: string; // 密码
};

export type UserLoginRequest = {
  username?: string;
  password?: string;
  dynamic?: string;
  login_type?: string;
  c_url?: string;
  // 以下为飞书登录所需参数
  code?: string;
  fs_redirect_uri?: string;
};

type UserLoginResult = ResponseStructure<{
  username: string;
  nickname: string;
  avatar: string;
  // code: number;
  auth_key: string;
  c_url: string;
}>;

type FeishuAppIdResult = ResponseStructure<{
  feishu_client_id: string;
}>;

interface QRLoginOptions {
  id: string;
  goto: string;
  width: string;
  height: string;
  style?: string;
}

interface QRLoginFunction {
  (options: QRLoginOptions): any; // 根据实际返回类型替换 any
}

declare global {
  interface Window {
    QRLogin: QRLoginFunction;
  }
}
