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
      <AtButton type='primary'>按钮</AtButton>
    </View>
  )
}
