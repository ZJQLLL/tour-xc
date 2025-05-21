import { useEffect, useState } from 'react';
import { View, Text, Button, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { getTravelById, deleteTravel } from '@/api/travel';
import { checkLogin, getCurrentUser, logout } from '@/utils/auth'; // 新增 logout 方法
import './index.module.css';

interface Travel {
    id: string;
    title: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectReason?: string;
    coverImage?: string;
}

interface User {
    avatar?: string;
    id: string;
    role?: "user";
    username?: string;
}

const MyTravel = () => {
    const [travels, setTravels] = useState<Travel[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        checkLogin();
        const user = Taro.getStorageSync('user')
        if (!user) {
          Taro.redirectTo({ url: '/pages/login/index' });
        } else {
            console.log('当前用户:', user);
            setUserInfo(user);
        }
        fetchTravels();
    }, []);

    useDidShow(() => {
        // 每次从别的页面切换回来时都会执行
        fetchTravels();
        // 更新用户信息
        const user = Taro.getStorageSync('user');
        if (user) {
            setUserInfo(user);
        }
    });

    const fetchTravels = async () => {
        const user = getCurrentUser(); // 假设返回 { id: 'xxx', ... }
        if (!user?.id) {
            Taro.showToast({ title: '请先登录', icon: 'none' });
            return;
        }
        console.log('当前用户:', user);

        try {
            const res = await getTravelById(user.id);
            console.log('获取游记:', res);

            if (res.data.message === 'success') {
                const mappedTravels = res.data.data.list.map(item => ({
                    id: item._id,
                    title: item.title,
                    status: item.status,
                    coverImage: item.coverImage,
                    rejectReason: item.rejectReason, // 若没有则为 undefined
                }));
                setTravels(mappedTravels);
            }
        } catch (error) {
            Taro.showToast({ title: '获取游记失败', icon: 'none' });
        }
    };

    const handleDelete = async (id: string) => {
        await deleteTravel(id); // 注意：需要确保 deleteTravel 实际接口存在
        Taro.showToast({ title: '删除成功' });
        fetchTravels();
    };

    const renderStatus = (status: string, reason?: string) => {
        if (status === 'pending') return '待审核';
        if (status === 'approved') return '已通过';
        if (status === 'rejected') return `未通过：${reason || '无原因'}`;
        return '';
    };

    // 新增退出登录方法
    const handleLogout = () => {
        Taro.showModal({
            title: '确认退出',
            content: '你确定要退出当前账号吗？',
            success: (res) => {
                if (res.confirm) {
                    logout(); // 调用退出登录方法
                    Taro.reLaunch({ url: '/pages/login/index' }); // 重新跳转到登录页
                }
            }
        });
    };

    return (
        <View className="my-travel-page">
            {/* 用户信息区域 */}
            <View className="user-info-container">
                <Image 
                    className="user-avatar" 
                    src={userInfo?.avatar || 'https://picsum.photos/200/200'} 
                    mode="aspectFill" 
                />
                {/* <View className="user-details">
                    <Text className="user-name">{userInfo?.username || '游客'}</Text>
                </View> */}
                <Text className="user-name">{userInfo?.username || '游客'}</Text>
                <Button className="logout-btn" size="mini" onClick={handleLogout}>退出</Button>
            </View>

            {travels.map((t) => (
                <View key={t.id} className="travel-card">
                    <Image className="cover" src={t.coverImage || 'https://via.placeholder.com/120'} mode="aspectFill" />
                    <View className="content">
                        <Text className="title">{t.title}</Text>
                        <Text className="status-text">{renderStatus(t.status, t.rejectReason)}</Text>

                        <View className="button-group">
                            <Button
                                size="mini"
                                onClick={() => {
                                    if (t.status === 'approved') {
                                        Taro.showToast({ title: '已通过游记无法编辑', icon: 'none' });
                                        return;
                                    }
                                    Taro.navigateTo({
                                        url: `/pages/publish/index?id=${t.id}`,
                                    });
                                }}
                            >
                                编辑
                            </Button>
                            <Button size="mini" type="warn" onClick={() => handleDelete(t.id)}>删除</Button>
                        </View>
                    </View>
                </View>
            ))}

            {/* 底部发布按钮 */}
            <View
                className="publish-btn"
                onClick={() => Taro.navigateTo({ url: '/pages/publish/index' })}
            >
                ➕ 发布新游记
            </View>
        </View>
    );
};

export default MyTravel;