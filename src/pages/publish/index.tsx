// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Input, Textarea, Button, Image, Video } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { getTravelById, uploadFile, saveTravel } from '@/api/travel';
import { checkLogin } from '@/utils/auth';
import styles from './index.module.scss';

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
        const uploaded = await Promise.all(
            res.tempFilePaths.map(async (path) => {
                const uploadRes = await uploadFile(path, 'image');
                return JSON.parse(uploadRes.data).url;
            })
        );
        setImages([...images, ...uploaded]);
    };

    const handleChooseVideo = async () => {
        const res = await Taro.chooseVideo({}); // 移除 count 属性{ count: 1 }
        const uploadRes = await uploadFile(res.tempFilePath, 'video');
        const url = JSON.parse(uploadRes.data).url;
        setVideo(url);
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
            userId: user.id,
        };

        const res = await saveTravel(payload, !!id);
        setLoading(false);

        if (res.statusCode === 200) {
            Taro.showToast({ title: id ? '更新成功' : '发布成功' });
            Taro.redirectTo({ url: '/pages/my-travel/index' });
        } else {
            Taro.showToast({ title: '提交失败', icon: 'none' });
        }
    };

    return (
        <View>
            <Text>标题 *</Text>
            <Input value={title} onInput={(e) => setTitle(e.detail.value)} />

            <Text>内容 *</Text>
            <Textarea value={content} onInput={(e) => setContent(e.detail.value)} />

            <Text>图片（必填）</Text>
            <Button onClick={handleChooseImages}>选择图片</Button>
            <View className="img-preview">
                {images.map((img) => (
                    <Image key={img} src={img} mode="aspectFit" style={{ width: 100, height: 100 }} />
                ))}
            </View>

            <Text>视频（仅限一个）</Text>
            <Button onClick={handleChooseVideo}>选择视频</Button>
            {video && <Video src={video} style={{ width: '100%' }} />}

            <Button loading={loading} onClick={handleSubmit}>
                {id ? '更新游记' : '发布游记'}
            </Button>
        </View>
    );
};

export default Publish;
