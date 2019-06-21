import React, { Component } from 'react'
import { Card, Icon, Input, Form, Button, Cascader } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategory } from '../../api/'

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {

	state = {
		options : []
	}

	//对价格进行校验
	validatePrice = (rule, value, callback) => {
		if (value < 0) {
			callback('价格不能小于0')
		} else {
			callback()
		}
	}

	//提交表单
	submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('验证通过', values);
      }
    })
	}

	initOptions = (categories) => {
		const options = categories.map( item => ({
			 label : item.name,
			 value : item._id,
			 isLeaf : false
		}))
		this.setState({
			options
		})
	}

	loadData = async selectedOptions => {
		//得到选中的一级分类项的数据对象
		const targetOption = selectedOptions[0]
		//显示loading效果
		targetOption.loading = true
		//异步获取二级分类列表的数据
		const targetOptionValue= targetOption.value
		const targetSubOptions = await this.getCategories(targetOptionValue)
		//请求得到结果，loading效果隐藏
		targetOption.loading = false
		if (!targetSubOptions || targetSubOptions.length === 0) {
			targetOption.isLeaf = true
		} else {
			//给option对象添加children属性，就会自动显示为二级列表
			targetOption.children = targetSubOptions.map(item => ({
				label : item.name,
				value : item._id,
				isLeaf : true
			}))
		}
		//更新options列表数据
		this.setState({
			options : [...this.state.options]
		})
	}

	getCategories = async(parentId) => {
		const result = await reqCategory(parentId)
		if (result.status === 0) {
			const categories = result.data
			console.log(categories)
			if (parentId === '0') {
				this.initOptions(categories)
			} else {
				return categories
			}
		}
	}
	
	componentDidMount() {
		this.getCategories('0')
	}
	

	render() {
		const { getFieldDecorator } = this.props.form

		const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{ fontSize: 20 }} />
        </LinkButton>
        添加商品
      </span>
		)
		
		 // 指定form的item布局的对象
		const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }

		return (
			<Card title={ title }>
				<Form {...formItemLayout}>
				<Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  { required: true, message: '商品名称必须输入' }
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: '',
                rules: [
                  { required: true, message: '商品描述必须输入' }
                ]
              })(
                <TextArea placeholder="请输入商品描述" autosize />
              )
            }
          </Item>

          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: '',
                rules: [
                  { required: true, message: '商品价格必须输入' },
                  { validator: this.validatePrice}
                ]
              })(
                <Input type='number' placeholder='请输入商品价格' addonAfter="元"/>
              )
            }
          </Item>
          <Item label="商品分类">
            <Cascader
              options={this.state.options}
              loadData={this.loadData}
            />
          </Item>
          <Item label="商品图片">
            <span>商品图片列表</span>
          </Item>
          <Item
            label="商品详情"
          >
            <span>商品详情信</span>
          </Item>
          <Button type='primary' onClick={this.submit}>提交</Button>
				</Form>
      </Card>
		)
	}
}

export default Form.create()(ProductAddUpdate)