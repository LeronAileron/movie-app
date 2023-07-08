import React from 'react'
import { Space, Spin } from 'antd'

const Spinner = () => {
  return (
    <div className="main main--loading">
      <Space
        direction="vertical"
        style={{
          width: '100%',
        }}
      >
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      </Space>
    </div>
  )
}

export default Spinner
