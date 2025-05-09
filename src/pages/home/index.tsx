import { View, Text, Image } from '@tarojs/components'
import { AtAvatar, AtIcon } from 'taro-ui'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { useState } from 'react'
import './index.less'

const pageSize = 10

export default function Index() {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [leftList, setLeftList] = useState<any[]>([])
  const [rightList, setRightList] = useState<any[]>([])

  const fetchNotes = async (nextPage = 1) => {
    if (loading) return
    setLoading(true)

    try {
      const res = await Taro.request({
        url: `https://p9zej3r6lf.hzh.sealos.run/get_tour_list?page=${nextPage}&pageSize=${pageSize}`,
        method: 'GET',
      })

      const list = res.data.data || []
      const withHeights = list.map((item: any) => ({
        ...item,
        _height: Math.floor(250 + Math.random() * 200) // 模拟每张图不同高度
      }))

      const [newLeft, newRight] = distributeToTwoColumns(
        nextPage === 1 ? [] : leftList,
        nextPage === 1 ? [] : rightList,
        withHeights
      )

      setLeftList(newLeft)
      setRightList(newRight)


      setHasMore(withHeights.length === pageSize)
      setPage(nextPage)
    } catch (err) {
      console.error('加载游记失败', err)
    } finally {
      setLoading(false)
    }
  }

  useLoad(() => {
    fetchNotes(1)
  })

  useReachBottom(() => {
    if (hasMore) {
      fetchNotes(page + 1)
    }
  })

  return (
    <View className='container'>
      <Text className='title'>游记列表</Text>
      <View className='masonry'>
        <View className='column'>
          {leftList.map((note, index) => (
            <View key={`left-${index}`} className='note-card'>
              <Image
                className='cover'
                src={note.coverImage}
                mode='widthFix'
                style={{ height: `${note._height}px` }}
              />
              <Text className='note-title'>{note.title}</Text>
              <View className='note-author-wrap'>
              <AtAvatar
                circle
                image={note.author?.avatar||'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
                className='note-author-avatar'
                size='small'
              ></AtAvatar>
              <Text className='note-author'>{note.author?.nickname}</Text>
              <AtIcon value='eye' size='16' color='#666'></AtIcon>
              <Text className='note-view-count'>{note.views}</Text>
              </View>

            </View>
          ))}
        </View>
        <View className='column'>
          {rightList.map((note, index) => (
            <View key={`right-${index}`} className='note-card'>
              <Image
                className='cover'
                src={note.coverImage}
                mode='widthFix'
                style={{ height: `${note._height}px` }}
              />
              <Text className='note-title'>{note.title}</Text>
              <View className='note-author-wrap'>
              <AtAvatar
                circle
                image={note.author?.avatar||'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
                className='note-author-avatar'
                size='small'
              ></AtAvatar>
              <Text className='note-author'>{note.author?.nickname}</Text>
              <AtIcon value='eye' size='16' color='#666'></AtIcon>
              <Text className='note-view-count'>{note.views}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      {!hasMore && <Text className='no-more'>没有更多了~</Text>}
    </View>
  )
}

// 分发卡片到左右列
function distributeToTwoColumns(
  leftList: any[],
  rightList: any[],
  newItems: any[]
): [any[], any[]] {
  let leftHeight = leftList.reduce((acc, item) => acc + item._height, 0)
  let rightHeight = rightList.reduce((acc, item) => acc + item._height, 0)

  const left = [...leftList]
  const right = [...rightList]

  newItems.forEach(item => {
    if (leftHeight <= rightHeight) {
      left.push(item)
      leftHeight += item._height
    } else {
      right.push(item)
      rightHeight += item._height
    }
  })

  return [left, right]
}
