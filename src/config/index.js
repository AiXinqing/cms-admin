export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'news-admin',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: true,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: 'http://47.94.33.237:8081/',
    pro: 'http://47.94.33.237:8081/'
  },
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'news_index',
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  },

  kankanTypes: [
    {
      value: 0,
      label: '文章'
    },
    {
      value: 1,
      label: '视频'
    }
  ],

  tabTypes: [
    {
      value: 2,
      label: '新闻'
    },
    {
      value: 5,
      label: '看看号'
    },
    {
      value: 3,
      label: '专栏'
    },
    {
      value: 4,
      label: '视频'
    }
  ],

  privilegeList: [
    {
      value: '1',
      label: '发布新闻'
    },
    {
      value: '2',
      label: '看看号作者'
    },
    {
      value: '3',
      label: '看看号审核员'
    },
    {
      value: '4',
      label: '角色管理员'
    }
  ]
}
