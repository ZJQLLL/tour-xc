export default defineAppConfig({
  pages: [
    'pages/home/index',
    "pages/my/index",
    'pages/home/noteDetail/index'
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
        "pagePath": "pages/my/index",
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
