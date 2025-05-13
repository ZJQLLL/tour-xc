// src/pages/my-travel/index.tsx
// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getMyTravels, deleteTravel } from '@/api/travel';
import { checkLogin } from '@/utils/auth';
import './index.module.css';

const MyTravel = () => {
    // const [travels, setTravels] = useState([]);
    interface Travel {
        id: string;
        title: string;
        status: 'pending' | 'approved' | 'rejected';
        rejectReason?: string;
    }

    const [travels, setTravels] = useState<Travel[]>([]);

    useEffect(() => {
        checkLogin();
        fetchTravels();
    }, []);

    const fetchTravels = async () => {
        const res = await getMyTravels();
        if (res.statusCode === 200) {
            setTravels(res.data);
        }
    };

    const handleDelete = async (id) => {
        await deleteTravel(id);
        Taro.showToast({ title: '删除成功' });
        fetchTravels();
    };

    const renderStatus = (status, reason) => {
        if (status === 'pending') return '待审核';
        if (status === 'approved') return '已通过';
        if (status === 'rejected') return `未通过：${reason}`;
        return '';
    };

    return (
        <View className="my-travel-page">
            <Button onClick={() => Taro.switchTab({ url: '/pages/publish/index' })}>
                ➕ 发布新游记
            </Button>

            {travels.map((t) => (
                <View key={t.id} className="travel-card">
                    <Text className="title">{t.title}</Text>
                    <Text>{renderStatus(t.status, t.rejectReason)}</Text>
                    <Button
                        size="mini"
                        onClick={() => Taro.navigateTo({ url: `/pages/publish/index?id=${t.id}` })}
                        disabled={t.status === 'approved'}
                    >
                        编辑
                    </Button>
                    <Button
                        size="mini"
                        type="warn"
                        onClick={() => handleDelete(t.id)}
                    >
                        删除
                    </Button>
                </View>
            ))}
        </View>
    );
};

export default MyTravel;
