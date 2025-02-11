import { AuthCode, AuthCodeRef } from '@/components';
import { UserLoginRequest } from '@/pages/user/login/data';
import { login } from '@/pages/user/login/service';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { FEISHU_APP_ID } from '@/utils/constants';
import { setUserInfo } from '@/utils/utils';
import { createFromIconfontCN, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  history,
  SelectLang,
  useIntl,
  useLocation,
  useModel,
} from '@umijs/max';
import {
  Alert,
  Button,
  Col,
  Divider,
  message,
  Row,
  Space,
  Tabs,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import logoImg from './logo.svg';

const IconFontIcons = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4007128_to11zcmje6.js', // 在 iconfont.cn 上生成
});

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },

    cornerSwitch: {
      position: 'absolute',
      top: 2,
      right: 2,
      fontSize: '48px',
      cursor: 'pointer',
    },
    pcLogin: {
      top: 0,
      right: 0,
    },

    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',

      '& .ant-pro-form-login-page-notice': {
        background: 'url(/imgs/login_bg.png) left center no-repeat',
        backgroundSize: 'cover',
      },

      '& .ant-pro-form-login-page-left': {
        maxWidth: 700,
      },
      '& iframe': {
        border: 'none',
      },
      '& .ant-pro-form-login-page-desc': {
        transform: 'scale(0.9)',
        marginBlockStart: 22,
        marginBlockEnd: 30,
      },
    },

    authCodeContainer: {
      margin: '12px auto',
    },
  };
});

const ActionIcons = () => {
  const { styles } = useStyles();

  return (
    <>
      <Tooltip title="飞书登陆">
        <IconFontIcons type="c-icon-feishu" className={styles.action} />
      </Tooltip>
      {/*<TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.action} />*/}
      {/*<WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.action} />*/}
    </>
  );
};

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  // cursor: 'pointer',
};

type LoginType = UserLoginRequest['login_type'];

