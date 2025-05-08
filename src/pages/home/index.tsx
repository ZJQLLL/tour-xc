import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useLoad } from '@tarojs/taro'
import './index.less'

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>游记列表</Text>
      <Text>测试分支管理2</Text>
      <Text>task2</Text>
      <AtButton type='primary'>按钮</AtButton>
    </View>
  )
}
