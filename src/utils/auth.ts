// utils/auth.ts
import Taro from '@tarojs/taro';

export const checkLogin = () => {
    const token = Taro.getStorageSync('token');
    if (!token) {
        Taro.redirectTo({ url: '/pages/login/index' });
    }
    return token;
};

export function getCurrentUser() {
    const user = Taro.getStorageSync('user');
    return user || null;
}
