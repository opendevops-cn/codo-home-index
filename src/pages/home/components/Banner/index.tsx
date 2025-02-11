import Logo from '@/../public/logo.svg';
import { Flex, Image, Typography } from 'antd';
import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import React from 'react';
import '../../assets/index.less';
import Banner01 from './img/banner01.gif';
import Banner02 from './img/banner02.jpg';
import Banner03 from './img/banner03.gif';
import Banner04 from './img/banner04.jpeg';

import './index.less';

const { Element } = BannerAnim;
const BgElement = Element.BgElement;

// Banner配置
const BANNER_ITEMS = [
  {
    key: 'banner1',
    bgImage: Banner01,
    isDark: true,
    slogan: '研运一体，数字化驱动',
  },
  {
    key: 'banner2',
    bgImage: Banner02,
    isDark: true,
    slogan: '卓越效能提升，精细化成本管理',
  },
  {
    key: 'banner4',
    bgImage: Banner04,
    isDark: true,
    slogan: '一站运维，高效领先',
  },
  {
    key: 'banner3',
    bgImage: Banner03,
    isDark: true,
    slogan: '覆盖全球，服务无界',
  },
];

// 添加背景样式配置对象
const BANNER_STYLES = {
  banner1: {
    backgroundSize: 'center',
    backgroundPosition: '80% 55%',
    backgroundColor: '#0b0723',
  },
  banner2: {
    backgroundSize: 'auto 100%',
    backgroundPosition: 'right 100%',
  },
  banner3: {
    backgroundSize: 'auto 100%',
    backgroundPosition: '80% 55%',
    backgroundColor: '#000',
  },
  banner4: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
};

// Banner内容组件
const BannerContent = ({ isDark, slogan }: { isDark: boolean; slogan: string }) => (
  <QueueAnim name="QueueAnim">
    <Flex key={'logo'} align={'center'} gap={24}>
      <Image src={Logo} preview={false} width={70} />
      <Typography.Text className="banner-title">灵息</Typography.Text>
    </Flex>

    <Typography.Text
      key="p1"
      className="banner-subtitle"
      style={{ color: isDark ? '#ffffff' : '#333' }}
    >
      全球一站式运维平台
    </Typography.Text>

    <br />
    <Typography.Text
      key="p2"
      className="banner-description"
      style={{ color: isDark ? '#f2f2f2' : '#333' }}
    >
      {slogan}
    </Typography.Text>
  </QueueAnim>
);

const Banner = () => {
  const children = BANNER_ITEMS.map((item) => (
    <Element key={item.key} prefixCls="banner-user-elem">
      <BgElement
        key="bg"
        className="bg"
        style={{
          ...BANNER_STYLES[item.key as keyof typeof BANNER_STYLES],
          backgroundImage: `url(${item.bgImage})`,
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div
        key={'logo'}
        className="banner-logo-container"
        style={{
          position: 'absolute',
          top: '28%',
        }}
      >
        <BannerContent isDark={item.isDark} slogan={item.slogan} />
      </div>
    </Element>
  ));

  return (
    <BannerAnim type="grid" autoPlay={true} dragPlay={false} duration={800}>
      {children}
    </BannerAnim>
  );
};

export default Banner;
