import {
  Application,
  FavoriteApp,
  FavoriteAppItemDataType,
  FavoriteAppListResult,
  GetFavoritesReq,
} from '@/pages/apps/data';
import { changeFavorites, getFavorites } from '@/pages/apps/service';
import {
  GET_FAVORITE_APPS_APP_CODE,
  GET_FAVORITE_APPS_KEY,
  homePrimaryColor,
} from '@/utils/constants';
import { useModel } from '@@/exports';
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocalStorageState } from 'ahooks';
import { Divider, Flex, Input, InputRef, message, Popover, Rate, Space, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const useStyles = createStyles(({ token }) => ({
  trigger: {
    cursor: 'pointer',
    padding: '0 12px',
    marginLeft: -12,
    transition: 'all 0.3s',
    color: homePrimaryColor,
    // '&:hover': {
    //   color: token.colorPrimary,
    // },
    '&.active': {
      // color: token.colorPrimary,
      backgroundColor: token.colorPrimaryBg,
    },
  },
  popoverContent: {
    width: 1100,
    '@media(max-width: 1400px)': {
      width: 1000,
    },
    padding: '18px 24px 24px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    // padding: '0 16px',
  },
  recentVisits: {
    fontSize: 16,
    fontWeight: 700,
    color: token.colorText,
  },
  searchWrapper: {
    position: 'relative',
    width: '300px',
    height: 30,
  },
  searchButton: {
    cursor: 'pointer',
    color: token.colorTextSecondary,
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    transition: 'opacity 0.3s ease-out',
    opacity: 1,
    background: '#fff',
    zIndex: 1,
    '&.hide': {
      opacity: 0,
      pointerEvents: 'none',
    },
    '&:hover': {
      color: token.colorPrimary,
    },
    '.anticon': {
      marginRight: 4,
    },
  },
  searchContainer: {
    position: 'absolute',
    right: 0,
    width: '32px',
    transition: 'all 0.3s ease-out',
    opacity: 0,
    visibility: 'hidden',
    '&.show': {
      width: '300px',
      opacity: 1,
      visibility: 'visible',
    },
  },
  recentItems: {
    display: 'inline-flex',
    gap: 16,
    flex: 1,
    span: {
      width: '20%',
      height: '38px',
      padding: '8px 12px',
      background: token.colorBgTextHover,
      borderRadius: token.borderRadius,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      '&:hover': {
        background: token.colorPrimaryBg,
      },
    },
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 600,
    // color: token.colorTextSecondary,
    marginRight: 16,
    display: 'inline-block',
  },
  recentSection: {
    // padding: '0 16px',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
  },
  serviceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    minHeight: 250,
  },
  categorySection: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  categoryName: {
    width: 184,
    '@media(max-width: 1400px)': {
      width: 140,
    },
    // paddingLeft: '5px',
    // borderLeft: `2px solid ${homePrimaryColor}`,
    fontSize: 14,
    fontWeight: 'bold',
    color: homePrimaryColor,

    '&:before': {
      content: '""',
      display: 'inline-block',
      width: 2,
      height: 18,
      marginRight: 8,
      verticalAlign: 'middle',
      backgroundColor: homePrimaryColor,
    },
  },
  serviceList: {
    flex: 1,
  },
  items: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  item: {
    padding: '8px 12px',
    background: token.colorBgLayout,
    borderRadius: token.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
      background: token.colorPrimaryBg,
    },
  },
  star: {
    '.ant-rate': {
      fontSize: 14,
      color: token.colorPrimary,
    },
    '.ant-rate-star': {
      marginInline: 0,
      marginRight: 0,
    },
  },
  servicesPopover: {
    '.ant-popover-inner': {
      padding: 0,
      backgroundColor: '#fff',
    },
    '.ant-popover-inner-content': {
      padding: 0,
    },
    '.ant-popover-arrow': {
      '&::before': {
        backgroundColor: '#fff !important',
      },
      '&::after': {
        display: 'none !important',
      },
    },
    '.ant-popover-content': {
      boxShadow: token.boxShadowSecondary,
    },
  },
}));

