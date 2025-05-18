import { useEffect, useState } from 'react';
import { uploadFileToQiniu } from '@/api/upload';
import { View, Text, Input, Textarea, Button, Image, Video } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import {  saveTravel, updateTravel } from '@/api/travel';
import { checkLogin } from '@/utils/auth';
import './index.less'; // 建议写一些样式放在这里


const Publish = () => {
  const router = useRouter();
  const id = router?.params?.id;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   checkLogin();
  //   if (id) fetchTravel(id);
  // }, [id]);

  useEffect(() => {
    checkLogin();
    if (id) {
      fetchTravel(id);
    } else {
      // 新建游记，清空状态
      setTitle('');
      setContent('');
      setImages([]);
      setVideo('');
    }
  }, [id, router.params]);



  const fetchTravel = async (id) => {
    // const res = await getTravelById(id);
    const res = await Taro.request({
      url: `https://p9zej3r6lf.hzh.sealos.run/get_tour_detail?id=${id}`,
      method: 'GET',
    })
    const t = res.data.data;
    console.log('获取游记:', t);
    setTitle(t.title);
    setContent(t.content);
    setImages(t.images || []);
    setVideo(t.video || null);
  };

  // const handleChooseImages = async () => {
  //   const res = await Taro.chooseImage({ count: 9 - images.length });
  //   setImages([...images, ...res.tempFilePaths]);
  // };

  const handleChooseImages = async () => {
  const res = await Taro.chooseImage({ count: 9 - images.length });

  Taro.showLoading({ title: '上传中...' });

  try {
    // 并发上传所有图片
    const uploaded = await Promise.all(
      res.tempFilePaths.map(filePath => uploadFileToQiniu(filePath))
    );

    // 保存上传后返回的七牛云 URL
    setImages([...images, ...uploaded]);
  } catch (err) {
    Taro.showToast({ title: String(err), icon: 'none' });
  } finally {
    Taro.hideLoading();
  }
};

  //   const handleChooseImages = async () => {
  //     const res = await Taro.chooseImage({ count: 9 - images.length });
  //     console.log(res.tempFilePaths);
  //     const uploaded = await Promise.all(
  //         res.tempFilePaths.map(async (path) => {
  //             const uploadRes = await uploadFile(path, 'image');
  //             console.log(uploadRes);
  //             return JSON.parse(uploadRes.data).url;
  //         })
  //     )
  //     setImages([...images, ...uploaded]);
  // };
  const handleChooseVideo = async () => {
    const res = await Taro.chooseVideo({});
    setVideo(res.tempFilePath);
  };

  const handleSubmit = async () => {
    if (!title || !content || images.length === 0) {
      Taro.showToast({ title: '请填写所有必填项', icon: 'none' });
      return;
    }

    setLoading(true);
    const user = Taro.getStorageSync('user');

    const payload = {
      id,
      title,
      content,
      images,
      video,
      author: {
        id: user.id,
        nickname: user.username,
        avatar: user.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      },
    };

    id?await updateTravel(payload):await saveTravel(payload)
    setLoading(false);

     Taro.showToast({ title: id ? '更新成功' : '发布成功' });
      if (!id) {
        setTitle('')
        setContent('')
        setImages([])
        setVideo('')
      }
      // Taro.switchTab({ url: '/pages/my-travel/index' });
      setTimeout(() => {
  Taro.switchTab({ url: '/pages/my-travel/index' });
}, 1500); // 延迟 1.5 秒，保证 toast 显示

    // if (res.statusCode === 200) {
    //   Taro.showToast({ title: id ? '更新成功' : '发布成功' });
    //   if (!id) {
    //     setTitle('')
    //     setContent('')
    //     setImages([])
    //     setVideo('')
    //   }
    //   Taro.switchTab({ url: '/pages/my-travel/index' });
    // } else {
    //   Taro.showToast({ title: '提交失败', icon: 'none' });
    // }
  };

  return (
    <View className='publish-page'>
      <Text className='section-title'>标题</Text>
      <Text className='star'>*</Text>
      <Input className='input' value={title} placeholder='请输入游记标题' onInput={(e) => setTitle(e.detail.value)} />

      <Text className='section-title'>内容</Text>
      <Text className='star'>*</Text>

      <Textarea
        className='textarea'
        value={content}
        placeholder='请输入游记正文'
        onInput={(e) => setContent(e.detail.value)}
      />

      <Text className='section-title'>图片（最多九张）</Text>
      <Text className='star'>*</Text>
      <Button className='upload-btn' onClick={handleChooseImages}>选择图片</Button>
      <View className='image-preview'>
        {images.map((img) => (
          <Image key={img} src={img} mode='aspectFill' className='preview-img' />
        ))}
      </View>

      <Text className='section-title'>视频（可选）</Text>
      <Button className='upload-btn' onClick={handleChooseVideo}>选择视频</Button>
      {video && <Video src={video} className='video-preview' />}

      <Button className='submit-btn' loading={loading} onClick={handleSubmit}>
        {id ? '更新游记' : '发布游记'}
      </Button>
    </View>
  );
};

export default Publish;
