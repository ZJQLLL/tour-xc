export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/login/index',
    'pages/register/index',
    'pages/home/noteDetail/index',
    'pages/my-travel/index',
    'pages/publish/index',
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/home/index",
        "text": "首页",
        "iconPath": "static/tabs/home_default.png",
        "selectedIconPath": "static/tabs/home_selected.png"
      },
      {
        // 'pagePath':'pages/createNote/index',
        'pagePath':'pages/publish/index',
        'text':'',
        'iconPath':'static/tabs/plus.png',
        'selectedIconPath':'static/tabs/plus.png'
      },
      {
        "pagePath": "pages/my-travel/index",
        "text": "我的",
        "iconPath": "static/tabs/user_default.png",
        "selectedIconPath": "static/tabs/user_selected.png"
      }

    ],
    "color": "#000000",
    "selectedColor": "#1E90FF",
    "backgroundColor": "#ffffff",
    "borderStyle": "black"
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
