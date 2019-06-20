import React, { Component } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detial'
import ProductAddUpdate from './addupdate'
/**
 * 商品管理
 */
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/product' component={ProductHome}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Route path='/product/addupdate' component={ProductAddUpdate}/>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}
