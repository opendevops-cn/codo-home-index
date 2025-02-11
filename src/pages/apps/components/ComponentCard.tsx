import { appIconMap } from '@/utils/utils';
import { FileTextOutlined } from '@ant-design/icons';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Col, Image, message, Rate, Row, Space, theme, Tooltip } from 'antd';
import type { Application } from '../data';

interface IProps {
  entryData: Application;
  onUpdateFavorite?: (app: Application) => void;
  onUpdateRecentVisited?: (appId: number) => void;
}

export function ComponentCard({ entryData, onUpdateFavorite, onUpdateRecentVisited }: IProps) {
  const { getDesignToken } = theme;

  // 获取全局的token配置
  const globalToken = getDesignToken();

  // 使用 MUI 的 useTheme 和 useMediaQuery 钩子
  const muiTheme = useTheme();

  // 使用更多的断点
  const isBreakpoint1 = useMediaQuery(muiTheme.breakpoints.down(1620));
  const isBreakpoint2 = useMediaQuery(muiTheme.breakpoints.between(1620, 1750));
  const isBreakpoint3 = useMediaQuery(muiTheme.breakpoints.up(1750));

  // 根据屏幕宽度确定卡片宽度
  const cardWidth = isBreakpoint1
    ? '300px'
    : isBreakpoint2
      ? '330px'
      : isBreakpoint3
        ? '360px'
        : '100%';

  return (
    <Box
      sx={{
        border: '1px solid #F0F2F5',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'flex-start',
        p: '20px',
        boxSizing: 'border-box',
        gap: '24px',
        width: cardWidth,
        maxWidth: '100%',
        cursor: 'pointer',
        ':hover': {
          boxShadow: '10px 10px 50px 0px rgba(25, 48, 129, 0.10)',
          borderColor: globalToken.colorPrimaryBg,
          background: 'url("/imgs/card_bg.png") no-repeat center center',
          '.component-name': {
            color: globalToken.colorPrimary,
          },
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
        // history.push(`/${entryData.frontend_code}`);
        onUpdateRecentVisited?.(entryData.id);

        if (entryData.href) {
          window.open(entryData.href);
        } else {
          window.location.assign(`/${entryData.frontend_code ?? entryData.app_code}`);
        }
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          padding: '8px',
          borderRadius: 1,
          bgcolor: '#F2F7FF',
        }}
      >
        <Image
          preview={false}
          width={28}
          height={28}
          alt={entryData.icon}
          src={appIconMap[entryData.icon || 'default']}
          fallback={
            'data:image/png;base64,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'
          }
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // width: '100%',
            mb: '8px',
          }}
        >
          <Box
            className="component-name"
            sx={{
              color: '#1E2226',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '22px',
              width: '100%',

              // mb: 1,
            }}
          >
            <Row justify={'space-between'}>
              <Col>{entryData.name}</Col>

              <Col
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Space size={'middle'}>
                  <Tooltip title="产品手册">
                    <FileTextOutlined
                      style={{
                        fontSize: '13px',
                        marginBottom: '6px',
                      }}
                      onClick={() => {
                        message.info('暂未开放');
                      }}
                    />
                  </Tooltip>
                  <Rate
                    value={entryData.isFavorite ? 1 : 0}
                    count={1}
                    onChange={() => {
                      onUpdateFavorite?.(entryData);
                    }}
                    style={{ fontSize: 16 }}
                  />
                </Space>
              </Col>
            </Row>
          </Box>
        </Box>
        <Box
          sx={{
            color: '#8A9099',
            height: '40px',
            // mb: '16px',
            fontSize: 12,
            lineHeight: '20px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'justify',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {entryData.description}
        </Box>
      </Box>
    </Box>
  );
}
