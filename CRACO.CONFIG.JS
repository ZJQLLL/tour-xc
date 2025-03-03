// 扩展webpack的配置
const path = require('path')

module.exports={
  // webpack配置
  webpack:{
    alias:{
      // 约定使用@表示src文件路径
      '@':path.resolve(__dirname,'src')
    }
  }
  
}