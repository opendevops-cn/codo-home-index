import { FavoriteApp, FavoriteAppItemDataType } from '@/pages/apps/data';
import { changeFavorites, getFavorites } from '@/pages/apps/service';
import { getCatetoryList, getServiceList } from '@/pages/home/service';
import {
  GET_FAVORITE_APPS_APP_CODE,
  GET_FAVORITE_APPS_KEY,
  homePrimaryColor,
} from '@/utils/constants';
import { HeartFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { message, Rate, Tabs, Tooltip, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { isNil } from 'lodash-es';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import projectButtonHoverBg from '../../assets/project-button-sel.jpeg';
import projectButtonBg from '../../assets/project-button.jpeg';
import stepButtonHoverBg from '../../assets/step-button-sel.jpeg';
import stepButtonBg from '../../assets/step-button.jpeg';
import ACT from './img/ACT.png';
import autoMationIcon from './img/automation.png';
import book from './img/book.png';
import CBB from './img/CBB.png';
import RO3 from './img/RO3.png';
import ROO from './img/ROO.png';
import 平台 from './img/平台.png';
import 美食2 from './img/美食2.png';

interface RegionPlatformCardProps {
  title: string;
  description: string;
  icon: string;
  href?: string;
}

export interface RegionService {
  title: string;
  description: string;
  icon: string;
  href?: string;
}

export type RegionServicesMap = Record<string, RegionService[]>;

export interface CategoryData {
  regionServices: RegionServicesMap;
}

export interface GlobalServiceData {
  categoryName: string;
  categoryData: CategoryData;
}

export interface GlobalCategoryData {
  name: string;
  img: string;
  description: string;
}

// 移除单独的categories数组
// const categories = ['ROO', 'RO3', '美食2', 'CBB', '平台', 'ACT'];

// 添加新的categories对象
const categoryMap = {
  ROO: {
    icon: ROO,
    style: {
      top: '-25%',
      left: '15%',
      width: '30%',
    },
  },
  RO3: {
    icon: RO3,
    style: {
      top: '-37%',
      left: '12%',
      width: '36%',
    },
  },
  美食2: {
    icon: 美食2,
    style: {
      top: '-46%',
      left: '-1%',
      width: '56%',
    },
  },
  CBB: {
    icon: CBB,
    style: {
      top: '-28%',
      left: '15%',
      width: '33%',
    },
  },
  平台: {
    icon: 平台,
    style: {
      top: '-27%',
      left: '15%',
      width: '33%',
    },
  },
  ACT: {
    icon: ACT,
    style: {
      top: '-37%',
      left: '15%',
      width: '35%',
    },
  },
  book: {
    // 默认配置
    icon: book,
    style: {
      top: '-30%',
      left: '11%',
      width: '35%',
    },
  },
} as const;

// 可以添加类型定义以获得更好的类型支持
type CategoryKey = keyof typeof categoryMap;

// CDN预热相关链接
const cdnWarmUpUrl = 'https://devops.123u.com/ro/cicd/ci/368/task';

// 服务端构建打包链接
const serverBuildUrl = 'https://devops.123u.com/ro/cicd/ci/55/task';

// 一键开服流程入口
const quickServerStartUrl = 'https://codo.huanle.com/flow#/jobCenter/common-flow';

// 清理服务器档案任务
const cleanServerArchiveUrl = 'https://devops.123u.com/ro/cicd/ci/515/task';

// 服务重启任务
const serverRestartUrl = 'https://devops.123u.com/ro/cicd/ci/528/task';

// 全球镜像同步任务
const globalMirrorSyncUrl = 'https://devops.123u.com/ro/cicd/ci/391/task?conf_id=0';

// 行云流水线入口URLs
const cloudPipelineEntry1 = 'https://devops.123u.com/ro/cicd/ci/450/task?conf_id=0';
const cloudPipelineEntry2 = 'https://devops.123u.com/ro/cicd/ci/307/task?conf_id=0';

// 服务器更新任务
const serverUpdateUrl = 'https://devops.123u.com/ro/cicd/ci/312/task';

// RO服务端配置热更新
const roServerConfigHotUpdateUrl = 'https://devops.123u.com/ro/cicd/ci/441/task';

// 全球服务端预热任务
const globalServerWarmUpUrl = 'https://devops.123u.com/ro/cicd/ci/424/task?conf_id=0';

// 全球服务器合并自动化
const globalServerMergeUrl = 'https://devops.123u.com/ro/cicd/ci/518/task';

// 全球子服务器数据合并自动化
const globalSubServerDataMergeUrl = 'https://devops.123u.com/ro/cicd/ci/734/task';

// 全球进程更新任务
const globalProcessUpdateUrl = 'https://devops.123u.com/ro/cicd/ci/706/task';

// 符号表推送任务
const symbolTablePushUrl = 'https://devops.123u.com/ro/cicd/ci/508/task';

// 联合编译重启任务
const unifiedCompileRestartUrl = 'https://devops.123u.com/ro/cicd/ci/642/task';

// CORE分析工具上传下载
const coreAnalysisToolUrl = 'https://devops.123u.com/ro/cicd/ci/385/task';

// 国服tlog生成任务
const cnServerTlogGenUrl = 'https://devops.123u.com/ro/cicd/ci/728/task';

// 内网自选服务器清档任务
const intranetServerCleanUrl = 'https://devops.123u.com/ro/cicd/ci/543/task';

// RO服务端包COS上传
const roServerPackageCosUploadUrl = 'https://devops.123u.com/ro/cicd/ci/281/task';

// Windows服务端打包任务
const windowsServerBuildUrl = 'https://devops.123u.com/ro/cicd/ci/223/task';

// CMDB和配置中心GMT同步
const cmdbConfigGmtSyncUrl = 'https://devops.123u.com/ro/cicd/ci/595/task';

// 导号二进制各地区上传
const accountBinaryUploadUrl = 'https://devops.123u.com/ro/cicd/ci/717/task';

const categoryData: Record<string, CategoryData> = {
  ROO: {
    regionServices: {
      拉美: [
        {
          title: 'CDN全球预热',
          description: '全球内容分发预热',
          icon: '🌐',
          href: cdnWarmUpUrl,
        },
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        { title: '一键开服', description: '快速服务器部署', icon: '🚀', href: quickServerStartUrl },
        {
          title: '一键清档',
          description: '服务器数据清理',
          icon: '🔄',
          href: cleanServerArchiveUrl,
        },
        {
          title: '一键重启',
          description: '服务器数据清理',
          icon: '🔄',
          href: serverRestartUrl,
        },
        {
          title: '一键全球镜像同步',
          description: '全球镜像一致性',
          icon: '🔄',
          href: globalMirrorSyncUrl,
        },
        {
          title: 'Core全球镜像同步',
          description: '核心服务同步',
          icon: '🔁',
          href: cloudPipelineEntry1,
        },
        {
          title: '全球一键导号',
          description: '账号数据迁移',
          icon: '📋',
          href: cloudPipelineEntry2,
        },
        { title: '更新发布', description: '版本更新管理', icon: '📤', href: serverUpdateUrl },
        {
          title: '全球配置热更',
          description: '在线配置更新',
          icon: '⚙️',
          href: roServerConfigHotUpdateUrl,
        },
        {
          title: '全球预热服务器包',
          description: '服务器资源预热',
          icon: '📡',
          href: globalServerWarmUpUrl,
        },
        {
          title: '全球合服自动化',
          description: '服务器合并工具',
          icon: '🔗',
          href: globalServerMergeUrl,
        },
        {
          title: '全球子服数据合并',
          description: '数据整合服务',
          icon: '🗃️',
          href: globalSubServerDataMergeUrl,
        },
        {
          title: '全球进程更新',
          description: '进程管理更新',
          icon: '⚡',
          href: globalProcessUpdateUrl,
        },
        {
          title: '符号表推送',
          description: 'RO服务端符号更新',
          icon: '📝',
          href: symbolTablePushUrl,
        },
        {
          title: '导号二进制上传',
          description: '二进制文件分发',
          icon: '💾',
          href: accountBinaryUploadUrl,
        },
      ],
      东南亚: [
        {
          title: 'CDN全球预热',
          description: '全球内容分发预热',
          icon: '🌐',
          href: cdnWarmUpUrl,
        },
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        { title: '一键开服', description: '快速服务器部署', icon: '🚀', href: quickServerStartUrl },
        {
          title: '一键清档',
          description: '服务器数据清理',
          icon: '🔄',
          href: cleanServerArchiveUrl,
        },
        {
          title: '一键重启',
          description: '服务器数据清理',
          icon: '🔄',
          href: serverRestartUrl,
        },
        {
          title: '一键全球镜像同步',
          description: '全球镜像一致性',
          icon: '🔄',
          href: globalMirrorSyncUrl,
        },
        {
          title: 'Core全球镜像同步',
          description: '核心服务同步',
          icon: '🔁',
          href: cloudPipelineEntry1,
        },
        {
          title: '全球一键导号',
          description: '账号数据迁移',
          icon: '📋',
          href: cloudPipelineEntry2,
        },
        { title: '更新发布', description: '版本更新管理', icon: '📤', href: serverUpdateUrl },
        {
          title: '全球配置热更',
          description: '在线配置更新',
          icon: '⚙️',
          href: roServerConfigHotUpdateUrl,
        },
        {
          title: '全球预热服务器包',
          description: '服务器资源预热',
          icon: '📡',
          href: globalServerWarmUpUrl,
        },
        {
          title: '全球合服自动化',
          description: '服务器合并工具',
          icon: '🔗',
          href: globalServerMergeUrl,
        },
        {
          title: '全球子服数据合并',
          description: '数据整合服务',
          icon: '🗃️',
          href: globalSubServerDataMergeUrl,
        },
        {
          title: '全球进程更新',
          description: '进程管理更新',
          icon: '⚡',
          href: globalProcessUpdateUrl,
        },
        {
          title: '符号表推送',
          description: 'RO服务端符号更新',
          icon: '📝',
          href: symbolTablePushUrl,
        },
        {
          title: 'RO服务端包上传COS',
          description: 'COS存储服务',
          icon: '☁️',
          href: roServerPackageCosUploadUrl,
        },
        {
          title: '导号二进制上传',
          description: '二进制文件分发',
          icon: '💾',
          href: accountBinaryUploadUrl,
        },
      ],
      港澳台: [
        {
          title: 'CDN全球预热',
          description: '全球内容分发预热',
          icon: '🌐',
          href: cdnWarmUpUrl,
        },
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        { title: '一键开服', description: '快速服务器部署', icon: '🚀', href: quickServerStartUrl },
        {
          title: '一键清档',
          description: '服务器数据清理',
          icon: '🔄',
          href: cleanServerArchiveUrl,
        },
        {
          title: '一键重启',
          description: '服务器数据清理',
          icon: '🔄',
          href: serverRestartUrl,
        },
        {
          title: '一键全球镜像同步',
          description: '全球镜像一致性',
          icon: '🔄',
          href: globalMirrorSyncUrl,
        },
        {
          title: 'Core全球镜像同步',
          description: '核心服务同步',
          icon: '🔁',
          href: cloudPipelineEntry1,
        },
        {
          title: '全球一键导号',
          description: '账号数据迁移',
          icon: '📋',
          href: cloudPipelineEntry2,
        },
        { title: '更新发布', description: '版本更新管理', icon: '📤', href: serverUpdateUrl },
        {
          title: '全球配置热更',
          description: '在线配置更新',
          icon: '⚙️',
          href: roServerConfigHotUpdateUrl,
        },
        {
          title: '全球预热服务器包',
          description: '服务器资源预热',
          icon: '📡',
          href: globalServerWarmUpUrl,
        },
        {
          title: '全球合服自动化',
          description: '服务器合并工具',
          icon: '🔗',
          href: globalServerMergeUrl,
        },
        {
          title: '全球子服数据合并',
          description: '数据整合服务',
          icon: '🗃️',
          href: globalSubServerDataMergeUrl,
        },
        {
          title: '全球进程更新',
          description: '进程管理更新',
          icon: '⚡',
          href: globalProcessUpdateUrl,
        },
        {
          title: '符号表推送',
          description: 'RO服务端符号更新',
          icon: '',
          href: symbolTablePushUrl,
        },
        {
          title: '导号二进制上传',
          description: '二进制文件分发',
          icon: '💾',
          href: accountBinaryUploadUrl,
        },
      ],
      日本: [
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        {
          title: '一键清档',
          description: '服务器数据清理',
          icon: '🔄',
          href: cleanServerArchiveUrl,
        },
        {
          title: '一键重启',
          description: '服务器数据清理',
          icon: '🔄',
          href: serverRestartUrl,
        },
        {
          title: '一键全球镜像同步',
          description: '全球镜像一致性',
          icon: '🔄',
          href: globalMirrorSyncUrl,
        },
        {
          title: 'Core全球镜像同步',
          description: '核心服务同步',
          icon: '🔁',
          href: cloudPipelineEntry1,
        },
        {
          title: '全球一键导号',
          description: '账号数据迁移',
          icon: '📋',
          href: cloudPipelineEntry2,
        },
        { title: '更新发布', description: '版本更新管理', icon: '📤', href: serverUpdateUrl },
        {
          title: '全球配置热更',
          description: '在线配置更新',
          icon: '⚙️',
          href: roServerConfigHotUpdateUrl,
        },
        {
          title: '全球预热服务器包',
          description: '服务器资源预热',
          icon: '📡',
          href: globalServerWarmUpUrl,
        },
        {
          title: '全球合服自动化',
          description: '服务器合并工具',
          icon: '🔗',
          href: globalServerMergeUrl,
        },
        {
          title: '全球子服数据合并',
          description: '数据整合服务',
          icon: '🗃️',
          href: globalSubServerDataMergeUrl,
        },
        {
          title: '全球进程更新',
          description: '进程管理更新',
          icon: '⚡',
          href: globalProcessUpdateUrl,
        },
        {
          title: '符号表推送',
          description: 'RO服务端符号更新',
          icon: '📝',
          href: symbolTablePushUrl,
        },
        {
          title: '导号二进制上传',
          description: '二进制文件分发',
          icon: '💾',
          href: accountBinaryUploadUrl,
        },
      ],
      韩国: [
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        {
          title: '一键清档',
          description: '服务器数据清理',
          icon: '🔄',
          href: cleanServerArchiveUrl,
        },
        {
          title: '一键重启',
          description: '服务器数据清理',
          icon: '🔄',
          href: serverRestartUrl,
        },

        {
          title: '一键全球镜像同步',
          description: '全球镜像一致性',
          icon: '🔄',
          href: globalMirrorSyncUrl,
        },
        {
          title: 'Core全球镜像同步',
          description: '核心服务同步',
          icon: '🔁',
          href: cloudPipelineEntry1,
        },
        {
          title: '全球一键导号',
          description: '账号数据迁移',
          icon: '📋',
          href: cloudPipelineEntry2,
        },
        { title: '更新发布', description: '版本更新管理', icon: '📤', href: serverUpdateUrl },
        {
          title: '全球配置热更',
          description: '在线配置更新',
          icon: '⚙️',
          href: roServerConfigHotUpdateUrl,
        },
        {
          title: '全球预热服务器包',
          description: '服务器资源预热',
          icon: '📡',
          href: globalServerWarmUpUrl,
        },
        {
          title: '全球合服自动化',
          description: '服务器合并工具',
          icon: '🔗',
          href: globalServerMergeUrl,
        },
        {
          title: '全球子服数据合并',
          description: '数据整合服务',
          icon: '🗃️',
          href: globalSubServerDataMergeUrl,
        },
        {
          title: '全球进程更新',
          description: '进程管理更新',
          icon: '⚡',
          href: globalProcessUpdateUrl,
        },
        {
          title: '符号表推送',
          description: 'RO服务端符号更新',
          icon: '📝',
          href: symbolTablePushUrl,
        },
        {
          title: '导号二进制上传',
          description: '二进制文件分发',
          icon: '💾',
          href: accountBinaryUploadUrl,
        },
      ],
      内网: [
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        {
          title: '全球一键导号',
          description: '账号数据迁移',
          icon: '📋',
          href: cloudPipelineEntry2,
        },
        { title: '更新发布', description: '版本更新管理', icon: '📤', href: serverUpdateUrl },
        {
          title: '联合编译重启',
          description: '编译部署服务',
          icon: '🔧',
          href: unifiedCompileRestartUrl,
        },
        {
          title: '内网自选服清档',
          description: '数据清理服务',
          icon: '🗑️',
          href: intranetServerCleanUrl,
        },
        {
          title: 'Windows服务端打包',
          description: 'Windows环境打包',
          icon: '🪟',
          href: windowsServerBuildUrl,
        },
        {
          title: 'CMDB配置GMT同步',
          description: '配置中心同步',
          icon: '⚙️',
          href: cmdbConfigGmtSyncUrl,
        },
      ],
      国服: [
        { title: '服务端打包', description: '服务端程序打包', icon: '📦', href: serverBuildUrl },
        {
          title: 'CORE分析机上传下载',
          description: '核心数据分析',
          icon: '📊',
          href: coreAnalysisToolUrl,
        },
        { title: 'Tlog生成', description: '日生成服务', icon: '📝', href: cnServerTlogGenUrl },
      ],
    },
  },
  RO3: { regionServices: {} },
  美食2: { regionServices: {} },
  CBB: { regionServices: {} },
  平台: { regionServices: {} },
  ACT: { regionServices: {} },
};

const fetchGlobalServicesData = async () => {
  try {
    const serviceList = await getServiceList();

    if (!serviceList?.data) {
      throw new Error('Failed to fetch global service list data');
    }

    return serviceList.data;
  } catch (error) {
    console.error('Error fetching maintenance data:', error);
    return [];
  }
};

const fetchGlobalCategoriesData = async () => {
  try {
    const categoryList = await getCatetoryList();

    if (!categoryList?.data) {
      throw new Error('Failed to fetch global category list data');
    }

    return categoryList.data;
  } catch (error) {
    console.error('Error fetching maintenance data:', error);
    return [];
  }
};

const useStyles = createStyles(({ token, css }) => ({
  categoryContainerWrapper: css`
    position: relative;

    .scroll-arrow {
      position: absolute;
      top: 42%;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: ${homePrimaryColor};
      font-size: 16px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-50%);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &.left {
        left: -55px;
        animation: slideRight 1.5s ease-in-out infinite;
      }

      &.right {
        right: -32px;
        animation: slideLeft 1.5s ease-in-out infinite;
      }

      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;

        &:hover {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }

    @keyframes slideRight {
      0%,
      100% {
        transform: translate(0, -50%);
      }
      50% {
        transform: translate(8px, -50%);
      }
    }

    @keyframes slideLeft {
      0%,
      100% {
        transform: translate(0, -50%);
      }
      50% {
        transform: translate(-8px, -50%);
      }
    }
  `,

  categoryContainer: css`
    display: flex;
    align-items: center;
    gap: 36px;
    padding-bottom: 12px;
    padding-top: 4px;
    overflow-x: auto;
    scroll-behavior: smooth;
    min-height: 120px;
    padding: 36px 25px 16px 0;
    margin: -36px 0 0 0;

    /* 隐藏默认滚动条 */
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;

    .category-item {
      position: relative;
      display: flex;
      flex: 0 0 calc(16.666% - 30px);
      align-items: center;
      justify-content: flex-end;
      margin-top: 4px;
      padding-right: 2.2cqw;
      //overflow: hidden;
      color: #eee;
      font-weight: 700;
      font-family: 'Impact Bold', 'Impact', sans-serif;
      background: url(${stepButtonBg}) no-repeat center center;
      background-size: 100% 100%;

      border-radius: 8px;
      transform-origin: center center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      & > img {
        position: absolute;

        transform-origin: center center;
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      & > .favorite-icon {
        position: absolute;
        top: 0;
        right: 2%;
        color: #f0f0f0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover > .favorite-icon {
        opacity: 1;
      }

      & > .favorite-icon.favorited {
        opacity: 1;
      }

      @media (min-width: 1600px) {
        height: 80px;
        font-size: 1.8cqw;
      }

      @media (max-width: 1599px) {
        height: 70px;
        font-size: 28px;
      }

      &:hover {
        background: url(${stepButtonBg}) no-repeat center center;
        background-size: 100% 100%;
        box-shadow: 10px 8px 10px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);

        & > img {
          animation: floatUpDown 1s ease-in-out infinite;
        }
      }

      &.active {
        background: url(${stepButtonHoverBg}) no-repeat center center;
        background-size: 100% 100%;
        box-shadow: 10px 6px 10px 0px rgba(51, 51, 51, 0.65);
        transform: translateY(-4px);

        & > img {
          animation: tada 0.8s ease-in-out;
          animation-fill-mode: both;
        }
      }

      @keyframes iconEnter {
        0% {
          transform: translate(-20px, 20px) scale(0.8);
          opacity: 0;
        }
        60% {
          transform: translate(2px, -2px) scale(1.05);
          opacity: 1;
        }
        100% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
      }

      @keyframes floatUpDown {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
        100% {
          transform: translateY(0);
        }
      }

      @keyframes tada {
        0% {
          transform: scale(1) rotate(0deg);
        }
        10%,
        20% {
          transform: scale(0.9) rotate(-3deg);
        }
        30%,
        50%,
        70%,
        90% {
          transform: scale(1.1) rotate(3deg);
        }
        40%,
        60%,
        80% {
          transform: scale(1.1) rotate(-3deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }

      // 项目分类按钮
      &.project {
        color: #eee;
        font-weight: initial;

        background: url(${projectButtonBg}) no-repeat center center;
        background-size: auto 100%;

        &:hover {
          background: url(${projectButtonHoverBg}) no-repeat center center;
          background-size: auto 100%;
        }
        &.active {
          background: url(${projectButtonHoverBg}) no-repeat center center;
          background-size: auto 100%;
        }
      }
    }

    .favorite-rate {
      .ant-rate-star {
        .ant-rate-star-second {
          color: gray;
        }

        &.ant-rate-star-full .ant-rate-star-second {
          color: ${homePrimaryColor};
        }

        &:hover .ant-rate-star-second {
          color: ${homePrimaryColor};
        }
      }
    }
  `,

  regionTabContent: css`
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    row-gap: 20px;
    padding: 24px 0;
  `,

  regionPlatformCard: css`
    padding: 1cqw;
    border-radius: ${token.borderRadiusLG}px;
    background: rgba(242, 242, 242, 0.69);
    width: calc(23.5%);
    display: flex;
    align-items: center;
    gap: 1cqw;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 0;

    &:hover {
      box-shadow: ${token.boxShadowSecondary};
    }
  `,

  regionCardIcon: css`
    width: 40px;
    height: 40px;
    //background: ${token.colorPrimaryBg};
    border-radius: ${token.borderRadius}px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  `,

  regionCardInfo: css`
    flex: 1;
  `,

  regionCardTitle: css`
    font-size: ${token.fontSizeLG}px;
    margin-bottom: ${token.marginXS}px;
  `,

  regionCardDesc: css`
    color: #7f7f7f;
    font-size: 13px;
  `,

  customTabs: css`
    .ant-tabs-tab {
      &.ant-tabs-tab-active {
        .ant-typography {
          color: ${homePrimaryColor};
        }
      }
    }

    .ant-tabs-ink-bar {
      height: 3px;
      background: ${homePrimaryColor};
    }
  `,
}));

const RegionPlatformCard = ({ title, description, icon, href }: RegionPlatformCardProps) => {
  const { styles } = useStyles();
  return (
    <div
      className={styles.regionPlatformCard}
      onClick={() => {
        if (href) {
          window.open(href);
        }
      }}
    >
      <div className={styles.regionCardIcon}>
        <img src={autoMationIcon} width={50} />
      </div>
      <div className={styles.regionCardInfo}>
        <div className={styles.regionCardTitle}>{title}</div>
        <div className={styles.regionCardDesc}>{description}</div>
      </div>
    </div>
  );
};

interface GlobalServicesProps {
  contentPadding: number;
  isLargeScreen: boolean;
  faqDetailId?: string;
}

const GlobalServices: React.FC<GlobalServicesProps> = ({
  contentPadding,
  isLargeScreen,
  faqDetailId,
}) => {
  const { styles } = useStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ROO');
  const [activeRegion, setActiveRegion] = useState('拉美');
  const [serviceData, setServiceData] = useState<GlobalServiceData[]>([]);
  const [categoryData, setCategoryData] = useState<GlobalCategoryData[]>([]);
  const [favoriteCategoryList, setFavoriteCategoryList] = useState<FavoriteAppItemDataType[]>([]);
  const [originalCategoryData, setOriginalCategoryData] = useState<GlobalCategoryData[]>([]);
  const [originalFavoritesResponse, setOriginalFavoritesResponse] = useState<FavoriteApp>();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 先加载类别数据
        const categories = await fetchGlobalCategoriesData();
        // 保存原始顺序
        setOriginalCategoryData(categories);

        // 加载收藏数据
        const favoritesResponse = await getFavorites({
          key: GET_FAVORITE_APPS_KEY,
          app_code: GET_FAVORITE_APPS_APP_CODE,
        });
        setOriginalFavoritesResponse(favoritesResponse?.data?.[0]);
        const favorites = favoritesResponse?.data?.[0]?.value?.category_collect || [];
        setFavoriteCategoryList(favorites);

        // 如果有收藏，则按收藏排序
        if (favorites.length > 0) {
          const sortedCategories = [...categories].sort((a, b) => {
            const aIsFavorite = favorites.some((fav) => fav.name === a.name);
            const bIsFavorite = favorites.some((fav) => fav.name === b.name);
            return aIsFavorite === bIsFavorite ? 0 : aIsFavorite ? -1 : 1;
          });
          setCategoryData(sortedCategories);
        } else {
          setCategoryData(categories);
        }

        // 加载服务数据
        const services = await fetchGlobalServicesData();
        setServiceData(services);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // 检查滚动箭头的显示状态
  const checkScrollArrows = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollArrows);
      return () => {
        container.removeEventListener('scroll', checkScrollArrows);
      };
    }
  }, [checkScrollArrows]);

  // 在数据加载完成后检查滚动状态
  useEffect(() => {
    if (categoryData.length > 0) {
      // 使用 setTimeout 确保在 DOM 更新后执行检查
      setTimeout(checkScrollArrows, 0);
    }
  }, [categoryData, checkScrollArrows]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      checkScrollArrows();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScrollArrows]);

  // 滚动处理函数
  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / 2;
      const newScrollLeft =
        containerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const currentRegionServices =
    serviceData.find((item) => item.categoryName === activeCategory)?.categoryData.regionServices ||
    {};
  const hasData = Object.keys(currentRegionServices).length > 0;

  const handleUpdateFavorite = async (category: GlobalCategoryData) => {
    const findCategoryIndex = favoriteCategoryList.findIndex((item) => item.name === category.name);

    let updatedFavoriteList = [];

    if (findCategoryIndex !== -1) {
      // 取消收藏
      updatedFavoriteList = favoriteCategoryList.filter((_, index) => index !== findCategoryIndex);
    } else {
      // 添加收藏
      updatedFavoriteList = [
        {
          id: Date.now(),
          name: category.name,
          app_code: category.name,
        },
        ...favoriteCategoryList,
      ];
    }

    const favoriteObj = {
      key: GET_FAVORITE_APPS_KEY,
      app_code: GET_FAVORITE_APPS_APP_CODE,
      value: {
        ...originalFavoritesResponse?.value,
        category_collect: updatedFavoriteList,
      },
    };

    try {
      await changeFavorites(favoriteObj);
      message.success(findCategoryIndex !== -1 ? '取消收藏成功' : '添加收藏成功');

      setFavoriteCategoryList(updatedFavoriteList);

      if (updatedFavoriteList.length > 0) {
        // 如果还有收藏项，按收藏排序
        const sortedCategories = [...categoryData].sort((a, b) => {
          const aIsFavorite = updatedFavoriteList.some((fav) => fav.name === a.name);
          const bIsFavorite = updatedFavoriteList.some((fav) => fav.name === b.name);
          return aIsFavorite === bIsFavorite ? 0 : aIsFavorite ? -1 : 1;
        });
        setCategoryData(sortedCategories);
      } else {
        // 如果没有收藏项了，恢复原始顺序
        setCategoryData([...originalCategoryData]);
      }

      // 添加滚动到最左边的逻辑
      if (containerRef.current) {
        containerRef.current.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    } catch (error) {
      console.error('Failed to update favorites:', error);
      message.error('操作失败');
    }
  };

  return (
    isNil(faqDetailId) && (
      <div style={{ padding: `0 ${contentPadding}px ${contentPadding}px` }}>
        <ProCard
          title={
            <Typography.Text
              style={{
                fontSize: isLargeScreen ? '28px' : '26px',
              }}
            >
              全球项目定制服务
            </Typography.Text>
          }
          direction={'column'}
          style={{
            padding: isLargeScreen ? '24px 40px 60px' : '6px 14px 30px',
          }}
          headStyle={{
            marginBottom: isLargeScreen ? 14 : 4,
          }}
        >
          <div className={styles.categoryContainerWrapper}>
            {showLeftArrow && (
              <div className={`scroll-arrow left`} onClick={() => handleScroll('left')}>
                <LeftOutlined />
              </div>
            )}

            <div ref={containerRef} className={styles.categoryContainer}>
              {categoryData.map((item, index) => (
                <div
                  key={index}
                  data-category={item.name}
                  className={`category-item project ${
                    activeCategory === item.name ? 'active' : ''
                  }`}
                  onClick={() => handleCategoryClick(item.name)}
                >
                  <img
                    src={categoryMap?.[item.name as CategoryKey]?.icon || categoryMap.book.icon}
                    style={categoryMap?.[item.name as CategoryKey]?.style || categoryMap.book.style}
                  />
                  {item.name}

                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={`favorite-icon ${
                      favoriteCategoryList.some((fav) => fav.name === item.name) ? 'favorited' : ''
                    }`}
                  >
                    <Tooltip
                      title={
                        favoriteCategoryList.some((fav) => fav.name === item.name)
                          ? '取消收藏'
                          : '点击收藏'
                      }
                    >
                      <Rate
                        count={1}
                        value={favoriteCategoryList.some((fav) => fav.name === item.name) ? 1 : 0}
                        onChange={() => handleUpdateFavorite(item)}
                        className="favorite-rate"
                      />
                    </Tooltip>
                  </span>
                </div>
              ))}
            </div>

            {showRightArrow && (
              <div className={`scroll-arrow right`} onClick={() => handleScroll('right')}>
                <RightOutlined />
              </div>
            )}
          </div>

          <ProCard
            headerBordered
            bodyStyle={{
              padding: 0,
              width: '99%',
            }}
          >
            {hasData ? (
              <Tabs
                activeKey={activeRegion}
                onChange={setActiveRegion}
                size={'large'}
                className={styles.customTabs}
                items={Object.keys(currentRegionServices).map((region) => ({
                  label: (
                    <Typography.Text style={{ fontSize: isLargeScreen ? '24px' : '22px' }}>
                      {region}
                    </Typography.Text>
                  ),
                  key: region,
                  children: (
                    <div className={styles.regionTabContent}>
                      {currentRegionServices[region]?.map((service, index) => (
                        <RegionPlatformCard
                          key={index}
                          title={service.title}
                          description={service.description}
                          icon={service.icon}
                          href={service.href}
                        />
                      ))}
                    </div>
                  ),
                }))}
              />
            ) : (
              <div
                style={{
                  marginTop: '30px',
                  height: '320px',
                  width: '99.5%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#999',
                  background: 'rgba(242, 242, 242, 0.69)',
                }}
              >
                工具准备中
              </div>
            )}
          </ProCard>
        </ProCard>
      </div>
    )
  );
};

export default GlobalServices;