const Login: React.FC = () => {
  // const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<LoginType>('base');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();
  const { token } = theme.useToken();

  const [modalVisible, setModalVisible] = useState(false);

  const [MFAModalCanSubmit, setMFAModalCanSubmit] = useState(false);

  const [authCode, setAuthCode] = useState('');

  const [isQRLogin, setIsQRLogin] = useState(false);

  const handleOnChange = useCallback((res: string) => {
    setAuthCode(res);
  }, []);

  const authInputRef = useRef<AuthCodeRef>(null);

  const formRef = useRef<ProFormInstance>();
  const loginFormRef = useRef<ProFormInstance>();

  const QRLoginRef = useRef<any>();

  // const location = useLocation();

  const urlParams = new URL(window.location.href).searchParams;
  const cUrl = urlParams.get('redirect') || '/';

  const feishuAppId = initialState?.feishuAppId;

  // 飞书授权地址
  const larkAuthorizeUrl = `https://passport.feishu.cn/suite/passport/oauth/authorize?client_id=${feishuAppId}&redirect_uri=${encodeURIComponent(
    window.location.href,
  )}&response_type=code&state=${cUrl}`;

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  /**
   * 处理登录
   * @param values 表单数据
   * @param needRedirect 是否需要重定向，当登录失败时，需要重定向到登录页
   */
  const handleSubmit = useCallback(async (values: UserLoginRequest, needRedirect?: boolean) => {
    try {
      // 登录
      const result = await login(values);

      if (result.code === 66) {
        // 二次认证

        setModalVisible(true);

        return;
      }

      if (result.code === 0 && result.data) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        // await fetchUserInfo();

        const userInfo = result.data;

        //登录成功后，才删除localStorage中的username
        localStorage.removeItem(userInfo.username);
        setUserInfo(userInfo);

        const urlParams = new URL(window.location.href).searchParams;

        setTimeout(function () {
          window.location.href = userInfo.c_url || urlParams.get('redirect') || '/';
        }, 500);

        return;
      } else {
        if (needRedirect) {
          setTimeout(function () {
            window.location.replace('/user/login');
          }, 1000);
        }
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      // console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  }, []);
  // const { status, type: loginType } = userLoginState;

  const onMFAFinish = useCallback(async () => {
    // console.log(authCode);
    // message.success('提交成功');

    if (authCode.length === 6) {
      loginFormRef.current?.submit();
    }

    return true;
  }, [authCode]);

  const clearAuthCode = useCallback(() => {
    authInputRef.current?.clear();
  }, []);

  const handleLarkLogin = useCallback(async () => {
    window.location.assign(larkAuthorizeUrl);
  }, [larkAuthorizeUrl]);

  const generateQRCode = () => {
    const node = document.querySelector('iframe');
    if (node) {
      node.remove();
    }

    QRLoginRef.current = window.QRLogin({
      id: 'login_container',
      goto: larkAuthorizeUrl,
      width: '328',
      height: '286',
      // style: 'width:500px;height:600px', //可选的，二维码html标签的style属性
    });
  };

  const handleMessage = useCallback(
    function (event: any) {
      if (
        QRLoginRef.current &&
        QRLoginRef.current.matchOrigin(event.origin) &&
        QRLoginRef.current.matchData(event.data)
      ) {
        const loginTmpCode = event.data.tmp_code;
        window.location.href = `${larkAuthorizeUrl}&tmp_code=${loginTmpCode}`;
      }
    },
    [larkAuthorizeUrl],
  );
  if (typeof window.addEventListener != 'undefined') {
    window.addEventListener('message', handleMessage, false);
  } else if (typeof (window as any).attachEvent != 'undefined') {
    (window as any).attachEvent('onmessage', handleMessage);
  }

  /**
   * 登录
   * @param values 表单数据
   * @param code 飞书授权 code
   * @param state 飞书授权 state
   */
  const handleLogin = useCallback(
    async (values?: UserLoginRequest, code?: string) => {
      const urlParams = new URLSearchParams(window.location.search);
      const cUrl = urlParams.get('redirect') || urlParams.get('c_url') || '/';

      let loginData: UserLoginRequest = {};

      const isDynamic = authCode.length === 6;
      if (code) {
        // 执行相应的逻辑，处理获取到的 code 值
        //飞书登录
        loginData = {
          login_type: 'feishu',
          code,
          ...(isDynamic ? { dynamic: authCode } : {}),
          c_url: cUrl,
          fs_redirect_uri: `${encodeURIComponent(window.location.href)}`,
        };

        await handleSubmit(loginData, true);
      } else if (values) {
        //账号密码登录
        loginData = {
          username: values.username?.trim(),
          password: window.btoa(window.btoa(values.password?.trim() as string)),
          ...(isDynamic ? { dynamic: authCode } : { login_type: type }),
          c_url: cUrl,
        };
        await handleSubmit(loginData);
      }
    },
    [authCode, type],
  );

  const doLogin = async (values?: UserLoginRequest) => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    await handleLogin(values, code ?? '');
  };

  useEffect(() => {
    clearAuthCode();
  }, [modalVisible]);

  useEffect(() => {
    if (authCode.length === 6) {
      setMFAModalCanSubmit(true);
    } else {
      setMFAModalCanSubmit(false);
    }
  }, [authCode]);

  useEffect(() => {
    generateQRCode();
  }, [isQRLogin]);

  useEffect(() => {
    (async () => {
      await doLogin();
    })();
  }, []);

  // 二次验证弹窗如果可以提交，则自动提交
  useEffect(() => {
    if (MFAModalCanSubmit) {
      formRef.current?.submit();
    }
  }, [MFAModalCanSubmit]);

  const mfaModal = useMemo(
    () => (
      <ModalForm
        title="二次验证"
        open={modalVisible}
        width={580}
        formRef={formRef}
        onOpenChange={setModalVisible}
        submitter={{
          resetButtonProps: false,
          submitButtonProps: false,
          render: (props, dom) => {
            console.log(props);
            return [
              <Button key="reset" onClick={clearAuthCode}>
                重置
              </Button>,
              <Button
                type="primary"
                key="submit"
                onClick={() => formRef.current?.submit?.()}
                disabled={!MFAModalCanSubmit}
              >
                提交
              </Button>,
            ];
          },
        }}
        onFinish={onMFAFinish}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && MFAModalCanSubmit) {
            formRef.current?.submit();
          }
        }}
      >
        <Row justify={'center'}>
          <Col>
            <Row justify={'center'}>
              <AuthCode
                onChange={handleOnChange}
                containerClassName={styles.authCodeContainer}
                ref={authInputRef}
                allowedCharacters={'numeric'}
              />
            </Row>
            <Row justify={'center'}>
              <Typography.Text>
                请打开您手机上的Authenticator应用，找到生成的6位验证码并输入以继续。
              </Typography.Text>
            </Row>
          </Col>
        </Row>
      </ModalForm>
    ),
    [modalVisible, MFAModalCanSubmit],
  );

  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录</title>
      </Helmet>

      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <LoginFormPage<UserLoginRequest>
          style={{
            backgroundSize: 'auto',
          }}
          logo={<img alt="logo" src={logoImg} />}
          title="全球一站式运维"
          containerStyle={{
            backgroundImage: 'none',
            height: 500,
          }}
          backgroundImageUrl={''}
          formRef={loginFormRef}
          subTitle="研运一体，数字化驱动，卓越效能提升，精细化成本管理"
          submitter={{
            render: (_, dom) => !isQRLogin && dom.pop(),
          }}
          actions={
            !isQRLogin && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Divider plain>
                  <span
                    style={{
                      fontWeight: 'normal',
                      fontSize: 14,
                    }}
                  >
                    其他登录方式
                  </span>
                </Divider>
                <Space align="center" size={24}>
                  <Tooltip title="飞书登陆" placement={'right'}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        height: 40,
                        width: 40,
                        border: '1px solid ' + token.colorPrimaryBorder,
                        borderRadius: '50%',
                        cursor: 'pointer',
                      }}
                      onClick={handleLarkLogin}
                    >
                      {/*<AlipayOutlined style={{...iconStyles, color: '#1677FF'}}/>*/}

                      <IconFontIcons type="c-icon-feishu" style={{ ...iconStyles }} />
                    </div>
                  </Tooltip>
                </Space>
              </div>
            )
          }
          onFinish={async (values) => {
            await doLogin(values);
          }}
        >
          <div
            style={{
              display: isQRLogin ? 'block' : 'none',
              textAlign: 'center',
            }}
          >
            <div id="login_container"></div>

            <Space>
              <IconFontIcons type="c-icon-feishu" style={{ ...iconStyles }} />

              <Typography.Text type="secondary">飞书App扫一扫</Typography.Text>
            </Space>
          </div>
          <div
            style={{
              display: isQRLogin ? 'none' : 'block',
            }}
          >
            <Tabs
              activeKey={type}
              onChange={(activeKey) => {
                setType(activeKey as LoginType);
              }}
              centered
              items={[
                {
                  key: 'base',
                  label: '账号密码登录',
                },
                {
                  key: 'ldap',
                  label: 'LDAP',
                },
              ]}
            />

            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '请输入用户名!',
              })}
              rules={[
                {
                  required: !modalVisible, //如果二次验证弹窗打开，用户名不需要校验非空
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码: ant.design',
              })}
              rules={[
                {
                  required: !modalVisible, //如果二次验证弹窗打开，密码不需要校验非空
                  message: (
                    <FormattedMessage
                      id="pages.login.password.required"
                      defaultMessage="请输入密码！"
                    />
                  ),
                },
              ]}
            />
          </div>

          {isQRLogin ? (
            <Tooltip title="切换至账号登录">
              <IconFontIcons
                type="c-icon-pc-login"
                className={classNames(styles.cornerSwitch, styles.pcLogin)}
                onClick={() => {
                  setIsQRLogin(!isQRLogin);
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="飞书扫码，快速登陆">
              <IconFontIcons
                type="c-icon-saomadenglu01"
                className={styles.cornerSwitch}
                onClick={() => {
                  setIsQRLogin(!isQRLogin);
                }}
              />
            </Tooltip>
          )}
        </LoginFormPage>

        {mfaModal}
      </div>
    </div>
  );
};

export default Login;
