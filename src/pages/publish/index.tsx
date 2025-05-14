import { useEffect, useState } from 'react';
import { View, Text, Input, Textarea, Button, Image, Video } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getTravelById, uploadFile, saveTravel } from '@/api/travel';
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

  useEffect(() => {
    checkLogin();
    if (id) fetchTravel(id);
  }, [id]);

  const fetchTravel = async (id) => {
    const res = await getTravelById(id);
    const t = res.data;
    setTitle(t.title);
    setContent(t.content);
    setImages(t.images || []);
    setVideo(t.video || '');
  };

  const handleChooseImages = async () => {
    const res = await Taro.chooseImage({ count: 9 - images.length });
    setImages([...images, ...res.tempFilePaths]);
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

    const res = await saveTravel(payload);
    setLoading(false);

    if (res.statusCode === 200) {
      Taro.showToast({ title: id ? '更新成功' : '发布成功' });
      await getTravelById(user.id);
      Taro.switchTab({ url: '/pages/my-travel/index' });
    } else {
      Taro.showToast({ title: '提交失败', icon: 'none' });
    }
  };

  return (
    <View className="publish-page">
      <Text className="section-title">标题</Text>
      <Text className="star">*</Text>
      <Input className="input" value={title} placeholder="请输入游记标题" onInput={(e) => setTitle(e.detail.value)} />

      <Text className="section-title">内容</Text>
      <Text className="star">*</Text>

      <Textarea
        className="textarea"
        value={content}
        placeholder="请输入游记正文"
        onInput={(e) => setContent(e.detail.value)}
      />

      <Text className="section-title">图片（最多九张）</Text>
      <Text className="star">*</Text>
      <Button className="upload-btn" onClick={handleChooseImages}>选择图片</Button>
      <View className="image-preview">
        {images.map((img) => (
          <Image key={img} src={img} mode="aspectFill" className="preview-img" />
        ))}
      </View>

      <Text className="section-title">视频（可选）</Text>
      <Button className="upload-btn" onClick={handleChooseVideo}>选择视频</Button>
      {video && <Video src={video} className="video-preview" />}

      <Button className="submit-btn" loading={loading} onClick={handleSubmit}>
        {id ? '更新游记' : '发布游记'}
      </Button>
    </View>
  );
};

export default Publish;
