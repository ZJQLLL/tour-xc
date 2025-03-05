import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { createArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'
import { getArticleById } from '@/apis/article'

const { Option } = Select

const Publish = () => {
  // 获取频道列表
  const {channelList} = useChannel()

  // 提交表单
  const onFinish = (formValue)=>{
    // console.log(formValue);
    const {title,content,channel_id} = formValue
    // 1、按照接口文档格式处理收集到的表单数据
    const reqData={
      title,
      content,
      cover:{
        type:imageType,  
        image:imageList.map(item=>item.response.data.url)
      },
      channel_id
    }
    // 2、调用接口提交
    createArticleAPI(reqData)
  }

  // 上传图片回调
  const [imageList,setImageList] = useState([])
  const onUploadChange=(value)=>{ 
    setImageList(value.fileList);
    
  }

  const [imageType,setImageType] = useState(0)
  const onTypeChange=(e)=>{
    setImageType(e.target.value)
  }

  // 回填数据
  const [searchParams]= useSearchParams()
  const articleId = searchParams.get('id')
  console.log(articleId);
  // 获取实例
  const [form] = Form.useForm()
  
  useEffect(()=>{
    // 通过id获取数据
    async function getArticleDetail(){
      const res = await getArticleById(articleId)
      form.setFieldsValue(res.data)
    }
    getArticleDetail()
    // 调用实例方法完成回填
    
  },[articleId,form])
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '发布文章' },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {/* value属性用户选中后会自动收集起来作为借口的提交字段 */}
              {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option> )}
              
            </Select>
          </Form.Item>

          <Form.Item label="封面">
          <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType >0 && <Upload
               name="image"
               listType="picture-card"
               showUploadList
               action={'http://geek.itheima.net/v1_0/upload'}
               onChange={onUploadChange}
               maxCount={imageType}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
            
          </Form.Item>


          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
            
          >
          {/* 副文本编辑器 */}
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish