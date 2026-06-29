import {useState, useCallback, useEffect} from 'react'
import { Table, Button, Space, Modal, Form, Input, InputNumber, Message, Popconfirm, Typography } from '@arco-design/web-react'
import { IconPlus, IconSearch, IconRefresh } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import { courseApi } from '../../api/course'
import type { Course, CourseCreateRequest, CourseUpdateRequest, PageResult } from '../../types'

const { Title } = Typography
const FormItem = Form.Item

export default function CoursePage() {
  const [data, setData] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [modalVisible, setModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<Course | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  const fetchData = useCallback(async (params: object = {}) => {
    setLoading(true)
    try {
      const finalParams = { pageNum: pagination.current, pageSize: pagination.pageSize, ...params }
      const res = await courseApi.search(finalParams)
      const page: PageResult<Course> = res.data
      setData(page.records)
      setPagination({ current: page.pageNum, pageSize: page.pageSize, total: page.total })
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const handleSearch = async () => {
    try {
      const { name, teacherName, credit } = searchForm.getFieldsValue()
      const trimmed = name?.trim()
      const teacherNameTrimmed = teacherName?.trim()
      const creditTrimmed = credit?.trim()
      fetchData({ name: trimmed, teacherName: teacherNameTrimmed, credit: creditTrimmed })
    } catch (e: unknown) {
      Message.error(e instanceof Error ? e.message : '查询失败')
    }
  }

  const handleAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Course) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await courseApi.delete(id)
    Message.success('删除成功')
    fetchData()
  }

  const handleOk = async () => {
    const values = await form.validate()
    if (editRecord) {
      await courseApi.update(editRecord.id, values as CourseUpdateRequest)
      Message.success('更新成功')
    } else {
      await courseApi.create(values as CourseCreateRequest)
      Message.success('创建成功')
    }
    setModalVisible(false)
    fetchData()
  }

  const handleChange = (page: number, size: number) => {
    setPagination({ ...pagination, current: page, pageSize: size })
  }

  const columns = [
    { title: '序号', dataIndex: 'id', width: 80, render: (_v: unknown, _record: unknown, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1 },
    { title: '课程名称', dataIndex: 'name' },
    { title: '教师', dataIndex: 'teacherName' },
    { title: '学分', dataIndex: 'credit' },
    { title: '学时', dataIndex: 'hours' },
    { title: '学期', dataIndex: 'semester' },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: Course) => (
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
      <Title heading={5} style={{ margin: '0 0 16px' }}>课程管理</Title>
      <Form form={searchForm} layout="inline" style={{ marginBottom: 16 }}>
        <FormItem field="name" label="课程名称">
          <Input placeholder="请输入课程名称" allowClear style={{ width: 200 }} />
        </FormItem>
        <FormItem field="teacherName" label="教师">
          <Input placeholder="请输入教师名称" allowClear style={{ width: 200 }} />
        </FormItem>
        <FormItem field="credit" label="学分">
          <Input placeholder="请输入学分" allowClear style={{ width: 200 }} />
        </FormItem>
        <FormItem>
          <Space>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>搜索</Button>
            <Button icon={<IconRefresh />} onClick={() => { searchForm.resetFields(); fetchData() }}>重置</Button>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新增</Button>
          </Space>
        </FormItem>
      </Form>
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
          onChange: handleChange,
        }}
      />
      <Modal
        title={editRecord ? '编辑课程' : '新增课程'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        unmountOnExit
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <FormItem label="课程名称" field="name" rules={[{ required: true, message: '请输入课程名称' }]}>
            <Input placeholder="请输入课程名称" maxLength={50} />
          </FormItem>
          <FormItem label="学分" field="credit" rules={editRecord ? [] : [{ required: true, message: '请输入学分' }]}>
            <InputNumber placeholder="请输入学分" min={0.5} step={0.5} precision={1} style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="学时" field="hours" rules={editRecord ? [] : [{ required: true, message: '请输入学时' }]}>
            <InputNumber placeholder="请输入学时" min={1} style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="学期" field="semester">
            <Input placeholder="请输入学期，如：2024-2025-1" maxLength={20} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
