import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { Layout } from 'antd'
import memoryUtil from '../../utils/memoryUtil'
import LeftNav from '../../components/left-nav/'

const { Header, Footer, Sider, Content } = Layout
export default class Admin extends Component {
    render() {

        if (!memoryUtil.user._id) {
            return <Redirect to='/login'/>
        }

        return (
            <Layout style={{height: '100%'}}>
                <Sider style={{backgroundColor: 'white'}}>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header style={{backgroundColor: 'white'}}>Header</Header>
                    <Content style={{backgroundColor : 'white', margin : 30}}>

                    </Content>
                    <Footer style={{textAlign : 'center', color : '#aaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
