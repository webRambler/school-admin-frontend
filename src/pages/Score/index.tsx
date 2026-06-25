import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Modal, Form, Select, InputNumber, Message, Popconfirm, Typography, Tag, Card, Grid, Statistic } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'
import { scoreApi } from '../../api/score'
import { studentApi } from '../../api/student'
import { courseApi } from '../../api/course'
import { classRoomApi } from '../../api/classRoom'
import type {
  ScoreDetailVO,
  ScoreCreateRequest,
  ScoreUpdateRequest,
  PageResult,
  Student,
  Course,
  ClassRoom,
  ScoreRankVO,
  CourseStatisticsVO,
} from '../../types'

const { Title } = Typography
const FormItem = Form.Item
const Row = Grid.Row
const Col = Grid.Col

export default function ScorePage() {
  const [data, setData] = useState<ScoreDetailVO[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [modalVisible, setModalVisible] = useState(false)
  const [editRecord, setEditRecord] = useState<ScoreDetailVO | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([])
  const [form] = Form.useForm()

  // 排名相关
  const [rankingVisible, setRankingVisible] = useState(false)
  const [rankingType, setRankingType] = useState<'course' | 'classCourse'>('course')
  const [rankingData, setRankingData] = useState<ScoreRankVO[]>([])
  const [rankingLoading, setRankingLoading] = useState(false)
  const [rankingCourseId, setRankingCourseId] = useState<number | undefined>()
  const [rankingClassId, setRankingClassId] = useState<number | undefined>()

  // 统计相关
  const [statsVisible, setStatsVisible] = useState(false)
  const [statsData, setStatsData] = useState<CourseStatisticsVO | null>(null)
  const [statsCourseId, setStatsCourseId] = useState<number | undefined>()
  const [statsLoading, setStatsLoading] = useState(false)

  const fetchData = useCallback(async (pageNum = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const res = await scoreApi.listDetail({ pageNum, pageSize })
      const page = res.data as PageResult<ScoreDetailVO>
      setData(page.records)
      setPagination({ current: page.pageNum, pageSize: page.pageSize, total: page.total })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchOptions = useCallback(async () => {
    try {
      const [sRes, cRes, crRes] = await Promise.all([
        studentApi.list({ pageNum: 1, pageSize: 500 }),
        courseApi.list({ pageNum: 1, pageSize: 500 }),
        classRoomApi.list({ pageNum: 1, pageSize: 200 }),
      ])
      setStudents((sRes.data as PageResult<Student>).records)
      setCourses((cRes.data as PageResult<Course>).records)
      setClassRooms((crRes.data as PageResult<ClassRoom>).records)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchData()
    fetchOptions()
  }, [fetchData, fetchOptions])

  const handleAdd = () => {
    setEditRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: ScoreDetailVO) => {
    setEditRecord(record)
    form.setFieldsValue({ score: record.score, examType: record.examType })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    await scoreApi.delete(id)
    Message.success('删除成功')
    fetchData(pagination.current, pagination.pageSize)
  }

  const handleOk = async () => {
    const values = await form.validate()
    if (editRecord) {
      await scoreApi.update(editRecord.scoreId, values as ScoreUpdateRequest)
      Message.success('更新成功')
    } else {
      await scoreApi.create(values as ScoreCreateRequest)
      Message.success('创建成功')
    }
    setModalVisible(false)
    fetchData(pagination.current, pagination.pageSize)
  }

  const handleRanking = async () => {
    if (!rankingCourseId) {
      Message.warning('请选择课程')
      return
    }
    setRankingLoading(true)
    try {
      let res
      if (rankingType === 'classCourse' && rankingClassId) {
        res = await scoreApi.rankingByClassAndCourse(rankingClassId, rankingCourseId)
      } else {
        res = await scoreApi.rankingByCourse(rankingCourseId)
      }
      setRankingData(res.data)
    } finally {
      setRankingLoading(false)
    }
  }

  const handleStats = async () => {
    if (!statsCourseId) {
      Message.warning('请选择课程')
      return
    }
    setStatsLoading(true)
    try {
      const res = await courseApi.statistics(statsCourseId)
      setStatsData(res.data)
    } finally {
      setStatsLoading(false)
    }
  }

  const scoreColor = (v: number) => {
    if (v >= 90) return 'green'
    if (v >= 60) return 'blue'
    return 'red'
  }

  const columns = [
    { title: '序号', dataIndex: 'scoreId', width: 80, render: (_v: unknown, _record: unknown, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1 },
    { title: '学生', dataIndex: 'studentName' },
    { title: '性别', dataIndex: 'gender' },
    { title: '课程', dataIndex: 'courseName' },
    { title: '学分', dataIndex: 'credit' },
    {
      title: '成绩',
      dataIndex: 'score',
      render: (v: number) => <Tag color={scoreColor(v)}>{v}</Tag>,
    },
    { title: '考试类型', dataIndex: 'examType' },
    { title: '学生手机', dataIndex: 'phone' },
    {
      title: '操作',
      width: 160,
      render: (_: unknown, record: ScoreDetailVO) => (
        <Space>
          <Button type="text" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.scoreId)}>
            <Button type="text" status="danger" size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const rankingColumns = [
    { title: '排名', dataIndex: 'rank', width: 80 },
    { title: '学生', dataIndex: 'studentName' },
    { title: '班级', dataIndex: 'className' },
    {
      title: '成绩',
      dataIndex: 'score',
      width: 80,
      render: (v: number) => <Tag color={scoreColor(v)}>{v}</Tag>,
    },
  ]

  return (
    <div>
      <Title heading={5} style={{ margin: '0 0 16px' }}>成绩管理</Title>
      <Space style={{ marginBottom: 16 }} wrap>
        <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>录入成绩</Button>
        <Button onClick={() => { setRankingType('course'); setRankingData([]); setRankingCourseId(undefined); setRankingClassId(undefined); setRankingVisible(true) }}>课程排名</Button>
        <Button onClick={() => { setRankingType('classCourse'); setRankingData([]); setRankingCourseId(undefined); setRankingClassId(undefined); setRankingVisible(true) }}>班级排名</Button>
        <Button onClick={() => { setStatsData(null); setStatsCourseId(undefined); setStatsVisible(true) }}>课程统计</Button>
      </Space>
      <Table
        rowKey="scoreId"
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

      {/* 录入/编辑成绩 */}
      <Modal
        title={editRecord ? '编辑成绩' : '录入成绩'}
        visible={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        unmountOnExit
      >
        <Form form={form} layout="vertical" autoComplete="off">
          {!editRecord && (
            <>
              <FormItem label="学生" field="studentId" rules={[{ required: true, message: '请选择学生' }]}>
                <Select placeholder="请选择学生" showSearch allowClear filterOption={(input, option) => String((option?.props as Record<string, unknown>)?.children ?? '').includes(input)}>
                  {students.map((s) => (
                    <Select.Option key={s.id} value={s.id}>{s.name}（ID: {s.id}）</Select.Option>
                  ))}
                </Select>
              </FormItem>
              <FormItem label="课程" field="courseId" rules={[{ required: true, message: '请选择课程' }]}>
                <Select placeholder="请选择课程" allowClear>
                  {courses.map((c) => (
                    <Select.Option key={c.id} value={c.id}>{c.name}（{c.credit}学分）</Select.Option>
                  ))}
                </Select>
              </FormItem>
            </>
          )}
          <FormItem label="成绩" field="score" rules={[{ required: true, message: '请输入成绩' }]}>
            <InputNumber placeholder="0-100" min={0} max={100} precision={1} style={{ width: '100%' }} />
          </FormItem>
          <FormItem label="考试类型" field="examType" rules={editRecord ? [] : [{ required: true, message: '请选择考试类型' }]}>
            <Select placeholder="请选择考试类型" allowClear>
              <Select.Option value="期中">期中</Select.Option>
              <Select.Option value="期末">期末</Select.Option>
              <Select.Option value="补考">补考</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>

      {/* 排名弹窗 */}
      <Modal
        title={rankingType === 'course' ? '课程成绩排名' : '班级课程成绩排名'}
        visible={rankingVisible}
        onCancel={() => setRankingVisible(false)}
        footer={null}
        style={{ width: 700 }}
      >
        <Space style={{ marginBottom: 16 }} wrap>
          {rankingType === 'classCourse' && (
            <Select
              placeholder="选择班级"
              style={{ width: 200 }}
              value={rankingClassId}
              onChange={setRankingClassId}
              allowClear
            >
              {classRooms.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          )}
          <Select
            placeholder="选择课程"
            style={{ width: 200 }}
            value={rankingCourseId}
            onChange={setRankingCourseId}
            allowClear
          >
            {courses.map((c) => (
              <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleRanking} loading={rankingLoading}>查询</Button>
        </Space>
        <Table
          rowKey="rank"
          columns={rankingColumns}
          data={rankingData}
          loading={rankingLoading}
          pagination={false}
          size="small"
        />
      </Modal>

      {/* 课程统计弹窗 */}
      <Modal
        title="课程成绩统计"
        visible={statsVisible}
        onCancel={() => setStatsVisible(false)}
        footer={null}
        style={{ width: 600 }}
      >
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="选择课程"
            style={{ width: 200 }}
            value={statsCourseId}
            onChange={setStatsCourseId}
            allowClear
          >
            {courses.map((c) => (
              <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleStats} loading={statsLoading}>查询</Button>
        </Space>
        {statsData && (
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="课程名称" value={statsData.courseName} />
              </Col>
              <Col span={8}>
                <Statistic title="学分" value={statsData.credit} />
              </Col>
              <Col span={8}>
                <Statistic title="选课人数" value={statsData.studentCount} suffix="人" />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={6}>
                <Statistic title="平均分" value={statsData.avgScore} precision={1} />
              </Col>
              <Col span={6}>
                <Statistic title="最高分" value={statsData.maxScore} />
              </Col>
              <Col span={6}>
                <Statistic title="最低分" value={statsData.minScore} />
              </Col>
              <Col span={6}>
                <Statistic title="及格率" value={statsData.passRate} precision={1} suffix="%" />
              </Col>
            </Row>
          </Card>
        )}
      </Modal>
    </div>
  )
}
