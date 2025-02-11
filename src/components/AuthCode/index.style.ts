import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    input: {
      width: '45px',
      height: '45px',
      padding: '0',
      fontSize: '24px',
      textAlign: 'center',
      marginRight: '12px',
      textTransform: 'uppercase',
      color: '#494949',
      fontFamily: 'SF Pro Text, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif',
      border: '1px solid #d6d6d6',
      borderRadius: '4px',
      background: '#fff',
      backgroundClip: 'padding-box',
      '&:focus': {
        appearance: 'none',
        outline: '0',
        boxShadow: '0 0 0 3px rgb(131 192 253 / 50%)',
      },
    },
  };
});

export default useStyles;
