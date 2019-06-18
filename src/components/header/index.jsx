import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import {withRouter} from 'react-router-dom'

import {reqWeather} from '../../api'
import memoryUtil from '../../utils/memoryUtil'
import {removeUser} from '../../utils/storageUtil.js'
import {formateDate} from '../../utils/dateUtil.js'
import menuList from '../../config/menuConfig.js'
import './index.less'

const confirm = Modal.confirm

class Header extends Component {

    state = {
        currentTime : formateDate(Date.now())
    }

    getCurrentTime = () => {
        this.timeId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000);
    }

    getWeather = async() => {
        const {dayPictureUrl, weather} = await reqWeather('北京')
        this.setState({dayPictureUrl, weather})
    }

    getTitle = () => {
        const path = this.props.location.pathname
        let title = ''
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const selectedItem= item.children.find(item => item.key === path)
                if (selectedItem) {
                    title = selectedItem.title
                }
            }
        });
        return title
    }

    logout = () => {
        confirm({
            title: '是否确认退出管理系统?',
            onOk : () => {
                removeUser()
                memoryUtil.user = {}
                this.props.history.replace('/login')
            }
        })
    }


    componentDidMount () {
        this.getCurrentTime()
        this.getWeather()
    }

    componentWillUnmount () {
        clearInterval(this.timeId)
    }

    render() {
        
        const title = this.getTitle()
        const { currentTime, dayPictureUrl, weather} = this.state
        return (
            <header className='admin-header'>
                <div className="admin-header-top">
                    <span>欢迎，{memoryUtil.user.username}！</span>
                    <Button size="small" className='logout' onClick={this.logout}>退出</Button>
                </div>
                <div className="admin-header-bottom">
                    <div className="admin-header-bottom-left">
                        <span>{title}</span>
                    </div>
                    <div className="admin-header-bottom-right">
                        <span>{currentTime}</span>
                        {!!dayPictureUrl && <img src={dayPictureUrl} alt="weather"/>}
                        <span>{weather}</span>
                    </div>
                </div>
            </header>
        )
    }
}

export default withRouter(Header)