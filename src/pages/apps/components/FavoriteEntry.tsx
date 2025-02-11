import { Application, FavoriteAppItemDataType } from '@/pages/apps/data';
import { Box } from '@mui/material';
import { message, Rate, theme, Typography } from 'antd';
import React from 'react';

const { getDesignToken } = theme;

// 获取全局的token配置
const globalToken = getDesignToken();

interface IProps {
  onUpdate?: (appId: number) => void; // 更新回调
  entryData: FavoriteAppItemDataType; // 入口数据
}

const FavoriteEntry: React.FC<IProps> = ({ entryData, onUpdate }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '40px',
        display: 'flex',
        lineHeight: '40px',
        alignItems: 'center',
        textIndent: '10px',
        cursor: 'pointer',
        borderRadius: '6px',
        gap: '10px',
        '&:hover': {
          backgroundColor: globalToken.colorBgTextHover,
        },
      }}
      onClick={() => {
        onUpdate?.(entryData.id);

        if (entryData.href) {
          window.open(entryData.href);
        } else {
          window.location.assign(`/${entryData.frontend_code ?? entryData.app_code}`);
        }
      }}
    >
      {entryData.name}
    </Box>
  );
};

export default FavoriteEntry;
