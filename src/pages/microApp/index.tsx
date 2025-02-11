import { useModel } from '@@/exports';
import { registerMicroApps, start } from 'qiankun';
import { useEffect, useState } from 'react';
import useStyles from './style.style';

export default () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();

  useEffect(() => {
    // 从 initialState 中获取 appList 数据，注册qiankun子应用
    const microAppsList =
      initialState?.appList?.data?.map((app) => {
        return {
          name: app.name,
          entry: `/web/${app.frontend_code}/`,
          container: '#child-app',
          activeRule: `/${app.frontend_code}`,
        };
      }) ?? [];

    microAppsList.push({
      name: 'temp',
      entry: '/web/temp/',
      // entry: 'http://localhost:7878',
      container: '#child-app',
      activeRule: '/temp',
    });

    registerMicroApps(microAppsList);
    // 启动 qiankun
    start();
  }, []);

  return <div id="child-app" className={styles.childApp}></div>;
};
