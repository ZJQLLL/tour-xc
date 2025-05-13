import { useState } from 'react';
import { View, Text, Input, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { register } from '@/api/user';
// import styles from './index.module.scss';
import './index.module.scss';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [tempAvatarPath, setTempAvatarPath] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChooseAvatar = async () => {
        try {
            const res = await Taro.chooseImage({ count: 1 });
            setTempAvatarPath(res.tempFilePaths[0]);
        } catch (error) {
            Taro.showToast({ title: '选择图片失败', icon: 'none' });
            console.error('Choose image error:', error);
        }
    };

    const handleRegister = async () => {
        if (!username || !password) {
            setErrorMessage('请填写用户名和密码');
            return;
        }

        setErrorMessage('');

        try {
            const registerData = { username, password, tempAvatarPath };
            const res = await register(registerData);

            if (res.statusCode === 200 && res.data.message === '注册成功') {
                Taro.showToast({ title: '注册成功，请登录' });
                setTimeout(() => {
                    Taro.navigateTo({ url: '/pages/login/index' });
                }, 1500);
            } else {
                setErrorMessage(res.data.error || '注册失败，请重试');
            }
        } catch (error) {
            setErrorMessage('网络错误，请稍后再试');
            console.error('Registration error:', error);
        }
    };

    return (
        <View className="registerPage">
            <Text className="title">用户注册</Text>

            <View>
                <Text className="label">用户名</Text>
                <Input
                    className="inputField"
                    value={username}
                    onInput={(e) => setUsername(e.detail.value)}
                />
            </View>

            <View>
                <Text className="label">密码</Text>
                <View className="passwordWrapper">
                    <Input
                        className="passwordInput"
                        value={password}
                        onInput={(e) => setPassword(e.detail.value)}
                    />
                    <View onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <AiOutlineEye size={24} color="#999" /> : <AiOutlineEyeInvisible size={24} color="#999" />}
                    </View>
                </View>
            </View>


            <Button className="button" onClick={handleChooseAvatar}>
                选择头像
            </Button>

            {tempAvatarPath && (
                <Image
                    src={tempAvatarPath}
                    className="avatarPreview"
                    mode="aspectFit"
                />
            )}

            {errorMessage && (
                <Text className="error">{errorMessage}</Text>
            )}

            <Button className="button" onClick={handleRegister}>
                注册
            </Button>
        </View>
    );
};

export default Register;
