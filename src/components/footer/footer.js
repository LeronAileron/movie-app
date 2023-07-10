import React from 'react'
import { Pagination, ConfigProvider } from 'antd'

import './footer.css'

const Footer = ({ page, total, onPaginationChange }) => {
  return (
    <footer className="footer">
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: '#1890FF',
            colorPrimary: 'fff',
          },
        }}
      >
        <Pagination
          to="#search-input"
          defaultCurrent={1}
          current={page}
          total={total}
          onChange={onPaginationChange}
          showSizeChanger={false}
        />
      </ConfigProvider>
    </footer>
  )
}

export default Footer
