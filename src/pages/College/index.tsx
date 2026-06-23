import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Modal, Form, Input, Message, Popconfirm, Typography } from '@arco-design/web-react'
import { IconPlus, IconSearch, IconRefresh } from '@arco-design/web-react/icon'
import dayjs from 'dayjs'
import { collegeApi } from '../../api/college'
import type { College, CollegeCreateRequest, CollegeUpdateRequest, PageResult } from '../../types'

const { Title } = Typography
const FormItem = Form.Item

export default function CollegePage() {
  const [data, setData] = useState<College[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [searchName, setSearchName] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<College | null>(null)
  const [form] = Form.useForm()

  const fetchData = useCallback(async (pageNum = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await collegeApi.list({ pageNum, pageSize })
      const page = res.data as PageResult<College>
      setData(page.records)
      setPagination({ current: page.pageNum, pageSize: page.pageSize, total: page.total })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = async () => {
    if (!searchName.trim()) {
      fetchData()
      return
    }
    setLoading(true)
    try {
      const res = await collegeApi.search(searchName.trim())
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

  const handleEdit = (record: College) => {
    setEditRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await collegeApi.delete(id)
    Message.success('删除成功')
    fetchData(pagination.current, pagination.pageSize)
  }

  const handleOk = async () => {
    const values = await form.validate()
    if (editRecord) {
      await collegeApi.update(editRecord.id, values as CollegeUpdateRequest)
      Message.success('更新成功')
    } else {
      await collegeApi.create(values as CollegeCreateRequest)
      Message.success('创建成功')
    }
    setModalVisible(false)
    fetchData(pagination.current, pagination.pageSize)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '学院名称', dataIndex: 'name' },
    { title: '学院代码', dataIndex: 'code' },
    { title: '简介', dataIndex: 'description', ellipsis: true },
    { title: '院长', dataIndex: 'dean' },
    { title: '联系电话', dataIndex: 'phone' },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (v: string) => v ? dayjs(v).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: College) => (
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
      <Title heading={5} style={{ margin: '0 0 16px' }}>学院管理</Title>
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
          onChange: (current, pageSize) => fetchData(current, pageSize),
        }}
      />
      <Modal
        title={editRecord ? '编辑学院' : '新增学院'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        unmountOnExit
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <FormItem label="学院名称" field="name" rules={[{ required: true, message: '请输入学院名称' }]}>
            <Input placeholder="请输入学院名称" maxLength={50} />
          </FormItem>
          <FormItem label="学院代码" field="code" rules={editRecord ? [] : [{ required: true, message: '请输入学院代码' }]}>
            <Input placeholder="请输入学院代码" maxLength={20} />
          </FormItem>
          <FormItem label="简介" field="description">
            <Input.TextArea placeholder="请输入简介" maxLength={200} />
          </FormItem>
          <FormItem label="院长" field="dean">
            <Input placeholder="请输入院长姓名" maxLength={20} />
          </FormItem>
          <FormItem label="联系电话" field="phone">
            <Input placeholder="请输入联系电话" maxLength={20} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
