import { View, Text, Image, Swiper, SwiperItem, Input, Video } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Taro, { useLoad } from '@tarojs/taro'
import {  useEffect, useState } from 'react'
import { toBeijingTime } from '@/utils/common'
import './index.less'
import { noteDetailItem } from '../../../../types/noteDetail'

export default function NoteDetail() {
  const [note, setNote] = useState<noteDetailItem>()

  const [playVideo, setPlayVideo] = useState(false)
  const [liked, setLiked] = useState(false)       // 是否点赞
  const [likeCount, setLikeCount] = useState<number>(0)  // 当前点赞数


  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: '笔记详情'
    })
    const id = Taro.getCurrentInstance().router?.params?.id
    if (id) {
      fetchNote(id)
    }
  })

  useEffect(() => {
  if (note?.likes !== undefined) {
    setLikeCount(note.likes)
  }
}, [note])

  const fetchNote = async (id: string) => {
    const res = await Taro.request({
      url: `https://p9zej3r6lf.hzh.sealos.run/get_tour_detail?id=${id}`,
      method: 'GET',
    })
    setNote(res.data?.data || {})
    setLikeCount(res.data?.data?.like_count || 0)
  }

  const handleLike = () => {
  if (liked) {
    setLikeCount(prev => prev - 1)
  } else {
    setLikeCount(prev => prev + 1)
  }
  setLiked(!liked)

  // 👉 可选：异步请求接口同步点赞状态
  // Taro.request({
  //   url: 'https://你的接口地址/update_like',
  //   method: 'POST',
  //   data: {
  //     noteId: note._id,
  //     liked: !liked
  //   }
  // })
}


  if (!note) return <Text>加载中...</Text>

  return (
    <View className='note-detail'>

      {note.video?.url ? (
  <View className='video-container'>
    {!playVideo ? (
      <View
        className='video-cover'
        onClick={() => {
          setPlayVideo(true)
          setTimeout(() => {
            const videoCtx = Taro.createVideoContext('videoPlayer')
            videoCtx.requestFullScreen({ direction: 90 }) // 横屏
            videoCtx.play()
          }, 200)
        }}
      >
        <Image
          className='swiper-image'
          src={note.video?.cover}
          mode='aspectFill'
          style={{ width: '100%', height: '220px' }}
        />
        <View className='play-icon'>
          <AtIcon value='play' size='32' color='#fff' />
        </View>
      </View>
    ) : (
      <Video
        id='videoPlayer'
        className='video-player'
        src={note.video?.url}
        initialTime={0}
        controls
        autoplay
        loop={false}
        muted={false}
        showFullscreenBtn
        showPlayBtn
        enablePlayGesture
        style={{
          width: '100%',
          height: '220px',
          borderRadius: '8px'
        }}
      />
    )}
  </View>
) : (
  <Swiper className='swiper' circular autoplay>
    {note.images?.map((img, i) => (
      <SwiperItem key={i}>
        <Image
          className='swiper-image'
          src={img}
          mode='aspectFill'
          onClick={() =>
            Taro.previewImage({
              current: img,
              urls: note.images
            })
          }
        />
      </SwiperItem>
    ))}
  </Swiper>
)}


      {/* <Swiper className='swiper' circular autoplay>
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
      </Swiper> */}


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
  <View className='like-box' onClick={handleLike}>
    <AtIcon
      value={liked ? 'heart-2' : 'heart'}
      size='20'
      color={liked ? '#f00' : '#888'}
    />
    <Text className='text'>{likeCount}</Text>
  </View>

  <View className='comment-box'>
    <AtIcon value='message' size='20' color='#666' />
    <Text className='text'>{note.commentCount || 0}</Text>
  </View>

  <Input className='comment-input' placeholder='写个评论在心上~' />
</View>


       {/* <View className='bottom-bar'>
        <Text className='text'>❤️ {note.likes || 0}</Text>
        <Text className='text'>💬 {note.commentCount || 0}</Text>
        <Input className='comment-input' placeholder='写个评论在心上~' />
      </View> */}

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
