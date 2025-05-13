import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, Popconfirm, message, Modal, Input } from 'antd'

import { Table, Tag, Space } from 'antd'
import { DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import {
  getArticleListAPI,
  delArticleAPI,
  approveArticleAPI,
  rejectArticleAPI
} from '@/apis/article'
import { useSelector } from 'react-redux'

const Article = () => {
  const navigate = useNavigate()

  // 从Redux store获取用户信息
  const { userInfo } = useSelector(state => state.user)

  // 状态映射
  const statusMap = {
    'pending': <Tag color='warning'>待审核</Tag>,
    'approved': <Tag color='success'>审核通过</Tag>,
    'rejected': <Tag color='error'>已拒绝</Tag>
  }

  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentArticleId, setCurrentArticleId] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  const columns = [
    {
      title: '封面',
      dataIndex: 'coverImage',
      width: 120,
      render: coverImage => (
        <img src={coverImage || img404} width={80} height={60} alt="" className="rounded object-cover" />
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
      render: (text, record) => (
        <span className="font-medium hover:text-primary cursor-pointer" onClick={() => navigate(`/article/${record._id}`)}>
          {text}
        </span>
      )
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: author => (
        <div className="flex items-center space-x-2">
          <img src={author?.avatar || img404} alt="作者头像" className="w-8 h-8 rounded-full object-cover" />
          <span>{author?.nickname || '未知'}</span>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => statusMap[status] || <Tag color='default'>{status}</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      render: date => new Date(date).toLocaleDateString('zh-CN')
    },
    {
      title: '阅读数',
      dataIndex: 'views',
      sorter: (a, b) => a.views - b.views
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      sorter: (a, b) => a.commentCount - b.commentCount
    },
    {
      title: '点赞数',
      dataIndex: 'likes',
      sorter: (a, b) => a.likes - b.likes
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space size="middle">

          {/* 仅待审核状态显示审核按钮 */}
          {record.status === 'pending' && (
            <Space size="small">

              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                style={{
                  backgroundColor: '#52c41a',
                  borderColor: '#52c41a',
                  borderRadius: '8px', // 添加圆角
                  height: '32px',      // 保持适当高度
                  padding: '0 16px'    // 添加左右内边距
                }}
                onClick={() => handleApprove(record._id)}
                className="hover:bg-green-600 hover:scale-105 transition-all duration-300"
              >
                <span className="hidden md:inline ml-1">通过</span>
              </Button>

              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                style={{
                  borderRadius: '8px', // 添加圆角
                  height: '32px',      // 保持适当高度
                  padding: '0 16px'    // 添加左右内边距
                }}
                onClick={() => showRejectModal(record._id)}
                className="hover:bg-red-600 hover:scale-105 transition-all duration-300"
              >
                <span className="hidden md:inline ml-1">拒绝</span>
              </Button>

            </Space>
          )}

          {/* 仅admin角色显示删除按钮 */}
          {userInfo.role === 'admin' && (
            <Popconfirm
              title="确认删除该文章吗?"
              description="删除后将无法恢复"
              onConfirm={() => handleDelete(record._id)}
              okText="确认"
              cancelText="取消"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                className="hover:scale-105 transition-transform"
              />
            </Popconfirm>
          )}
        </Space>
      )
    }


  ]

  const [reqData, setReqData] = useState({
    page: 1,
    pageSize: 10,
    status: ''
  })

  const [articleList, setArticleList] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // 获取文章列表
  useEffect(() => {
    fetchArticleList()
  }, [reqData])

  const fetchArticleList = async () => {
    setLoading(true)
    try {
      const res = await getArticleListAPI(reqData)

      // 验证响应格式
      if (!res.data || !Array.isArray(res.data.list)) {
        throw new Error('API响应格式不正确')
      }

      setArticleList(res.data.list || [])
      setTotal(res.data.total || 0)

      // 显示成功消息
      if (reqData.status) {
        message.success(`已筛选出${res.data.total || 0}条${getStatusText(reqData.status)}的文章`)
      }
    } catch (error) {
      message.error('获取文章列表失败，请稍后重试')
      console.error('API请求错误:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取状态文本描述
  const getStatusText = (status) => {
    const statusTexts = {
      'pending': '待审核',
      'approved': '审核通过',
      'rejected': '已拒绝'
    }
    return statusTexts[status] || '全部'
  }

  // 表单提交处理
  const onFinish = (formValue) => {
    // 创建新的请求参数对象，确保引用变化
    const newReqData = {
      page: 1,
      pageSize: reqData.pageSize,
      status: formValue.status || ''
    }
    setReqData(newReqData)
  }

  // 表单提交失败处理
  const onFinishFailed = (errorInfo) => {
    console.error('表单验证失败:', errorInfo)
    message.error('请检查表单输入')
  }

  // 重置筛选
  const resetFilters = () => {
    form.resetFields()
    setReqData({
      page: 1,
      pageSize: 10,
      status: ''
    })
  }

  // 分页处理
  const onPageChange = (page, pageSize) => {
    setReqData(prevData => ({
      ...prevData,
      page,
      pageSize
    }))
  }

  // 删除文章处理
  const handleDelete = async (id) => {
    try {
      await delArticleAPI(id)
      message.success('文章删除成功')
      fetchArticleList()
    } catch (error) {
      message.error('删除失败，请稍后重试')
      console.error('删除文章错误:', error)
    }
  }

  // 显示拒绝原因模态框
  const showRejectModal = (id) => {
    setCurrentArticleId(id)
    setRejectReason('')
    setRejectModalVisible(true)
  }

  // 隐藏拒绝原因模态框
  const hideRejectModal = () => {
    setRejectModalVisible(false)
  }

  // 处理审核通过
  const handleApprove = async (id) => {
    try {
      await approveArticleAPI(id)
      message.success('文章审核通过')
      fetchArticleList()
    } catch (error) {
      message.error('审核失败，请稍后重试')
      console.error('审核通过错误:', error)
    }
  }

  // 处理审核拒绝
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error('请输入拒绝原因')
      return
    }

    try {
      await rejectArticleAPI(currentArticleId, rejectReason)
      message.success('文章已拒绝')
      fetchArticleList()
      hideRejectModal()
    } catch (error) {
      message.error('操作失败，请稍后重试')
      console.error('审核拒绝错误:', error)
    }
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章管理' },
            { title: '文章列表' }
          ]} />
        }
        className="mb-6 shadow-sm rounded-lg"
      >
        <Form
          form={form}
          initialValues={{ status: '' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="inline"
          className="flex flex-wrap gap-4"
        >
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value="pending">待审核</Radio>
              <Radio value="approved">审核通过</Radio>
              <Radio value="rejected">已拒绝</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item className="ml-auto">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              <i className="fa fa-filter mr-2"></i>筛选
            </Button>
            <Button
              type="default"
              onClick={resetFilters}
              className="ml-3 px-6 py-2 rounded-lg transition-all duration-300"
            >
              <i className="fa fa-refresh mr-2"></i>重置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card
        title={`共 ${total} 条文章`}
        className="shadow-sm rounded-lg overflow-hidden"
      >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={articleList}
          pagination={{
            total,
            pageSize: reqData.pageSize,
            current: reqData.page,
            onChange: onPageChange,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showQuickJumper: true,
            position: ['bottomRight'],
            className: 'mt-4'
          }}
          loading={loading}
          bordered={false}
          rowClassName={(record, index) => index % 2 === 0 ? 'bg-gray-50' : ''}
          scroll={{ x: 'max-content' }}
        />
      </Card>
      {/* 审核拒绝原因模态框 */}
      <Modal
        title="审核拒绝"
        visible={rejectModalVisible}
        onOk={handleReject}
        onCancel={hideRejectModal}
        okText="确认拒绝"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>请输入拒绝原因:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="请输入拒绝原因..."
          maxLength={200}
        />
        <p className="text-gray-500 text-sm mt-2">最多200个字符</p>
      </Modal>
    </div>
  )
}

export default Article