const ProductServices: React.FC = () => {
  const { styles } = useStyles();
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  const [open, setOpen] = useState(false);

  const { initialState } = useModel('@@initialState');

  const [appList, setAppList] = useState(initialState?.appList?.data || []);

  const appListByClassify = Object.entries(
    Object.groupBy(appList, ({ classify }) => classify ?? '其他'),
  );
  const [favoriteList, setFavoriteList] = useState<FavoriteAppItemDataType[]>([]);
  const [originalFavoritesResponse, setOriginalFavoritesResponse] = useState<FavoriteApp>();

  // 最近访问
  const [recentVisitedAppList, setRecentVisitedAppList] = useLocalStorageState<
    FavoriteAppItemDataType[]
  >('recent-visited', {
    defaultValue: [],
    listenStorageChange: true,
  });

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

  /**
   * 获取收藏列表
   * @param params
   */
  const fetchFavoriteApps = async (params: GetFavoritesReq): Promise<FavoriteAppListResult> => {
    try {
      const favoriteApps = await getFavorites(params);
      return favoriteApps;
    } catch (error) {
      console.log('++++++++++++error', error);
      return {} as FavoriteAppListResult;
    }
  };

  /**
   * 对应分类下的应用列表排序
   * @param apps
   */
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

  const filterComponents = useMemo(() => {
    const sortOrder = ['SaaS', '资源管理', '可观测'];

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
          const aIndex = sortOrder.indexOf(a?.classifyName || '');
          const bIndex = sortOrder.indexOf(b?.classifyName || '');
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

    setOriginalFavoritesResponse(favoriteApps?.data?.[0]);

    setFavoriteList(favoriteApps?.data?.[0]?.value?.app_collect || []);

    return favoriteApps;
  };

  /**
   * 更新应用列表，添加应用的收藏状态
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
        ...originalFavoritesResponse?.value,
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

  /**
   * 更新最近访问列表
   * @param appId
   */
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

  /**
   * 点击应用入口
   * @param app
   */
  const handleClickEntry = (app: Application | FavoriteAppItemDataType) => {
    handleUpdateRecentVisited(app.id);

    if (app.href) {
      window.open(app.href);
    } else {
      window.location.assign(`/${app.frontend_code ?? app.app_code}`);
    }
  };

  useEffect(() => {
    if (filterComponents.length > 0) {
      setShowSearch(true);
    }
  }, [filterComponents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSearch &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      inputRef.current?.blur();
    }
  }, [showSearch]);

  useEffect(() => {
    (async () => {
      await updateAppsList();
    })();
  }, []);

  const content = (
    <div className={styles.popoverContent}>
      <div className={styles.header}>
        <div className={styles.recentVisits}>产品与服务</div>
        <div className={styles.searchWrapper}>
          <div
            ref={searchButtonRef}
            className={`${styles.searchButton} ${showSearch ? 'hide' : ''}`}
            onClick={() => setShowSearch(true)}
          >
            <SearchOutlined />
            搜索
          </div>
          <div
            ref={searchContainerRef}
            className={`${styles.searchContainer} ${showSearch ? 'show' : ''}`}
          >
            <Input
              ref={inputRef}
              prefix={<SearchOutlined />}
              placeholder="请输入产品或服务名称进行搜索"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              allowClear={true}
            />
          </div>
        </div>
      </div>
      <div className={styles.recentSection}>
        <div className={styles.recentTitle}>最近访问</div>
        <div className={styles.recentItems}>
          {recentVisitedAppList?.map((app) => (
            <span
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                handleClickEntry(app);
              }}
            >
              {app.name}
            </span>
          ))}
        </div>
      </div>
      <Divider />
      <div className={styles.serviceContainer}>
        {filterComponents.map((section) => (
          <div key={section?.id} className={styles.categorySection}>
            <Typography className={styles.categoryName}>{section?.classifyName}</Typography>

            <div className={styles.serviceList}>
              <div className={styles.items}>
                {section?.childrenClassifyList?.map((app) => (
                  <div
                    key={app.id}
                    className={styles.item}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickEntry(app);
                    }}
                  >
                    {app.name}
                    <span
                      className={styles.star}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Rate
                        count={1}
                        value={app.isFavorite ? 1 : 0}
                        onChange={() => handleUpdateFavorite(app)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={(visible) => {
        setOpen(visible);
        if (!visible) {
          setShowSearch(false);
          setSearchValue('');
        }
      }}
      content={content}
      trigger="hover"
      placement="bottomLeft"
      autoAdjustOverflow={false}
      overlayClassName={styles.servicesPopover}
      arrow={false}
    >
      <Space
        className={`${styles.trigger} ${open ? 'active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          window.location.assign('/home');
        }}
      >
        <AppstoreOutlined />
        产品与服务
      </Space>
    </Popover>
  );
};

export default ProductServices;
