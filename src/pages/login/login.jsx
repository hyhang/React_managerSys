import React, { Component } from 'react'
import { Form, Icon, Input, Button, message} from 'antd'
import { Redirect } from 'react-router-dom'
import { reqLogin } from '../../api'
import memoryUtil from '../../utils/memoryUtil'
import logo from '../../assets/images/logo.png'
import './login.less'

class Login extends Component {

    handleSubmit = e => {
        e.preventDefault()
        //表单验证
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values
                let result = await reqLogin(username, password)
                if (result.status === 0) {
                    const user = result.data
                    localStorage.setItem('USER', JSON.stringify(user))
                    memoryUtil.user = user
                    message.success(`欢迎回来${memoryUtil.user.username}`,2)
                    this.props.history.replace('/')
                } else {
                    message.error(result.msg, 2)
                }
            }
        })
    }

    validatePwd = (rule, value = '', callback ) => {
        value = value.trim()
        if (!value) {
            callback('请输密码') 
        } else if (value.length < 4){
            callback('密码长度最小不能小于4位')
        } else if (value.length > 16){
            callback('密码长度最大不能大于16位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户密码为数字、字母以及下划线的组合')
        } else {
            callback()
        }
    }

    render() {

        if (memoryUtil.user._id) {
            return <Redirect to="/" />
        }

        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo"/>
                    <h1>React后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                initialValue : '',
                                rules : [
                                    {required : true, whitespace: true, message : '请输入用户名'},
                                    {min : 4, message : '用户名最小长度不能小于4位'},
                                    {max : 12, message : '用户名最大长度不能大于12位'},
                                    {pattern : /^[a-zA-Z0-9_]+$/, message : '用户名为数字、字母以及下划线的组合'}
                                ]
                            })(
                                <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules : [{
                                    validator : this.validatePwd
                                }]
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

 const WrappedLogin = Form.create()(Login)
 export default WrappedLogin