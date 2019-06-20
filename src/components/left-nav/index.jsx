import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'

const { SubMenu, Item } = Menu
class LeftNav extends Component {
  //使用数组的map方法来将菜单配置文件加工成React标签数组
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname  //获取当前请求的路径
    return menuList.map(item => {
      if (!item.children) {
        return (
          <Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Item>
        )
      } else {
        //若请求的是某个item的children，则当前item的key就是openKey
        const selectItem = item.children.find(item => path.indexOf(item.key) === 0)
        if (selectItem) {
          this.openKey = item.key
        }
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  // getMenuNodes = (menuList) => {
  //     const path = this.props.location.pathname  //获取当前请求的路径

  //     return menuList.reduce( (pre, item) => {
  //         if (!item.children) {
  //             pre.push(
  //                 <Item key={item.key}>
  //                     <Link to={item.key}> 
  //                         <Icon type={item.icon} />
  //                         <span>{item.title}</span>
  //                     </Link>
  //                 </Item>
  //             )
  //         } else {
  //             //若请求的是某个item的children，则当前item的key就是openKey
  //             const selectItem = item.children.find( item => item.key === path)
  //             if (selectItem) {
  //                 this.openKey = item.key
  //             }

  //             pre.push (
  //                 <SubMenu
  //                 key={item.key}
  //                 title={
  //                     <span>
  //                         <Icon type={item.icon} />
  //                         <span>{item.title}</span>
  //                     </span>
  //                 }
  //                 >
  //                     {
  //                         this.getMenuNodes(item.children)
  //                     }
  //                 </SubMenu>
  //             )
  //         }
  //         return pre
  //     }, [])
  // }

  //getMenuNodes方法在render中调用的话每一次点击都会调用。
  //而在componentWillMount时调用，只会触发一次。
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let selectedKey = this.props.location.pathname
    if (selectedKey.indexOf('/product') === 0) {
      selectedKey = '/product'
    }
    const openKey = this.openKey
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={logo} alt="logo" />
          <h1>管理系统</h1>
        </Link>
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={[openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)