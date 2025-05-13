import { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { login } from '@/api/user';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // 使用 react-icons 的小眼睛图标
import './index.module.scss';
// import { InputType } from 'zlib';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true); // 控制密码可见性

    const handleLogin = async () => {
        if (!username || !password) {
            Taro.showToast({ title: '请输入用户名和密码', icon: 'none' });
            return;
        }

        const res = await login({ username, password });

        if (res.statusCode === 200 && res.data.access_token) {
            Taro.setStorageSync('token', res.data.access_token);
            Taro.setStorageSync('user', res.data.user);
            Taro.showToast({ title: '登录成功' });
            setTimeout(() => {
                Taro.redirectTo({ url: '/pages/my/index' });
            }, 1500);
        } else {
            Taro.showToast({ title: '用户名或密码错误', icon: 'none' });
        }
    };

    return (
        <View className="loginPage">
            <View className="container">
                <Text className="title">欢迎登录</Text>

                <View className="inputGroup">
                    <Text className="label">用户名</Text>
                    <Input
                        className="input"
                        value={username}
                        placeholder="请输入用户名"
                        onInput={(e) => setUsername(e.detail.value)}
                    />
                </View>

                <View className="inputGroup">
                    <Text className="label">密码</Text>
                    <View className="passwordWrapper">
                        <Input
                            className="input"
                            placeholder="请输入密码"
                            type={showPassword ? 'text' as any : 'password'} // 显式声明类型
                            value={password}
                            onInput={(e) => setPassword(e.detail.value)}
                        />
                        <View
                            className="eyeIcon"
                            onClick={() => setShowPassword(!showPassword)} // 切换密码可见性
                        >
                            {showPassword ? (
                                <AiOutlineEye size={20} />
                            ) : (
                                <AiOutlineEyeInvisible size={20} />
                            )}
                        </View>
                    </View>
                </View>

                <Button className="loginBtn" onClick={handleLogin}>
                    登录
                </Button>

                <Button
                    className="registerBtn"
                    onClick={() => Taro.navigateTo({ url: '/pages/register/index' })}
                >
                    没有账号？去注册
                </Button>
            </View>
        </View>
    );
};

export default Login;