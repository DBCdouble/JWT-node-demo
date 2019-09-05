import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button, message } from 'antd'
import { stringify } from 'qs'
import './index.less'

export default function Home ({ location, history }) {
  const [list, handleList] = useState([])

  const logout = async () => {
    await axios.get('/api/user/logout')
    history.push('/login')
    message.success('退出登录！')
  }
  
  const fetchList = () => {
    const params = {
      num: 10
    }
    axios.get(`/api/home/goodsList?${ stringify(params) }`)
    .then(({ data }) => {
      handleList(data.data || [])
    })
  }
  
  const renderList = () => {
    return list.map(item => (
      <img key={ item.id } src={ item.imgpath } className='goods-box' alt=""/>
    ))
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <React.Fragment>
      <div style={{ overflow: 'auto', margin: '0 20px' }}>
        <div style={{ float: 'left',fontSize: '20px' }}>Hello { location.state && location.state.username }, 欢迎来到周琦大魔王的世界</div>
        <div style={{ float: 'right' }}><Button type='primary' onClick={logout}>退出</Button></div>
      </div>
      { renderList() }
    </React.Fragment>
  )
}