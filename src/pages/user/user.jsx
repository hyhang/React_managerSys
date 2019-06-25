import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card,  Button, Table, Modal } from 'antd'

import { reqUserList } from '../../api/'
import LinkButton from '../../components/link-button'
import { formateDate } from '../../utils/dateUtil'
import UserForm from './user-form'
/**
 * 用户管理
 */
export default class User extends Component {

  state = {
    users: [],
    isAddUser: false,
    isLoading: false,
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: create_time => formateDate(create_time)
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
      },
      {
        title: '操作',
        render : () => (
          <span>
            <LinkButton onClick={() => this.showUpdate()}>修改</LinkButton>
            &nbsp;&nbsp;
            <LinkButton onClick={() => this.clickDelete()}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  getUserList = async () => {
    this.setState({isLoading: true})
    const result = await reqUserList()
    this.setState({isLoading: false})
    if (result.status === 0) {
      const { users } = result.data
      this.setState({
        users
      })
    }
  }
  
  componentWillMount() {
    this.initColumns()
  }
  
  
  componentDidMount() {
    this.getUserList()
  }
  

  render() {
    const { users, isLoading } = this.state
    const title = (
      <Link>
        <Button type='primary'>创建用户</Button>
      </Link>
    )
    return (
      <Card title={title}>
        <Table
          columns={this.columns}
          bordered
          dataSource={ users }
          loading={isLoading}
        >

        </Table>
      </Card>
    )
  }
}
