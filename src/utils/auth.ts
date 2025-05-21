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

export function logout() {
    // 清除用户信息
    Taro.removeStorageSync('user');
    // 可以添加其他清理逻辑，如清除token等
}