import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/users_manage',
    name: 'users_manage',
    meta: {
      icon: 'logo-buffer',
      title: '用户管理',
      hideInBread: true,
      access: ['admin']
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'user_list',
        meta: {
          icon: 'logo-buffer',
          title: '用户管理'
        },
        component: () => import('@/view/users/index.vue')
      },
      {
        path: 'role',
        name: 'user_role',
        meta: {
          icon: 'logo-buffer',
          title: '用户角色'
        },
        component: () => import('@/view/users/role.vue')
      },
      {
        path: 'privilege',
        name: 'user_privilege',
        meta: {
          icon: 'logo-buffer',
          title: '权限管理'
        },
        component: () => import('@/view/users/privilege.vue')
      }
    ]
  },
  {
    path: '/tabs',
    name: 'tabs',
    meta: {
      icon: 'logo-buffer',
      title: '分类管理',
      hideInBread: true,
      access: ['admin']
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'tabs_index',
        meta: {
          icon: 'logo-buffer',
          title: '分类管理',
          access: ['admin']
        },
        component: () => import('@/view/tabs/index.vue')
      }
    ]
  },
  {
    path: '/kankan',
    name: 'kankan',
    meta: {
      icon: 'logo-buffer',
      title: '看看分类',
      hideInBread: true,
      access: ['admin']
    },
    component: Main,
    children: [
      {
        path: 'types',
        name: 'kankan_types_index',
        meta: {
          icon: 'logo-buffer',
          title: '看看分类管理'
        },
        component: () => import('@/view/kankan/types.vue')
      },
      {
        path: 'user',
        name: 'kankan_user_index',
        meta: {
          icon: 'logo-buffer',
          title: '看看用户管理'
        },
        component: () => import('@/view/kankan/user.vue')
      }
    ]
  },
  {
    path: '/hot-spot',
    name: 'hot',
    meta: {
      icon: 'logo-buffer',
      title: '热点管理',
      hideInBread: true,
      access: ['admin']
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'hot_index',
        meta: {
          icon: 'logo-buffer',
          title: '热点管理'
        },
        component: () => import('@/view/hot/index.vue')
      }
    ]
  },
  {
    path: '/works',
    name: 'works',
    meta: {
      icon: 'logo-buffer',
      title: '作品列表',
      hideInBread: true,
      access: ['admin', 'author']
    },
    component: Main,
    children: [{
      path: '',
      name: 'works_index',
      meta: {
        icon: 'logo-buffer',
        title: '作品列表'
      },
      component: () => import('@/view/work/index.vue')
    }]
  },
  {
    path: '/news',
    name: 'news',
    meta: {
      icon: 'logo-buffer',
      title: '新闻',
      hideInBread: true,
      access: ['admin', 'reporter']
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'news_index',
        meta: {
          icon: 'logo-buffer',
          title: '新闻列表'
        },
        component: () => import('@/view/news/index.vue')
      }
    ]
  },
  {
    path: '/news/create',
    meta: {
      icon: 'logo-buffer',
      title: '发布新闻',
      hideInBread: true,
      access: ['reporter']
    },
    component: Main,
    children: [{
      path: '',
      name: 'news_create',
      meta: {
        icon: 'logo-buffer',
        title: '发布新闻',
        access: ['reporter']
      },
      component: () => import('@/view/news/new.vue')
    }]
  },
  {
    path: '/work',
    name: 'work',
    meta: {
      icon: 'logo-buffer',
      title: '发布作品',
      hideInBread: true,
      access: ['author']
    },
    component: Main,
    children: [{
      path: 'create',
      name: 'work_create',
      meta: {
        icon: 'logo-buffer',
        title: '发布作品',
        access: ['author']
      },
      component: () => import('@/view/work/new.vue')
    }]
  },
  {
    path: '/apply',
    name: 'apply',
    meta: {
      icon: 'logo-buffer',
      title: '申请',
      hideInBread: true,
      access: ['reporter', 'none']
    },
    component: Main,
    children: [
      {
        path: 'kankan',
        name: 'apply_kankan',
        meta: {
          icon: 'logo-buffer',
          title: '申请看看号'
        },
        component: () => import('@/view/apply/kankan.vue')
      }
    ]
  },
  {
    path: '/applications',
    name: 'applications_host',
    meta: {
      icon: 'logo-buffer',
      title: '申请',
      hideInBread: true,
      access: ['admin']
    },
    component: Main,
    children: [
      {
        path: '',
        name: 'applications',
        meta: {
          icon: 'logo-buffer',
          title: '申请管理',
          access: ['admin']
        },
        component: () => import('@/view/applications/index.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      // hideInMenu: true,
      icon: 'logo-buffer',
      title: '组件'
    },
    component: Main,
    children: [
      {
        path: 'count_to_page',
        name: 'count_to_page',
        meta: {
          icon: 'md-trending-up',
          title: '数字渐变'
        },
        component: () => import('@/view/components/count-to/count-to.vue')
      },
      {
        path: 'drag_list_page',
        name: 'drag_list_page',
        meta: {
          icon: 'ios-infinite',
          title: '拖拽列表'
        },
        component: () => import('@/view/components/drag-list/drag-list.vue')
      },
      {
        path: 'drag_drawer_page',
        name: 'drag_drawer_page',
        meta: {
          icon: 'md-list',
          title: '可拖拽抽屉'
        },
        component: () => import('@/view/components/drag-drawer')
      },
      {
        path: 'cropper_page',
        name: 'cropper_page',
        meta: {
          icon: 'md-crop',
          title: '图片裁剪'
        },
        component: () => import('@/view/components/cropper/cropper.vue')
      },
      {
        path: 'tables_page',
        name: 'tables_page',
        meta: {
          icon: 'md-grid',
          title: '多功能表格'
        },
        component: () => import('@/view/components/tables/tables.vue')
      },
      {
        path: 'split_pane_page',
        name: 'split_pane_page',
        meta: {
          icon: 'md-pause',
          title: '分割窗口'
        },
        component: () => import('@/view/components/split-pane/split-pane.vue')
      },
      {
        path: 'markdown_page',
        name: 'markdown_page',
        meta: {
          icon: 'logo-markdown',
          title: 'Markdown编辑器'
        },
        component: () => import('@/view/components/markdown/markdown.vue')
      },
      {
        path: 'editor_page',
        name: 'editor_page',
        meta: {
          icon: 'ios-create',
          title: '富文本编辑器'
        },
        component: () => import('@/view/components/editor/editor.vue')
      },
      {
        path: 'icons_page',
        name: 'icons_page',
        meta: {
          icon: '_bear',
          title: '自定义图标'
        },
        component: () => import('@/view/components/icons/icons.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
