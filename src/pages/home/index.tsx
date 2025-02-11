import Banner from '@/pages/home/components/Banner';
import { useParams } from '@@/exports';
import { CustomToken, ThemeProvider } from 'antd-style';
import React, { useEffect, useState } from 'react';
import GlobalServices from './components/GlobalServices';
import MaintenanceServices from './components/MaintenanceServices';

// 定义默认值
export const defaultCustomToken: CustomToken = {
  homePrimaryColor: '#587afe',
};

const HomePage = () => {
  // 设置内容区域的内边距，根据屏幕大小响应式调整
  const [contentPadding, setContentPadding] = useState(80);
  // 判断是否为大屏幕（宽度>1600px）
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1600);

  const { id: faqDetailId } = useParams<{ id: string }>();

  // 监听窗口大小变化，动态调整布局
  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 1600;
      setIsLargeScreen(isLarge);
      // 大屏使用80px内边距，小屏使用40px
      setContentPadding(isLarge ? 80 : 40);
    };

    // 初始化时执行一次
    handleResize();
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    // 组件卸载时移除监听器
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider customToken={defaultCustomToken}>
      <div className="home-container">
        {/* 顶部 Banner 区域 */}
        <Banner key={'banner'} />
        {/* 一站式运维服务区块 */}
        <MaintenanceServices
          key={'maintenance'}
          contentPadding={contentPadding}
          isLargeScreen={isLargeScreen}
          faqDetailId={faqDetailId}
        />
        {/* 全球项目定制服务区块 */}
        <GlobalServices
          key={'global'}
          contentPadding={contentPadding}
          isLargeScreen={isLargeScreen}
          faqDetailId={faqDetailId}
        />
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
