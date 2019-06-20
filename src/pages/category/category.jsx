import React, { Component } from 'react'
import { Card, Table, Icon, Button, Modal, message } from 'antd'

import { reqCategory, reqUpdateCategory, reqAddCategory } from '../../api/'
import LinkButton from '../../components/link-button/'
import UpdateForm from './update-form'
import AddForm from './add-form'
/* 
Admin的分类管理子路由
*/
export default class Category extends Component {
  //初始化状态
  state = {
    parentId : '0',
    parentName : '',
    categorys : [],
    subCategorys : [],
    loading : false,
    showStatus : 0
  }

  getCategory = async () => {
    this.setState({loading : true})
    const {parentId} = this.state
    const result = await reqCategory(parentId)
    this.setState({loading : false})
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({categorys})
      } else {
        this.setState({
          subCategorys : categorys
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

  showUpdate = (category) => {
    this.category = category
    this.setState({showStatus : 1})
  }

  backCategory = () => {
    this.setState({
      parentId : '0',
      parentName : '',
      subCategory : [],
    })
  }

  addCategory = () => {
    this.form.validateFields( async (err, values) => {
      if (!err) {
        this.setState({showStatus:0})
        const { categoryName, parentId } = this.form.getFieldsValue()
        this.form.resetFields()
        const result = await reqAddCategory( categoryName, parentId ) 

        if (result.status === 0) {
          message.success('添加分类成功')
          if (parentId === '0') {
            this.getCategory('0')
          } else if (parentId === this.state.parentId) {
            this.getCategory()
          }
        }
      }
    })
  }

  updateCategory = () => {
    this.form.validateFields( async (err, values) => {
      if (!err) {
        this.setState({showStatus:0})
        const categoryName = this.form.getFieldValue('categoryName')
        this.form.resetFields()
        const categoryId = this.category._id
        const result = await reqUpdateCategory(categoryId, categoryName)

        if (result.status === 0) {
          message.success('更新分类成功')
          this.getCategory()
        }
      }
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
              <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
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
    const { parentId, parentName, categorys, subCategorys, loading } = this.state
    const category = this.category || {}

    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.backCategory}>一级分类列表</LinkButton>
        <Icon type = "arrow-right" style={{margin:'0 10px'}}></Icon>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.setState({showStatus : 2})}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={parentId==='0' ? categorys : subCategorys}
          bordered
          rowKey = "_id"
          pagination={{ defaultPageSize: 6, showQuickJumper: true}}
        />

        <Modal
          title="更新分类"
          visible={this.state.showStatus === 1}
          onOk={this.updateCategory}
          onCancel={() => {
            this.form.resetFields()
            this.setState({showStatus : 0})
          }}
        >
          <UpdateForm categoryName={category.name} setForm={(form) => this.form = form}></UpdateForm>
        </Modal>

        <Modal
          title="添加分类"
          visible={this.state.showStatus === 2}
          onOk={this.addCategory}
          onCancel={() => {
            this.form.resetFields()
            this.setState({showStatus : 0})
          }}
        >
          <AddForm categorys={categorys} parentId={parentId} setForm={(form) => this.form = form}></AddForm>
        </Modal>
    </Card>
    )
  }
}
