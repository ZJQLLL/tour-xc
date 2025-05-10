import { View, Text, Image, Swiper, SwiperItem, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { toBeijingTime } from '@/utils/common'
import './index.less'
import { noteDetailItem } from '../../../../types/noteDetail'

export default function NoteDetail() {
  const [note, setNote] = useState<noteDetailItem>()

  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: '笔记详情'
    })
    const id = Taro.getCurrentInstance().router?.params?.id
    if (id) {
      fetchNote(id)
    }
  })

  const fetchNote = async (id: string) => {
    const res = await Taro.request({
      url: `https://p9zej3r6lf.hzh.sealos.run/get_tour_detail?id=${id}`,
      method: 'GET',
    })
    setNote(res.data?.data || {})
  }

  if (!note) return <Text>加载中...</Text>

  return (
    <View className='note-detail'>
      <Swiper className='swiper' circular autoplay>
        {note.images?.map((img, i) => (
          <SwiperItem key={i}>
            <Image
              className='swiper-image'
              src={img}
              mode='aspectFill'
              onClick={() => Taro.previewImage({
                current: img,
                urls: note.images
              })}
            />
          </SwiperItem>
        ))}
      </Swiper>


      <View className='title-author'>
        <Text className='note-title'>{note.title}</Text>
        <View className='author'>
          <Image className='avatar' src={note.author?.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} />
          <Text className='nickname'>{note.author?.nickname}</Text>
        </View>
      </View>


      <View className='content'>
        <Text>{note.content}</Text>
      </View>

      <View className='location'>
        <Text className='city'>编辑于 {toBeijingTime(note.createdAt)}</Text>
        <AtIcon value='map-pin' size='20' color='black'></AtIcon>
        <Text className='city'>IP:  {note.location || '杭州'}</Text>
      </View>

       <View className='bottom-bar'>
        <Text className='text'>❤️ {note.likes || 0}</Text>
        <Text className='text'>💬 {note.commentCount || 0}</Text>
        <Input className='comment-input' placeholder='写个评论在心上~' />
      </View>

      <View className='comment-section'>
        <Text className='comment-title'>评论区</Text>
        {note.comments?.length > 0 ? (
          note.comments.map((comment, index) => (
            <View key={index} className='comment-item'>
              <View className='comment-header'>
                <Image className='comment-avatar' src={comment.avatar} />
                <Text className='comment-nickname'>{comment.username}</Text>
                <Text className='comment-time'>{toBeijingTime(comment.createdAt)}</Text>
              </View>
              <Text className='comment-content'>{comment.content}</Text>
            </View>
          ))
        ) : (
          <Text className='no-comment'>暂无评论~</Text>
        )}
      </View>


    </View>
  )
}
