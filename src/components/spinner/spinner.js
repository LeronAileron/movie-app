import React from 'react'
import { Space, Spin } from 'antd'

import './spinner.css'

const Spinner = () => {
  return (
    <div className="spinner">
      <Space direction="vertical" className="spinner--width-for-antd">
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </Space>
    </div>
  )
}

export default Spinner
