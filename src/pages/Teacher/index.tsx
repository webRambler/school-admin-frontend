import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Message, Popconfirm, Typography } from '@arco-design/web-react'
import { IconPlus, IconSearch, IconRefresh } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import { teacherApi } from '../../api/teacher'
import type { Teacher, TeacherCreateRequest, TeacherUpdateRequest, PageResult } from '../../types'

const { Title } = Typography
const FormItem = Form.Item

export default function TeacherPage() {
  const [data, setData] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchName, setSearchName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<Teacher | null>(null)
  const [form] = Form.useForm()

  const fetchData = useCallback(async (pageNum = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await teacherApi.list({ pageNum, pageSize })
      const page = res.data as PageResult<Teacher>
      setData(page.records)
      setPagination({ current: page.pageNum, pageSize: page.pageSize, total: page.total })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSearch = async () => {
    if (!searchName.trim()) { fetchData(); return }
    setLoading(true)
    try {
      const res = await teacherApi.search(searchName.trim())
      setData(res.data)
      setPagination((prev) => ({ ...prev, current: 1, total: res.data.length }))
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Teacher) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await teacherApi.delete(id)
    Message.success('删除成功')
    fetchData(pagination.current, pagination.pageSize)
  }

  const handleOk = async () => {
    const values = await form.validate()
    if (editRecord) {
      await teacherApi.update(editRecord.id, values as TeacherUpdateRequest)
      Message.success('更新成功')
    } else {
      await teacherApi.create(values as TeacherCreateRequest)
      Message.success('创建成功')
    }
    setModalVisible(false)
    fetchData(pagination.current, pagination.pageSize)
  }

  const columns = [
    { title: '序号', dataIndex: 'id', width: 80, render: (_v: unknown, _record: unknown, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1 },
    { title: '姓名', dataIndex: 'name' },
    { title: '性别', dataIndex: 'gender' },
    { title: '年龄', dataIndex: 'age' },
    { title: '职称', dataIndex: 'title' },
    { title: '院系', dataIndex: 'department' },
    { title: '手机号', dataIndex: 'phone' },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: Teacher) => (
        <Space>
          <Button type="text" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" status="danger" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title heading={5} style={{ margin: '0 0 16px' }}>教师管理</Title>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="按姓名搜索"
          value={searchName}
          onChange={setSearchName}
          onPressEnter={handleSearch}
          allowClear
          style={{ width: 200 }}
          prefix={<IconSearch />}
        />
        <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>搜索</Button>
        <Button icon={<IconRefresh />} onClick={() => { setSearchName(''); fetchData() }}>重置</Button>
        <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        data={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: true,
          sizeCanChange: true,
          sizeOptions: [10, 20, 50, 100],
          onChange: (current, pageSize) => fetchData(current, pageSize),
          onPageSizeChange: (size, current) => fetchData(current, size),
        }}
      />
      <Modal
        title={editRecord ? '编辑教师' : '新增教师'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        unmountOnExit
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <FormItem label="姓名" field="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" maxLength={20} />
          </FormItem>
          <FormItem label="性别" field="gender" rules={editRecord ? [] : [{ required: true, message: '请选择性别' }]}>
            <Select placeholder="请选择性别" allowClear>
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </FormItem>
          <FormItem label="年龄" field="age" rules={editRecord ? [] : [{ required: true, message: '请输入年龄' }]}>
            <InputNumber placeholder="请输入年龄" min={18} max={100} style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="职称" field="title">
            <Input placeholder="请输入职称" maxLength={30} />
          </FormItem>
          <FormItem label="院系" field="department" rules={editRecord ? [] : [{ required: true, message: '请输入院系' }]}>
            <Input placeholder="请输入院系" maxLength={50} />
          </FormItem>
          <FormItem label="手机号" field="phone">
            <Input placeholder="请输入手机号" maxLength={15} />
          </FormItem>
          <FormItem label="邮箱" field="email">
            <Input placeholder="请输入邮箱" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
