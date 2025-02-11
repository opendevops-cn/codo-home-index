import { ResponseStructure } from '@/requestErrorConfig';

export type Application = {
  id: number; // ID
  app_code: string; // 应用编码（后端用）
  frontend_code: string; // 前端应用编码
  name: string; // 应用名称
  description: string; // 应用描述
  path?: string; // 应用资源加载地址
  group_name?: string; // 分组名称
  href?: string;
  icon?: string;
  img?: string;
  classify?: string; // 分类
  manualUrl?: string;
  create_time?: string;
  update_time?: string;
  img?: string; //背景图
  isFavorite?: boolean;
};

export type FavoriteAppItemDataType = Pick<
  Application,
  'id' | 'app_code' | 'frontend_code' | 'name' | 'href'
>;

export type FavoriteApp = {
  app_code: string;
  frontend_code: string;
  id: number;
  key: string;
  nickname: string;
  value: {
    [key: string]: FavoriteAppItemDataType[];
  };
};

type AppListResult = ResponseStructure<Application[]>;

type FavoriteAppListResult = ResponseStructure<FavoriteApp[]>;

export type GetFavoritesReq = {
  key: string;
  app_code: string;
};

export type ChangeFavoriteReq = GetFavoritesReq & {
  value: {
    [key: string]: object[];
  };
};

declare global {
  interface Window {
    QRLogin: QRLoginFunction;
  }
}
