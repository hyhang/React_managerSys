import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
  
class AddForm extends Component {

    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    
    componentWillMount() {
        this.props.setForm(this.props.form)
    }
    

    render() {
        const { getFieldDecorator } = this.props.form
        const { categorys, parentId } = this.props
        return (
            <Form>

                <Form.Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue : parentId
                        })(
                            <Select value="0">
                                <Select.Option value="0">一级分类</Select.Option>
                                {
                                    categorys.map(item => {
                                        return (
                                            <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName', {
                            rules : [
                                {required : true, message : '分类名称必须填写'}
                            ]
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)