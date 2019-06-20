import React, { Component } from 'react'
import { Card, Icon, Input, Select, Button, Table, message } from 'antd'

import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constant.js'
import LinkButton from '../../components/link-button/'

const { Option } = Select
export default class ProductHome extends Component {

  state = {
    loading: false,
    products: [],
    total: 0,
    searchType: 'productName',
    keyWord: ''
  }

  updateStatus = async (status, productId) => {
    const result = await reqUpdateStatus(status, productId)
    if (result.status === 0) {
      message.success('商品状态更新成功')
      this.getProducts(this.pageNum)
    }
  }

  initialColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        title: '状态',
        width: 150,
        render: (product) => {
          const { status, _id } = product
          const btnText = status === 1 ? '下架' : '上架'
          const text = status === 1 ? '在售' : '已下架'
          return (
            <span>
              <Button type='primary' onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}>{btnText}</Button>
              <span style={{ marginLeft: 10 }}>{text}</span>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 120,
        render: (product) => (
          <span>
            <LinkButton onClick={()=> this.props.history.push('/product/detail', product)}>详情</LinkButton>
            <LinkButton>修改</LinkButton>
          </span>
        )
      },
    ]
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({ loading: true })
    const { searchType, keyWord } = this.state
    let result
    if (!keyWord) {
      result = await reqProducts({ pageNum, pageSize: PAGE_SIZE })
    } else {
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchType, keyWord })
    }
    this.setState({ loading: false })
    if (result.status === 0) {
      const { total, list } = result.data
      this.setState({
        products: list,
        total
      })
    }
  }

  componentWillMount() {
    this.initialColumns()
  }


  componentDidMount() {
    this.getProducts(1)
  }


  render() {
    const { total, products, searchType, keyWord, loading } = this.state
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='productName'>按商品名称查找</Option>
          <Option value='productDesc'>按商品描述查找</Option>
        </Select>
        <Input
          value={keyWord}
          style={{ margin: '0 15px', width: 150 }}
          onChange={(e) => this.setState({ keyWord: e.target.value })}
          placeholder='请输入关键字'
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>
          <Icon type='search'></Icon>
          搜索
                </Button>
      </span>
    )
    const extra = (
      <Button type='primary'>
        <Icon type='plus'></Icon>
        添加商品
            </Button>
    )

    return (
      <Card title={title} extra={extra} >
        <Table
          loading={loading}
          bordered
          dataSource={products}
          columns={this.columns}
          rowKey="_id"
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            total,
            onChange: this.getProducts
          }}
        >
        </Table>
      </Card>
    )
  }
}
