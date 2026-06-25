import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, Message, Popconfirm, Typography } from '@arco-design/web-react'
import { IconPlus, IconSearch, IconRefresh } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import { classRoomApi } from '../../api/classRoom'
import { collegeApi } from '../../api/college'
import type { ClassRoom, ClassRoomCreateRequest, ClassRoomUpdateRequest, PageResult, College } from '../../types'

const { Title } = Typography
const FormItem = Form.Item

export default function ClassRoomPage() {
  const [data, setData] = useState<ClassRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchName, setSearchName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<ClassRoom | null>(null)
  const [colleges, setColleges] = useState<College[]>([])
  const [form] = Form.useForm()

  const fetchData = useCallback(async (pageNum = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await classRoomApi.list({ pageNum, pageSize })
      const page = res.data as PageResult<ClassRoom>
      setData(page.records)
      setPagination({ current: page.pageNum, pageSize: page.pageSize, total: page.total })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchColleges = useCallback(async () => {
    try {
      const res = await collegeApi.list({ pageNum: 1, pageSize: 200 })
      setColleges((res.data as PageResult<College>).records)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchData()
    fetchColleges()
  }, [fetchData, fetchColleges])

  const collegeMap = Object.fromEntries(colleges.map((c) => [c.id, c.name]))

  const handleSearch = async () => {
    if (!searchName.trim()) { fetchData(); return }
    setLoading(true)
    try {
      const res = await classRoomApi.search(searchName.trim())
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

  const handleEdit = (record: ClassRoom) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await classRoomApi.delete(id)
    Message.success('删除成功')
    fetchData(pagination.current, pagination.pageSize)
  }

  const handleOk = async () => {
    const values = await form.validate()
    if (editRecord) {
      await classRoomApi.update(editRecord.id, values as ClassRoomUpdateRequest)
      Message.success('更新成功')
    } else {
      await classRoomApi.create(values as ClassRoomCreateRequest)
      Message.success('创建成功')
    }
    setModalVisible(false)
    fetchData(pagination.current, pagination.pageSize)
  }

  const columns = [
    { title: '序号', dataIndex: 'id', width: 80, render: (_v: unknown, _record: unknown, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1 },
    { title: '班级名称', dataIndex: 'name' },
    { title: '所属学院', dataIndex: 'collegeId', render: (v: number) => collegeMap[v] || v },
    { title: '年级', dataIndex: 'grade' },
    { title: '专业', dataIndex: 'major' },
    { title: '班主任', dataIndex: 'teacher' },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: ClassRoom) => (
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
      <Title heading={5} style={{ margin: '0 0 16px' }}>班级管理</Title>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="按名称搜索"
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
        title={editRecord ? '编辑班级' : '新增班级'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        unmountOnExit
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <FormItem label="所属学院" field="collegeId" rules={[{ required: true, message: '请选择学院' }]}>
            <Select placeholder="请选择学院" allowClear>
              {colleges.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="班级名称" field="name" rules={[{ required: true, message: '请输入班级名称' }]}>
            <Input placeholder="请输入班级名称" maxLength={50} />
          </FormItem>
          <FormItem label="年级" field="grade" rules={editRecord ? [] : [{ required: true, message: '请输入年级' }]}>
            <Input placeholder="请输入年级，如：2024" maxLength={20} />
          </FormItem>
          <FormItem label="专业" field="major" rules={editRecord ? [] : [{ required: true, message: '请输入专业' }]}>
            <Input placeholder="请输入专业" maxLength={50} />
          </FormItem>
          <FormItem label="班主任" field="teacher">
            <Input placeholder="请输入班主任姓名" maxLength={20} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
