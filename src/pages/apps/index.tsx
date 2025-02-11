import { ComponentList } from '@/pages/apps/components/ComponentList';
import FavoriteEntry from '@/pages/apps/components/FavoriteEntry';
import {
  Application,
  FavoriteAppItemDataType,
  FavoriteAppListResult,
  GetFavoritesReq,
} from '@/pages/apps/data';
import { changeFavorites, getFavorites } from '@/pages/apps/service';
import { GET_FAVORITE_APPS_APP_CODE, GET_FAVORITE_APPS_KEY } from '@/utils/constants';
import { useModel } from '@@/exports';
import { SearchOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import { Box } from '@mui/material';
import { useLocation } from '@umijs/max';
import { useLocalStorageState } from 'ahooks';
import { Anchor, Empty, Flex, Input, message, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useMemo, useState } from 'react';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
    },

    navigation: {
      boxSizing: 'border-box',
      // '.ant-anchor-ink': {
      //   display: 'none',
      // },
      '.ant-anchor-link-active': {
        background: token.colorInfoBg,
        color: token.colorInfoText,
        // borderRadius: '2px',
      },
      '.ant-anchor-link': {
        // minWidth: '200px',
      },
    },

    appsContainer: {
      flex: 1,
      height: 'calc(100vh - 166px)',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  };
});

