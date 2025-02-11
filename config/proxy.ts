/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  // dev: {
  //   // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
  //   '/api/': {
  //     // 要代理的地址
  //     target: 'https://preview.pro.ant.design',
  //     // 配置了这个可以从 http 代理到 https
  //     // 依赖 origin 的功能可能需要这个，比如 cookie
  //     changeOrigin: true,
  //   },
  // },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },

  dev: {
    '/web/flow/': {
      // target: 'http://localhost:8888',
      // target: 'http://localhost:8100',// 旧版
      target: 'http://localhost:8300', //新版
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/cmdb/': {
      target: 'http://localhost:8082',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/mg/': {
      target: 'http://localhost:8088',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/gw/': {
      target: 'http://localhost:8110',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/kerrigan/': {
      target: 'http://localhost:8188',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/temp/': {
      target: 'http://localhost:7878',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/servermgmt/': {
      target: 'http://localhost:7979',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/cnmp/': {
      target: 'http://localhost:7878',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/noc/': {
      target: 'http://localhost:8084',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    '/web/monitor/': {
      target: 'http://localhost:8234',
      changeOrigin: true,
      // pathRewrite: { '^': '' },
    },

    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      // target: 'https://proapi.azurewebsites.net',
      // target: 'http://10.60.16.5:8886/',
      // target: 'https://codo-pre.123u.com/',
      // target: 'http://codo-pre.123u.com/',
      // target: 'http://10.0.172.164/', //yanchuan (admin/tuanzi)
      target: 'https://codo-pre.123u.com/',
      // target: 'https://codo.huanle.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },

    '/api2/': {
      // target: 'http://10.60.16.5:8886/',
      target: 'http://codo-pre.123u.com/',
      // target: 'http://10.0.172.164/', //yanchuan

      changeOrigin: true,
      pathRewrite: { '^/api2/': '/api/' },
    },

    //region 区服管理项目用
    '/api_flow/': {
      // target: 'http://10.60.16.5:8886/',
      // target: 'https://codo-pre.123u.com/',
      target: 'http://codo-pre.123u.com/',
      // target: 'http://10.0.172.164/', //yanchuan

      changeOrigin: true,
      pathRewrite: { '^/api_flow/': '/api/' },
    },

    '/api_servermgmt/': {
      // target: 'http://192.168.15.168:8899/',
      // target: 'https://codo-pre.123u.com/',
      // target: 'http://codo-pre.123u.com/',
      target: 'http://codo-pre.123u.com/',

      changeOrigin: true,
      pathRewrite: { '^/api_servermgmt/': '/api/' },
    },
    //endregion 区服管理项目用

    '/apitest/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^/apitest/': '/api/' },
    },
  },

  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
