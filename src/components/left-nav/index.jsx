import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu }  = Menu
export default class LeftNav extends Component {
    render() {
        return (
            <div className = 'left-nav'>
                <Link to='/' className = 'left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>管理系统</h1>
                </Link>
                <Menu
                mode="inline"
                theme="light"
                >
                <Menu.Item key="1">
                    <Icon type="pie-chart" />
                    <span>Option 1</span>
                </Menu.Item>
                <SubMenu
                    key="sub1"
                    title={
                    <span>
                        <Icon type="mail" />
                        <span>Navigation One</span>
                    </span>
                    }
                >
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                    <Menu.Item key="7">Option 7</Menu.Item>
                    <Menu.Item key="8">Option 8</Menu.Item>
                </SubMenu>
                </Menu>
            </div>
        )
    }
}
