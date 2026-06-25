import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, Message, Popconfirm, Typography } from '@arco-design/web-react'
import { IconPlus, IconSearch, IconRefresh } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import { studentApi } from '../../api/student'
import { classRoomApi } from '../../api/classRoom'
import type { StudentWithClassVO, StudentCreateRequest, StudentUpdateRequest, PageResult, ClassRoom } from '../../types'

const { Title } = Typography
const FormItem = Form.Item

export default function StudentPage() {
  const [data, setData] = useState<StudentWithClassVO[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchName, setSearchName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<StudentWithClassVO | null>(null)
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([])
  const [form] = Form.useForm()

  const fetchData = useCallback(async (pageNum = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await studentApi.listWithClass({ pageNum, pageSize })
      const page = res.data as PageResult<StudentWithClassVO>
      setData(page.records)
      setPagination({ current: page.pageNum, pageSize: page.pageSize, total: page.total })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchClassRooms = useCallback(async () => {
    try {
      const res = await classRoomApi.list({ pageNum: 1, pageSize: 200 })
      setClassRooms((res.data as PageResult<ClassRoom>).records)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchData()
    fetchClassRooms()
  }, [fetchData, fetchClassRooms])

  const handleSearch = async () => {
    if (!searchName.trim()) { fetchData(); return }
    setLoading(true)
    try {
      const res = await studentApi.search(searchName.trim())
      // search returns Student[] — convert to StudentWithClassVO shape
      setData(res.data.map((s) => ({ ...s, className: '', grade: '', major: '', teacher: '' })))
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

  const handleEdit = (record: StudentWithClassVO) => {
    setEditRecord(record)
    form.setFieldsValue({ name: record.name, gender: record.gender, age: record.age, classId: record.classId, phone: record.phone, email: record.email })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await studentApi.delete(id)
    Message.success('删除成功')
    fetchData(pagination.current, pagination.pageSize)
  }

  const handleOk = async () => {
    const values = await form.validate()
    if (editRecord) {
      await studentApi.update(editRecord.id, values as StudentUpdateRequest)
      Message.success('更新成功')
    } else {
      await studentApi.create(values as StudentCreateRequest)
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
    { title: '班级', dataIndex: 'className' },
    { title: '专业', dataIndex: 'major' },
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
      render: (_: unknown, record: StudentWithClassVO) => (
        <Space>
          <Button type="text" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？删除后其成绩也会被删除" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" status="danger" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title heading={5} style={{ margin: '0 0 16px' }}>学生管理</Title>
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
        title={editRecord ? '编辑学生' : '新增学生'}
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
            <InputNumber placeholder="请输入年龄" min={1} max={150} style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="班级" field="classId" rules={[{ required: true, message: '请选择班级' }]}>
            <Select placeholder="请选择班级" allowClear showSearch filterOption={(input, option) => String((option?.props as Record<string, unknown>)?.children ?? '').includes(input)}>
              {classRooms.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}（{c.grade}）</Select.Option>
              ))}
            </Select>
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
