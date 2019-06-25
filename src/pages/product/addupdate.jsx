import React, { Component } from 'react'
import { Card, Icon, Input, Form, Button, Cascader, message } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategory, reqAddOrUpdate, reqProducts } from '../../api/'
import PicturesWall from './picture-wall'
import RichEditor from './rich-editor'

const { Item } = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {

	state = {
		options: []
	}

	constructor(props) {
		super(props)
    this.pictureWallRef = React.createRef()
    this.richEditorRef = React.createRef()
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
		this.props.form.validateFields( async (err, values) => {
			if (!err) {
        let categoryId, pCategoryId
        const { name, desc, price, categoryIds } = values
        const detail = this.richEditorRef.current.getDetail()
        const imgs = this.pictureWallRef.current.getPictures()        
        if (categoryIds.length === 1) {
          categoryId = categoryIds[0]
          pCategoryId = '0'
        } else {
          categoryId = categoryIds[1]
          pCategoryId = categoryIds[0]
        }
        let product = {
          name,
          desc,
          price,
          categoryId,
          pCategoryId,
          imgs,
          detail
        }
        if (this.isUpdate) {
          product._id = this.product._id
        }
        console.log('验证通过', values, imgs, detail);
        const result = await reqAddOrUpdate(product)
        if (result.status === 0) {
          message.success((this.isUpdate ? '更新' : '添加') + '商品成功')
          this.props.history.goBack()
        } else {
          message.error((this.isUpdate ? '更新' : '添加') + '商品失败')
        }
      }
		})
	}

	//根据分类的数组来更新options显示
	initOptions = async (categories) => {
		const options = categories.map(item => ({
			label: item.name,
			value: item._id,
			isLeaf: false
		}))
		//如果更新的是二级列表下的商品，那就需要获取二级分类列表
		const { product, isUpdate } = this
		if (isUpdate && product.pCategoryId !== '0') {
			const subCategories = await this.getCategories(product.pCategoryId)
			if (subCategories && subCategories.length > 0) {
				const targetOption = options.find(option => option.value === product.pCategoryId)
				targetOption.children = subCategories.map(item => ({
					label: item.name,
					value: item._id,
					isLeaf: true
				}))
			}
		}

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
		const targetOptionValue = targetOption.value
		const targetSubOptions = await this.getCategories(targetOptionValue)
		//请求得到结果，loading效果隐藏
		targetOption.loading = false
		if (!targetSubOptions || targetSubOptions.length === 0) {
			targetOption.isLeaf = true
		} else {
			//给option对象添加children属性，就会自动显示为二级列表
			targetOption.children = targetSubOptions.map(item => ({
				label: item.name,
				value: item._id,
				isLeaf: true
			}))
		}
		//更新options列表数据
		this.setState({
			options: [...this.state.options]
		})
	}

	getCategories = async (parentId) => {
		const result = await reqCategory(parentId)
		if (result.status === 0) {
			const categories = result.data
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

	componentWillMount() {
		//将路由组件传过来的product放在组件对象上
		this.product = this.props.location.state || {}
		//将标识更新的状态放在组件对象上
		this.isUpdate = !!this.product._id
	}


	render() {
		const { getFieldDecorator } = this.props.form
		const { product, isUpdate } = this

		if (product._id) {
			if (product.pCategoryId === '0') {
				product.categoryIds = [product.categoryId]
			} else {
				product.categoryIds = [product.pCategoryId, product.categoryId]
			}
		} else {
			product.categoryIds = []
		}

		const title = (
			<span>
				<LinkButton onClick={() => this.props.history.goBack()}>
					<Icon type='arrow-left' style={{ fontSize: 20 }} />
				</LinkButton>
				{isUpdate ? '商品更新' : '商品添加'}
			</span>
		)

		// 指定form的item布局的对象
		const formItemLayout = {
			labelCol: { span: 2 },
			wrapperCol: { span: 8 },
		}

		return (
			<Card title={title}>
				<Form {...formItemLayout}>
					<Item label="商品名称">
						{
							getFieldDecorator('name', {
								initialValue: product.name,
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
								initialValue: product.desc,
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
								initialValue: product.price,
								rules: [
									{ required: true, message: '商品价格必须输入' },
									{ validator: this.validatePrice }
								]
							})(
								<Input type='number' placeholder='请输入商品价格' addonAfter="元" />
							)
						}
					</Item>
					<Item label="商品分类">
						{
							getFieldDecorator('categoryIds', {
								initialValue: product.categoryIds,
								rules: [
									{ required: true, message: '商品分类必须指定' }
								]
							})(
								<Cascader
									options={this.state.options}
									loadData={this.loadData}
								/>
							)
						}
					</Item>
					<Item label="商品图片">
						<PicturesWall ref={this.pictureWallRef} imgs={product.imgs} />
					</Item>
					<Item
						label="商品详情"
						wrapperCol={{ span: 19 }}
					>
						<RichEditor detail={product.detail} ref={this.richEditorRef}/>
					</Item>
					<Button type='primary' onClick={this.submit}>提交</Button>
				</Form>
			</Card>
		)
	}
}

export default Form.create()(ProductAddUpdate)