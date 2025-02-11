import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    childApp: {
      height: 'calc(100vh - 56px)',
      overflowY: 'hidden',
    },
  };
});

export default useStyles;
