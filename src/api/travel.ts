import Taro from '@tarojs/taro';

export const getMyTravels = () =>
    Taro.request({
        url: 'https://your-sealos-api/my-travels',
        method: 'GET',
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });

// export const deleteTravel = (id: string) =>
//     Taro.request({
//         url: `https://p9zej3r6lf.hzh.sealos.run/delete_note/${id}`,
//         method: 'DELETE',
//         header: {
//             Authorization: Taro.getStorageSync('token'),
//         },
//     });
export const deleteTravel = (id: string) =>
    Taro.request({
        url: `https://p9zej3r6lf.hzh.sealos.run/delete_note?_id=${id}`,
        method: 'POST',
        data: { id },
    });


export const getTravelById = (id: string) =>
    Taro.request({
        url: `https://p9zej3r6lf.hzh.sealos.run/get_my_note?authorId=${id}`,
        method: 'GET',
    });

// export const uploadFile = (filePath: string, type: 'image' | 'video') =>
//     Taro.uploadFile({
//         url: `https://p9zej3r6lf.hzh.sealos.run/upload_files`,
//         filePath,
//         name: 'file',
//         // header: {
//         //     Authorization: Taro.getStorageSync('token'),
//         // },
//     });



export async function uploadFile(filePath: string): Promise<string> {
    const res = await Taro.uploadFile({
        url: 'https://p9zej3r6lf.hzh.sealos.run/upload_files',
        filePath,
        name: 'file',
    })

    const result = JSON.parse(res.data)
    if (result.code === 0) {
        return result.files?.[0]?.url
    } else {
        throw new Error(result.message || '上传失败')
    }
}


// export const saveTravel = (data, isEdit: boolean) =>
//     Taro.request({
//         url: `https://your-sealos-api/travel${isEdit ? `/${data.id}` : ''}`,
//         method: isEdit ? 'PUT' : 'POST',
//         data,
//         header: {
//             Authorization: Taro.getStorageSync('token'),
//         },
//     });

export const saveTravel = (data) =>
    Taro.request({
        url: `https://p9zej3r6lf.hzh.sealos.run/add_note`,
        method: 'POST',
        data,
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });

export const updateTravel = (data) =>
    Taro.request({
        url: `https://p9zej3r6lf.hzh.sealos.run/edit_note`,
        method: 'POST',
        data,
        header: {
            Authorization: Taro.getStorageSync('token'),
        },
    });
