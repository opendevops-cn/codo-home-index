import { homePrimaryColor } from '@/utils/constants';
import { FileTextOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, Col, ConfigProvider, message, Row, Tabs, Tooltip, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { isNil } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import step1Bg from '../../assets/step1.jpeg';
import step2Bg from '../../assets/step2.jpeg';
import step3Bg from '../../assets/step3.jpeg';
import step4Bg from '../../assets/step4.jpeg';
import step5Bg from '../../assets/step5.jpeg';
import FAQ, { FAQItem } from '../FAQ';
import cmdbIcon from './img/cmdb.png';
import cnmpIcon from './img/cnmp.png';
import databaseIcon from './img/database.png';
import flowIcon from './img/flow.png';
import grafanaIcon from './img/grafana.png';
import logIcon from './img/log.png';
import mgIcon from './img/mg.png';

import { getStepList } from '@/pages/home/service';
import { appIconMap } from '@/utils/utils';
import { history } from '@umijs/max';
import { useMediaQuery } from 'react-responsive';
import { JSX } from 'react/jsx-runtime';
import tIcon from './img/testlogo.png';

// 使用原有的接口定义
interface StepItemProps {
  title: string;
  description: string;
  index: number;
  selected?: boolean;
  onClick?: () => void;
}

interface PlatformCardProps {
  title: string;
  description: string;
  icon: IconType;
  href?: string;
  width?: number;
  smallWidth?: number;
  stepDesc?: string;
}

interface StepCards {
  [key: number]: Array<PlatformCardProps>;
}

// 在文件顶部添加图标映射
const ICON_MAP = {
  cmdb: cmdbIcon,
  cnmp: cnmpIcon,
  database: databaseIcon,
  flow: flowIcon,
  grafana: grafanaIcon,
  log: logIcon,
  mg: mgIcon,
  jumpserver: appIconMap.jumpserver,
  kuboard: appIconMap.kuboard,
  xingyun: appIconMap.xingyun,
} as const;

type IconType = keyof typeof ICON_MAP;

// 移动 stepCards 数据到组件中
const stepCards: StepCards = {
  1: [
    {
      title: '业务配置',
      description: '管理后台',
      icon: 'mg',
      href: '/mg/authority/business',
    },
    {
      title: '用户配置',
      description: '管理后台',
      icon: 'mg',
      href: '/mg/authority/user-list',
    },
    {
      title: '权限配置',
      description: '管理后台',
      icon: 'mg',
      href: '/mg/authority/functions',
    },
  ],
  2: [
    // {
    //   title: '节点管理【GSE】',
    //   description: '节点管理与配置',
    //   icon: '🖥️',
    //   href: '/agent',
    // },
    {
      title: '服务树配置',
      description: '配置管理【CMDB】',
      icon: 'cmdb',
      href: '/cmdb/service-tree',
    },
    {
      title: '动态分组',
      description: '配置管理【CMDB】',
      icon: 'cmdb',
      href: '/cmdb/bizmg/cmdb-dynamic-group',
    },
    {
      title: '堡垒机权限分组',
      description: '配置管理【CMDB】',
      icon: 'cmdb',
      href: '/cmdb/bizmg/cmdb-perm-group',
    },
    {
      title: '构建机管理',
      description: '任务管理【Flow】',
      icon: 'flow',
      href: '/flow#/job-meta/agent-list',
    },
  ],
  4: [
    {
      title: '堡垒机管理',
      description: '堡垒机',
      icon: 'jumpserver',
      width: 35,
      href: 'https://jumpserver.huanle.com',
    },
    {
      title: '云原生管理',
      description: '云原生管理【CNMP】',
      icon: 'cnmp',
      href: '/cnmp/dashboard',
    },
    { title: '数据库审计查询', description: '数据库审计平台', icon: 'database' },
    {
      title: 'Kubernetes可视化管理',
      description: 'Kuboard',
      icon: 'kuboard',
      width: 35,
      href: 'https://kuboard-intra.huanle.com/',
    },
  ],
  5: [
    {
      title: '日志查询',
      description: '统一日志查询平台【CLS】',
      icon: 'log',
      href: 'https://datasight-1251001122.clsconsole.tencent-cloud.com/',
    },
    {
      title: '监控查询',
      description: '监控查询平台【Grafana】',
      icon: 'grafana',
      href: 'https://grafana.huanle.com',
    },
  ],
};

// 移动 steps 数据到组件中
const steps = [
  { title: '业务权限配置', description: '一站式配置业务、权限与角色' },
  { title: '资源配置', description: '多云管理、Agent部署与资源模型配置' },
  { title: '自动化工作流', description: '持续构建与集成、发布管理及工单流' },
  { title: '服务器环境管理', description: '管理服务器、容器集群、数据库等' },
  { title: '可观测', description: '监控告警、链路追踪及日志查看与分析' },
];

const step3Data = {
  打包构建: [
    {
      title: 'CI/CD持续集成',
      description: '研发效能【行云】',
      icon: 'xingyun',
      href: 'https://devops.123u.com/huanle/cicd/ci?conf_id=0&tagId=all',
    },
    {
      title: '构建机管理 ',
      description: '任务管理【Flow】',
      icon: 'flow',
      href: 'https://codo.huanle.com/flow#/job-meta/agent-list',
    },
    {
      title: '凭证管理 ',
      description: '任务管理【Flow】',
      icon: 'flow',
      href: 'https://codo.huanle.com/flow#/job-meta/voucher',
    },
  ],
  发布管理: [
    {
      title: 'CI/CD发布管理',
      description: '研发效能【行云】',
      icon: 'xingyun',
      width: 35,
      href: 'https://devops.123u.com/huanle/cicd/deploy?tagId=all',
    },
  ],
  流程配置: [
    {
      title: '配置自动化流程',
      description: '任务管理【Flow】',
      icon: 'flow',
      href: '/flow#/home',
    },
  ],
};

// 保持原有的样式定义
const useStyles = createStyles(({ token, css }) => ({
  stepCard: css`
    width: 100%;
    height: 130px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    padding: 1cqw 1.2cqw;

    &.step1 {
      background: url(${step1Bg}) no-repeat center center;
      background-size: 100% 100%;
    }
    &.step2 {
      background: url(${step2Bg}) no-repeat center center;
      background-size: 100% 100%;
    }
    &.step3 {
      background: url(${step3Bg}) no-repeat center center;
      background-size: 100% 100%;
    }
    &.step4 {
      background: url(${step4Bg}) no-repeat center center;
      background-size: 100% 100%;
    }
    &.step5 {
      background: url(${step5Bg}) no-repeat center center;
      background-size: 100% 100%;
    }

    @media (min-width: 1600px) {
      height: 130px;
      margin-bottom: 50px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    @media (max-width: 1599px) {
      height: 120px;
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &:hover {
      background-size: 100% 100%;
      box-shadow: 10px 8px 10px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }

    &.selected {
      background-size: 100% 100%;
      box-shadow: 12px 8px 12px 0px rgba(51, 51, 51, 0.65);
      transform: translateY(-4px);
    }
  `,

  topRow: css`
    display: flex;
    align-items: baseline;
    gap: 5%;
  `,
  stepWrapper: css`
    display: flex;
    align-items: center;
  `,
  stepText: css`
    font-family: 'Impact Bold', 'Impact', sans-serif;
    font-weight: 700;
    color: #eee;
    text-align: left;
    line-height: 36px;

    @media (min-width: 1600px) {
      font-size: 2cqw;
    }

    @media (max-width: 1599px) {
      font-size: 32px;
    }
  `,

  cardStepTitle: css`
    font-size: 18px;
    color: #eee;
    flex: 1;
    @media (min-width: 1600px) {
      font-size: 22px;
    }

    @media (max-width: 1599px) {
      font-size: 18px;
    }
  `,
  cardStepDesc: css`
    font-size: 16px;
    @media (max-width: 1599px) {
      font-size: 13px;
    }
    color: #eee;
    line-height: 1.5;
    margin-top: 12px;
  `,

  platformCard: css`
    //padding: 1.6cqw;
    padding: 28px 34px 28px;
    @media (max-width: 1599px) {
      padding: 18px 18px 18px;
    }
    border-radius: ${token.borderRadiusLG}px;
    background: rgba(242, 242, 242, 0.69);
    width: calc(32% - 5px);

    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 0;

    @media (min-width: 1600px) {
      width: calc(48% - 5px);
    }

    @media (max-width: 1599px) {
      width: calc(47% - 2px);
    }

    &:hover {
      box-shadow: ${token.boxShadowSecondary};
    }
  `,

  platformCardInlineContainer: css`
    display: flex;
    align-items: center;
    gap: 1.5cqw;
    margin-bottom: ${token.marginXS}px;
  `,

  platformIcon: css`
    width: 60px;

    @media (max-width: 1599px) {
      width: 60px;
    }

    //height: 40px;
    border-radius: ${token.borderRadius}px;
    //background: url(${tIcon}) no-repeat center center;
    //background-size: 130%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  platformInfo: css`
    flex: 1;
  `,

  stepTitle: css`
    //font-size: ${token.fontSizeLG}px;
    margin-bottom: ${token.marginXS}px;
  `,
  stepDesc: css`
    color: #7f7f7f;
    font-size: 13px;
    @media (max-width: 1599px) {
      font-size: 12px;
    }
  `,
  tabContent: css`
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    row-gap: 40px;
    @media (max-width: 1599px) {
      gap: 30px;
      row-gap: 30px;
    }
  `,

  customTabs: css`
    .ant-tabs-tab {
      //margin: 0 32px 0 0;
      //padding: 8px 0;

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

  ,
  `,

  faqContent: css`
    padding: 20px 26px;
    background: #f3f6ff;
    //margin-bottom: 8px;
  `,
  questionItem: css`
    margin-bottom: 24px;

    .question {
      display: flex;
      align-items: flex-start;
      margin-bottom: 12px;
      color: ${token.colorText};
      font-size: 16px;

      .number {
        margin-right: 8px;
        color: ${homePrimaryColor};
        font-weight: bold;
      }
    }

    .answer {
      position: relative;
      margin-bottom: 8px;
      padding-left: 24px;
      color: ${token.colorText};

      &::before {
        position: absolute;
        left: 0;
        opacity: 0.7;
        content: '👉';
      }
    }
  `,
}));

// 保持原有的子组件定义
const StepItem = ({ title, description, index, selected, onClick }: StepItemProps) => {
  const { styles } = useStyles();
  return (
    <div
      className={`${styles.stepCard} ${selected ? 'selected' : ''} step${index}`}
      onClick={onClick}
    >
      <div className={styles.topRow}>
        <div className={styles.stepWrapper}>
          <span className={styles.stepText}>STEP {index}</span>
        </div>
        <div className={styles.cardStepTitle}>{title}</div>
      </div>
      <div className={styles.cardStepDesc}>{description}</div>
    </div>
  );
};

const PlatformCard = ({
  title,
  description,
  icon,
  href,
  width,
  smallWidth,
  stepDesc,
}: PlatformCardProps) => {
  const { styles } = useStyles();
  const isSmallScreen = useMediaQuery({ query: '(max-width: 1599px)' });
  const imgWidth =
    width && smallWidth ? (isSmallScreen ? smallWidth : width) : isSmallScreen ? 50 : 60;
  return (
    <div
      className={styles.platformCard}
      onClick={() => {
        window.open(href);
      }}
    >
      <div className={styles.platformCardInlineContainer}>
        <div className={styles.platformIcon}>
          <img src={ICON_MAP[icon]} width={imgWidth} />
        </div>
        <div className={styles.platformInfo}>
          <div className={styles.stepTitle}>
            <Row justify={'space-between'}>
              <Col
                style={{
                  fontSize: isSmallScreen ? '16px' : '18px',
                }}
              >
                {title}
              </Col>
              <Col
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {/*<Rate value={0} count={1} style={{ fontSize: 16 }} />*/}

                <Tooltip title="产品手册">
                  <FileTextOutlined
                    style={{
                      fontSize: '16px',
                      color: '#aaa',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      message.info('暂未开放');
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </div>
          {/*<div className={styles.stepDesc}>{description}</div>*/}
        </div>
      </div>

      <div className={styles.stepDesc}>{stepDesc}</div>
    </div>
  );
};

interface MaintenanceServicesProps {
  contentPadding: number;
  isLargeScreen: boolean;
  faqDetailId?: string;
}

// 在文件顶部添加类型定义
export interface CardItem {
  title: string;
  description: string;
  icon: IconType;
  href?: string;
  width?: number;
}

export interface StepDetail {
  all?: CardItem[];
  打包构建?: CardItem[];
  发布管理?: CardItem[];
  流程配置?: CardItem[];
}

export interface FAQData {
  all: {
    question: string;
    answer: string;
  }[];
}

export interface StepData {
  id: number;
  title: string;
  description: string;
  cards: StepDetail;
  faqs: FAQData;
}

/**
 * 获取运维服务数据
 */
const fetchMaintenanceData = async () => {
  try {
    const stepList = await getStepList();

    if (!stepList?.data) {
      throw new Error('Failed to fetch step list data');
    }

    return stepList.data.map((item) => {
      try {
        return {
          ...item,
          cards: JSON.parse(item.cards || '{}'),
          faqs: JSON.parse(item.faqs || '[]'),
        };
      } catch (parseError) {
        console.error(`Error parsing JSON for step ${item.id}:`, parseError);
        message.error(`数据格式错误: ${item.title}`);
        return {
          ...item,
          cards: {},
          faqs: [],
        };
      }
    });
  } catch (error) {
    console.error('Error fetching maintenance data:', error);
    message.error('获取数据失败，请稍后重试');
    return [];
  }
};

const MaintenanceServices: React.FC<MaintenanceServicesProps> = ({
  contentPadding,
  isLargeScreen,
  faqDetailId,
}) => {
  const { styles } = useStyles();
  const [selectedStep, setSelectedStep] = useState(3);
  const [activeTab, setActiveTab] = useState('打包构建');
  const [data, setData] = useState<StepData[]>([]);

  useEffect(() => {
    fetchMaintenanceData().then(setData);
  }, []);

  const renderStepContent = () => {
    if (!data.length) return null;

    const currentStep = data[selectedStep - 1];
    if (selectedStep === 3) {
      return (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className={styles.customTabs}
          style={{ marginTop: -20 }}
          items={Object.entries(currentStep.cards).map(([dataKey, platforms]) => ({
            key: dataKey,
            label: (
              <Typography.Text style={{ fontSize: isLargeScreen ? '24px' : '22px' }}>
                {dataKey}
              </Typography.Text>
            ),
            children: (
              <div className={styles.tabContent}>
                {platforms.map(
                  (
                    platform: JSX.IntrinsicAttributes & PlatformCardProps,
                    index: React.Key | null | undefined,
                  ) => (
                    <PlatformCard key={index} {...platform} />
                  ),
                )}
              </div>
            ),
          }))}
        />
      );
    }

    return (
      <div className={styles.tabContent}>
        {currentStep.cards?.all?.map((card, index) => <PlatformCard key={index} {...card} />)}
      </div>
    );
  };

  const renderFaqs = (faqData: FAQItem[]) => {
    return (
      <div className={styles.faqContent}>
        {faqData?.map((faq, index) => (
          <div key={index} className={styles.questionItem}>
            <div className="question">
              <span className="number">{index + 1}.</span>
              <span>{faq.question}</span>
            </div>
            {Array.isArray(faq.answer) ? (
              faq.answer?.map((item, index) => (
                <div
                  className="answer"
                  key={index}
                  style={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))
            ) : (
              <div
                className="answer"
                style={{ whiteSpace: 'pre-line' }}
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: contentPadding }}>
      {isNil(faqDetailId) ? (
        <ProCard
          split="vertical"
          title={
            <Typography.Text
              style={{
                fontSize: isLargeScreen ? '28px' : '26px',
              }}
            >
              一站式运维服务
            </Typography.Text>
          }
          style={{
            padding: isLargeScreen ? '24px 40px 60px' : '6px 14px 30px',
          }}
          headStyle={{
            marginBottom: isLargeScreen ? 20 : 6,
          }}
        >
          <ProCard
            colSpan={isLargeScreen ? '420px' : '320px'}
            style={{
              transition: 'width 0.3s ease',
              paddingRight: isLargeScreen ? 40 : 14,
            }}
          >
            {data.map((step, index) => (
              <StepItem
                key={index}
                index={index + 1}
                title={step.title}
                description={step.description}
                selected={selectedStep === index + 1}
                onClick={() => setSelectedStep(index + 1)}
              />
            ))}
          </ProCard>
          <ProCard
            headerBordered
            style={{
              height: '100%',
            }}
            bodyStyle={{
              padding: '0 38px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginTop: 12,
            }}
          >
            {renderStepContent()}
            <FAQ stepIndex={selectedStep - 1} faqData={data[selectedStep - 1]?.faqs?.all} />
          </ProCard>
        </ProCard>
      ) : (
        <ProCard
          split="vertical"
          title={
            <Typography.Text
              style={{
                fontSize: isLargeScreen ? '28px' : '26px',
              }}
            >
              快速上手 <span>|</span> FAQ
            </Typography.Text>
          }
          style={{
            padding: isLargeScreen ? '4px 40px 40px' : '0 30px 30px',
          }}
          headStyle={{
            marginBottom: isLargeScreen ? 20 : 16,
          }}
          extra={
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: homePrimaryColor,
                },
              }}
            >
              <Button
                onClick={() => {
                  history.push(`/home`);
                }}
              >
                返回
              </Button>
            </ConfigProvider>
          }
        >
          {renderFaqs(data[Number(faqDetailId)]?.faqs?.all)}
        </ProCard>
      )}
    </div>
  );
};

export default MaintenanceServices;
