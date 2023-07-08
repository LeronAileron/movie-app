import React from 'react'
import { Alert, Space } from 'antd'

import './error.css'

const Error = ({ message, type }) => {
  return (
    <Space className="main main--error" direction="vertical">
      <Alert message={message} type={type} />
    </Space>
  )
}

Error.defaultProps = {
  type: 'error',
}

export default Error
