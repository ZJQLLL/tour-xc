## Environment Prepare

采用pnpm作为包管理工具(pnpm -v来判断是否已经按装)

```bash
npm install -g pnpm
```

 
Install `node_modules`:

```bash
pnpm install  --registry https://registry.npmmirror.com
```

微信小程序启动(可以安装一个微信开发者工具来模拟小程序端的效果)
```bash
pnpm dev:weapp
```
