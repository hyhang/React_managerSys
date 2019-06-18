import React, { Component } from 'react'
import { Card, Table, Icon, Button } from 'antd'

import { reqCategory } from '../../api/'
import LinkButton from '../../components/link-botton/'
/* 
Admin的分类管理子路由
*/
export default class Category extends Component {
  //初始化状态
  state = {
    parentId : '0',
    parentName : '',
    category : [],
    subCategory : [],
    loading : false
  }

  getCategory = async () => {
    this.setState({loading : true})
    const {parentId} = this.state
    const result = await reqCategory(parentId)
    this.setState({loading : false})
    if (result.status === 0) {
      const category = result.data
      if (parentId === '0') {
        this.setState({category})
      } else {
        this.setState({
          subCategory : category
        })
      }
    }
  }

  showSubCategory = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategory()
    })
  }

  backCategory = () => {
    this.setState({
      parentId : '0',
      parentName : '',
      subCategory : [],
    })
  }

  initColumns = () => {
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render : (category) => {
          return (
            <span>
              <LinkButton>修改分类</LinkButton>
              <LinkButton onClick={()=>this.showSubCategory(category)}>查看子分类</LinkButton>
            </span>
          )
        }
      }
    ]
  }

  componentDidMount() {
    this.getCategory()
  }
  
  componentWillMount() {
    this.initColumns()
  }

  render() {
    const { parentId, parentName, category, subCategory, loading } = this.state

    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.backCategory}>一级分类列表</LinkButton>
        <Icon type = "arrow-right" style={{margin:'0 10px'}}></Icon>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary'>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={parentId==='0' ? category : subCategory}
          bordered
          rowKey = "_id"
          pagination={{ defaultPageSize: 6, showQuickJumper: true}}
        />
    </Card>
    )
  }
}
