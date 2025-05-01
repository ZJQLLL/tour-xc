import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
//import './index.less'

export default function Profile () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View>
      <Text>我的</Text>
    </View>
  )
}
