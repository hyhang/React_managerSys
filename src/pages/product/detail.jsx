import React, { Component } from 'react'
import { List, Card, Icon } from 'antd'

import { reqCategoryById } from '../../api/'
import { BASE_IMG_URL } from '../../utils/constant'
import LinkButton from '../../components/link-button/';

const { Item } = List
export default class ProductDetail extends Component {

  state = {
    primaryCategoryName : '',
    secondaryCategoryName : ''
  }

  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state
    if (pCategoryId === '0') {
      const result = await reqCategoryById(categoryId)
      const primaryCategoryName = result.data.name
      this.setState({
        primaryCategoryName
      })
    } else {
      const results = await Promise.all([reqCategoryById(pCategoryId), reqCategoryById(categoryId)])
      const primaryCategoryName = results[0].data.name
      const secondaryCategoryName = results[1].data.name
      this.setState({
        primaryCategoryName,
        secondaryCategoryName
      })
    }
  }
  

  render() {
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ fontSize: 20 , marginRight: 10}} />
        </LinkButton>
        商品详情
      </span>
    )

    const { secondaryCategoryName, primaryCategoryName } = this.state
     
    const { name, desc, price, imgs, detail } = this.props.location.state
    return (
      <Card title={ title } className='product-detail'>
        <List>
          <Item className='detail-item'>
            <span>商品名称：</span>
            <span>{ name }</span>
          </Item>
          <Item className='detail-item'>
            <span>商品描述：</span>
            <span>{ desc }</span>
          </Item>
          <Item className='detail-item'>
            <span>商品价格：</span>
            <span>{ price }</span>
          </Item>
          <Item className='detail-item'>
            <span>所属分类：</span>
            <span>
              {primaryCategoryName}
              {secondaryCategoryName ? <Icon type='arrow-right' style={{margin:'0 5px'}}></Icon> : ''}
              {secondaryCategoryName}
            </span>
          </Item>
          <Item className='detail-item'>
            <span>商品图片：</span>
            <span className='picture'>
              {
                imgs.map(item => <img src={BASE_IMG_URL + item} key = {item} alt='product'/>)
              }
            </span>
          </Item>
          <Item className='detail-item'>
            <span>商品详情：</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
