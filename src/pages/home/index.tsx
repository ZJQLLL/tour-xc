import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtSearchBar } from 'taro-ui'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { useState } from 'react'
import './index.less'
import { noteItem } from '../../../types/noteItem'

const pageSize = 10

export default function Index() {
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [leftList, setLeftList] = useState<noteItem[]>([])
  const [rightList, setRightList] = useState<noteItem[]>([])
  const [keyword, setKeyword] = useState<string>('')


  const fetchNotes = async (nextPage = 1,searchKeyword = keyword) => {
    if (loading) return
    setLoading(true)

    try {
      const res = await Taro.request({
        url: `https://p9zej3r6lf.hzh.sealos.run/get_tour_list?page=${nextPage}&pageSize=${pageSize}&keyword=${searchKeyword.trim()}`,
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
    fetchNotes(1,'')
  })

  useReachBottom(() => {
    if (hasMore) {
      fetchNotes(page + 1,keyword)
    }
  })

  return (
    <View className='container'>
      {/* <Text className='title'>游记列表</Text> */}
      <AtSearchBar
        value={keyword}
        onChange={(val) => setKeyword(val)}
        onConfirm={() => fetchNotes(1,keyword)}  // 回车或点击搜索按钮触发搜索
        onActionClick={() => fetchNotes(1,keyword)} // 点击“搜索”按钮也触发
        placeholder='搜索标题或昵称'
        onClear={() => {
            setKeyword('')
            fetchNotes(1,'') // 清空搜索后刷新第一页
          }}
      />

      <View className='masonry'>
        <View className='column'>
          {leftList.map((note, index) => (
            <View
              key={`left-${index}`}
              className='note-card'
              onClick={() => Taro.navigateTo({ url: `/pages/home/noteDetail/index?id=${note._id}` })}
            >
              <Image
                className='cover'
                src={note.coverImage??'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
                mode='widthFix'
                style={{ height: `${note._height}px` }}
              />
              <Text className='note-title'>{note.title}</Text>
              <View className='note-author-wrap'>
                <View className='tem'>
                  <Image className='avatar' src={note.author?.avatar??'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />
                  <Text className='note-author'>{note.author?.nickname}</Text>
                </View>
                <View className='tem'>
                  <AtIcon value='eye' size='16' color='#666'></AtIcon>
                <Text className='note-view-count'>{note.views}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View className='column'>
          {rightList.map((note, index) => (
            <View
              key={`right-${index}`}
              className='note-card'
              onClick={() => Taro.navigateTo({ url: `/pages/home/noteDetail/index?id=${note._id}` })}
            >
              <Image
                className='cover'
                src={note.coverImage??'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'}
                mode='widthFix'
                style={{ height: `${note._height}px` }}
              />
              <Text className='note-title'>{note.title}</Text>
              <View className='note-author-wrap'>
                <View className='tem'>
                  <Image className='avatar' src={note.author?.avatar??'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />
                  <Text className='note-author'>{note.author?.nickname}</Text>
                </View>
                <View className='tem'>
                  <AtIcon value='eye' size='16' color='#666'></AtIcon>
                <Text className='note-view-count'>{note.views}</Text>
              </View>
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
