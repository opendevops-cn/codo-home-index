import { AvatarDropdown, AvatarName } from '@/components';
import ProductServices from '@/components/ProductServices';
import { AppListResult, GetFavoritesReq } from '@/pages/apps/data';
import { listAPP } from '@/pages/apps/service';
import { FeishuAppIdResult, UserInfo } from '@/pages/user/login/data';
import { getFeishuAppId } from '@/pages/user/login/service';
import { homePrimaryColor } from '@/utils/constants';
import { getUserInfo, handleUnauthenticatedUser } from '@/utils/utils';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { Typography } from 'antd';
import { initGlobalState } from 'qiankun';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
const isDev = process.env.NODE_ENV === 'development';

const initialState = {
  //这里写初始化数据
  unauth: false,
};
// 初始化 state
const actions = initGlobalState(initialState);

const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfo;
  loading?: boolean;
  appList?: AppListResult;
  favoriteApps?: AppListResult;
  fetchFavoriteApps?: (params: GetFavoritesReq) => Promise<AppListResult>;
  fetchUserInfo?: () => UserInfo | undefined;
  fetchApplist?: () => Promise<AppListResult>;
  feishuAppId?: string;
  fetchFeishuAppId?: () => Promise<FeishuAppIdResult> | undefined;
}> {
  const fetchUserInfo = () => {
    try {
      const userInfo = getUserInfo();
      return userInfo;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const fetchFeishuAppId = () => {
    try {
      const feishuAppInfo = getFeishuAppId();
      return feishuAppInfo;
    } catch (error) {
      return undefined;
    }
  };

  const fetchApplist = async (): Promise<AppListResult> => {
    try {
      const appList = await listAPP();
      return appList;
    } catch (error) {
      console.log('++++++++++++error', error);
      return {} as AppListResult;
    }
  };

  const feishuAppInfo = await fetchFeishuAppId();
  const feishuAppId = feishuAppInfo?.data?.feishu_client_id ?? '';

  // 如果不是登录页面，执行
  const { location } = history;
  if (![loginPath, '/user/register', '/user/register-result'].includes(location.pathname)) {
    const currentUser = fetchUserInfo();
    const appList = await fetchApplist();

    return {
      feishuAppId,
      fetchUserInfo,
      appList,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    feishuAppId,
    fetchApplist,
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    // 重置内容区域的边距0零，因为要嵌入微前端应用
    contentStyle: {
      padding: 0,
    },

    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuItemRender: (item, dom) => {
      return <ProductServices />;
    },

    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    actionsRender: () => {
      return [
        // <Typography.Link
        //   style={{
        //     color: homePrimaryColor,
        //   }}
        // >
        //   帮助文档
        // </Typography.Link>,
      ];
    },

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/*{isDev && (*/}
          {/*  <SettingDrawer*/}
          {/*    disableUrlParams*/}
          {/*    enableDarkTheme*/}
          {/*    settings={initialState?.settings}*/}
          {/*    onSettingChange={(settings) => {*/}
          {/*      setInitialState((preInitialState) => ({*/}
          {/*        ...preInitialState,*/}
          {/*        settings,*/}
          {/*      }));*/}
          {/*    }}*/}
          {/*  />*/}
          {/*)}*/}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // baseURL: 'https://proapi.azurewebsites.net',
  ...errorConfig,
};

// 这个函数会在初始加载和路由切换时执行，当为生产环境时，如果访问根路径，重定向到 /index，即进入落地页
// @ts-ignore
export function onRouteChange({ location }) {
  // 主应用监听子应用发来的信息，当子应用未登录时，跳转到登录页
  actions.onGlobalStateChange((state, prev) => {
    console.log('+++++++++++++31', '主应用监听子应用发来的信息', state, prev);
    if (state.unauth != prev.unauth && state.unauth == true) {
      handleUnauthenticatedUser();
    }
  }, true);

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && location.pathname === '/') {
    //暂时跳转到 /apps，后面会改为 /home
    window.location.assign('/home');
  }
}

// export const qiankun = {
//   apps: [
//     {
//       name: 'flow',
//       entry: '/web/flow/',
//       // container: '#child-app',
//       // activeRule: '/flow',
//     },
//
//     {
//       name: 'cmdb',
//       entry: '/web/cmdb/',
//       // container: '#child-app',
//       // activeRule: '/flow',
//     },
//   ],
// };
