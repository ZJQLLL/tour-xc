// utils/upload.ts
import Taro from '@tarojs/taro'

export async function uploadFileToQiniu(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: 'https://p9zej3r6lf.hzh.sealos.run/upload_files', // 替换为你的接口地址
      filePath,
      name: 'file',
      formData: {
        type: 'uploadFile'
      },
      success: res => {
        try {
          const result = JSON.parse(res.data)
          if (result.code === 0 && result.data?.fileUrl) {
            resolve(`http://${result.data.fileUrl}`)
          } else {
            reject(result.msg || '上传失败')
          }
        } catch (err) {
          reject('解析响应失败')
        }
      },
      fail: err => {
        reject('上传接口失败: ' + err.errMsg)
      }
    })
  })
}