const Apps: React.FC = () => {
  const { styles } = useStyles();

  const location = useLocation();

  const [searchValue, setSearchValue] = useState('');

  const { initialState } = useModel('@@initialState');

  const [appList, setAppList] = useState(initialState?.appList?.data || []);

  const [favoriteList, setFavoriteList] = useState<FavoriteAppItemDataType[]>([]);

  const appListByClassify = Object.entries(
    Object.groupBy(appList, ({ classify }) => classify ?? '其他'),
  );

  // 最近访问
  const [recentVisitedAppList, setRecentVisitedAppList] = useLocalStorageState<
    FavoriteAppItemDataType[]
  >('recent-visited', {
    defaultValue: [],
    listenStorageChange: true,
  });

  const fetchFavoriteApps = async (params: GetFavoritesReq): Promise<FavoriteAppListResult> => {
    try {
      const favoriteApps = await getFavorites(params);
      return favoriteApps;
    } catch (error) {
      console.log('++++++++++++error', error);
      return {} as FavoriteAppListResult;
    }
  };

  const components = appListByClassify.map((classify) => {
    const classifyName = classify[0];
    const childrenClassifyList = classify[1] ?? [];

    return {
      id: classifyName,
      classifyName,
      hash: 'component-' + encodeURIComponent(classifyName),
      childrenClassifyList,
    };
  });

  const filterComponents = useMemo(() => {
    const sortOrder = ['SaaS', 'PaaS', '第三方']; // 这个是一个固定的顺序，如果有新的分类，需要在这里添加

    return (
      components
        ?.map((component) => {
          const childrenClassifyList =
            component.childrenClassifyList
              ?.filter((application) => {
                return (
                  application.name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
                  application.frontend_code
                    .toLocaleLowerCase()
                    .includes(searchValue.toLocaleLowerCase())
                );
              })
              .filter(Boolean) || [];
          if (childrenClassifyList.length <= 0) {
            return null;
          }
          return {
            ...component,
            childrenClassifyList,
          };
        })
        .filter(Boolean)
        .sort((a, b) => {
          const aIndex = sortOrder.indexOf(a?.classifyName!);
          const bIndex = sortOrder.indexOf(b?.classifyName!);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }) || []
    );
  }, [components, searchValue]);

  /**
   * 更新收藏列表
   */
  const updateFavoriteList = async () => {
    const favoriteApps = await fetchFavoriteApps({
      key: GET_FAVORITE_APPS_KEY,
      app_code: GET_FAVORITE_APPS_APP_CODE,
    });

    setFavoriteList(favoriteApps?.data?.[0]?.value?.app_collect || []);

    return favoriteApps;
  };

  /**
   * 更新收藏状态，添加或取消收藏
   * @param favoriteApp
   */

  const handleUpdateFavorite = async (favoriteApp: Application) => {
    const findAppIndex = favoriteList.findIndex((item) => item.id === favoriteApp.id);

    let updatedFavoriteList = [];

    if (findAppIndex !== -1) {
      updatedFavoriteList = favoriteList.filter((_, index) => index !== findAppIndex);
    } else {
      updatedFavoriteList = [
        {
          id: favoriteApp.id,
          app_code: favoriteApp.frontend_code,
          name: favoriteApp.name,
          href: favoriteApp.href,
        },
        ...favoriteList,
      ];
    }

    const favoriteObj = {
      key: GET_FAVORITE_APPS_KEY,
      app_code: GET_FAVORITE_APPS_APP_CODE,
      value: {
        app_collect: updatedFavoriteList,
      },
    };

    try {
      await changeFavorites(favoriteObj);
      message.success(findAppIndex !== -1 ? '取消收藏成功' : '添加收藏成功');

      await updateFavoriteList();

      const newAppList = appList.map((app) => {
        const findApp = app.id === favoriteApp.id;
        if (findApp) {
          return {
            ...app,
            isFavorite: !app.isFavorite,
          };
        }
        return app;
      });

      const sortedAppList = sortAppListWithinClassify(newAppList);
      setAppList(sortedAppList);
    } catch (e) {}
  };

  const sortAppListWithinClassify = (apps: Application[]): Application[] => {
    const groupedApps = Object.groupBy(apps, ({ classify }) => classify ?? '其他');

    const sortedGroupedApps = Object.fromEntries(
      Object.entries(groupedApps).map(([classify, apps]) => [
        classify,
        (apps ?? []).sort((a, b) => (a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1)),
      ]),
    );

    return Object.values(sortedGroupedApps).flat() as Application[];
  };

  /**
   * 更新应用列表
   */
  const updateAppsList = async () => {
    const favoriteApps = await updateFavoriteList();

    const newAppList = appList.map((app) => {
      const favoriteApp = favoriteApps.data?.[0]?.value?.app_collect?.find(
        (item) => item.id === app.id,
      );
      return {
        ...app,
        isFavorite: !!favoriteApp,
      };
    });

    const sortedAppList = sortAppListWithinClassify(newAppList);
    setAppList(sortedAppList);
  };

  const handleUpdateRecentVisited = (appId: number) => {
    const visitedApp = appList.find((app) => app.id === appId);

    if (!visitedApp) {
      return;
    }
    const visitedToBeAdded = {
      id: visitedApp.id,
      app_code: visitedApp.app_code,
      frontend_code: visitedApp.frontend_code,
      name: visitedApp.name,
      href: visitedApp.href,
    };

    const newRecentVisitedAppList = [
      visitedToBeAdded,
      ...(recentVisitedAppList ?? []).filter((item) => item.id !== visitedApp.id),
    ];

    // 如果超过5个，删除最后一个
    if (newRecentVisitedAppList.length > 5) {
      newRecentVisitedAppList.pop();
    }

    setRecentVisitedAppList(newRecentVisitedAppList);
  };

  useEffect(() => {
    (async () => {
      await updateAppsList();
    })();
  }, []);

  return (
    <PageContainer
      header={{
        title: '应用中心',
      }}
      style={{
        padding: 0,
      }}
      pageHeaderRender={() => (
        <Flex
          vertical
          style={{
            padding: '24px 24px 0',
          }}
          gap={8}
        >
          <Typography.Title level={4}>应用中心</Typography.Title>

          <Input
            addonBefore={<SearchOutlined />}
            placeholder="请输入产品或服务名称进行搜索"
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Flex>
      )}
      childrenContentStyle={{
        padding: 24,
      }}
    >
      <ProCard gutter={12}>
        <ProCard
          colSpan={3}
          // title={<Typography.Title level={5}>应用类别</Typography.Title>}
          bodyStyle={{ padding: '16px 0 0 0' }}
          // headStyle={{ padding: '0 0 16px 0' }}
        >
          <div className={styles.navigation}>
            <Anchor
              affix={false}
              getContainer={() => document.getElementById('scroll-container')!}
              items={filterComponents?.map((classify) => {
                if (classify) {
                  return {
                    key: classify.id,
                    href: `#${classify.hash}`,
                    title: classify.classifyName,
                  };
                }
                return {
                  key: '',
                  href: '',
                  title: '',
                };
              })}
            ></Anchor>
          </div>
        </ProCard>
        <ProCard colSpan={17} direction="column" bodyStyle={{ padding: '16px 0 0 0' }}>
          <Box
            sx={{
              padding: '0',
              height: 'calc(100vh - 260px)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            id="scroll-container"
          >
            {filterComponents?.length <= 0 ? (
              <Box mt={40}>
                <Empty />
              </Box>
            ) : (
              <ComponentList
                components={filterComponents!}
                onLoad={() => {
                  const targetDom = location.hash
                    ? document.getElementById(location.hash.slice(1))
                    : null;
                  // console.log('++++++++++++location', location);
                  if (targetDom) {
                    targetDom.scrollIntoView();
                  }
                }}
                onUpdateFavorite={async (app: Application) => {
                  await handleUpdateFavorite(app);
                }}
                onUpdateRecentVisited={handleUpdateRecentVisited}
              />
            )}
          </Box>
        </ProCard>
        <ProCard colSpan={4} direction="column" bodyStyle={{ padding: 0 }}>
          <ProCard
            bordered
            bodyStyle={{ padding: '10px 0 0 0', height: 230, overflowY: 'auto' }}
            title={<Typography.Title level={5}>最近访问</Typography.Title>}
            style={{ marginBottom: 12 }}
          >
            <ProList<FavoriteAppItemDataType>
              size="large"
              grid={{ gutter: 2, column: 1 }}
              dataSource={recentVisitedAppList}
              renderItem={(item) => (
                <FavoriteEntry entryData={item} onUpdate={handleUpdateRecentVisited} />
              )}
            />
          </ProCard>

          <ProCard
            bordered
            bodyStyle={{
              padding: '10px 0 0 0',
              minHeight: 230,
              height: 'calc(100vh - 580px)',
              overflowY: 'auto',
            }}
            title={<Typography.Title level={5}>我的收藏</Typography.Title>}
          >
            <ProList<FavoriteAppItemDataType>
              size="large"
              grid={{ gutter: 2, column: 1 }}
              dataSource={favoriteList}
              renderItem={(item) => (
                <FavoriteEntry entryData={item} onUpdate={handleUpdateRecentVisited} />
              )}
            />
          </ProCard>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Apps;
