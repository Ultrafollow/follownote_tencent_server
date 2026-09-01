import React from 'react';
import { Button, ConfigProvider, Flex, Tooltip } from 'antd';
export default function Tip({ children,text }) {
  return (
        <Tooltip placement="left" title={text}>
            <span>{children}</span>
        </Tooltip>
  );
}