import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'

import { BASE_IMG_URL } from '../../utils/constant'
import { reqDeletePicture } from '../../api/'

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = error => reject(error)
	})
}

export default class PicturesWall extends Component {
	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [

		]
	}

	static propTypes = {
		imgs: PropTypes.array
	}

	getPictures = () => {
		return this.state.fileList.map( item => item.name)
	}

	handleCancel = () => this.setState({ previewVisible: false });

	handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		})
	}

	handleChange = async ({ file, fileList }) => {
		if (file.status === 'done') {
			const result = file.response
			if (result.status === 0) {
				const name = result.data.name
				const url = result.data.url
				//不能直接更新file，而需要更新fileList中的最后一个file
				fileList[fileList.length - 1].name = name
				fileList[fileList.length - 1].url = url
			} else {
				message.error('上传图片失败')
			}
		} else if (file.status === 'removed') {
			const result = await reqDeletePicture(file.name)
			if (result.status === 0) {
				message.success('删除图片成功')
			} else {
				message.error('删除图片失败')
			}
		}
		this.setState({
			fileList
		})

	}

	
	componentWillMount() {
		const { imgs } = this.props
		if (imgs && imgs.length > 0) {
			const fileList = imgs.map( (item, index) => ({
				uid: -index + '',
				name: item,
				url: BASE_IMG_URL + item,
				status: 'done'
			}))
			this.setState({
				fileList
			})
		}
	}
	

	render() {
		const { previewVisible, previewImage, fileList } = this.state
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">上传图片</div>
			</div>
		)
		return (
			<div className="clearfix">
				<Upload
					action="/manage/img/upload"
					listType="picture-card"
					name='image'
					fileList={fileList}
					onPreview={this.handlePreview}
					onChange={this.handleChange}
				>
					{fileList.length >= 6 ? null : uploadButton}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		)
	}
}
