import Taro from '@tarojs/taro';

export const getMyTravels = () =>
    Taro.request({
        url: 'https://your-sealos-api/my-travels',
        method: 'GET',
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });

export const deleteTravel = (id: string) =>
    Taro.request({
        url: `https://your-sealos-api/travel/${id}`,
        method: 'DELETE',
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });

export const getTravelById = (id: string) =>
    Taro.request({
        url: `https://your-sealos-api/travel/${id}`,
        method: 'GET',
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });

export const uploadFile = (filePath: string, type: 'image' | 'video') =>
    Taro.uploadFile({
        url: `https://your-sealos-api/upload-${type}`,
        filePath,
        name: 'file',
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });

export const saveTravel = (data, isEdit: boolean) =>
    Taro.request({
        url: `https://your-sealos-api/travel${isEdit ? `/${data.id}` : ''}`,
        method: isEdit ? 'PUT' : 'POST',
        data,
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });
