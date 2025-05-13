// src/api/user.ts
import Taro from '@tarojs/taro';

export const register = (data) =>
    Taro.request({
        url: 'https://akn04a40lx.hzh.sealos.run/register', // 替换为 Sealos API
        method: 'POST',
        data,
    });


export const login = (data) =>
    Taro.request({
        url: 'https://akn04a40lx.hzh.sealos.run/login',
        method: 'POST',
        data,
    });

