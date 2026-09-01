'use client';
import { Alert } from 'antd';
export default function AlertComponent({text}) {
  return (
    <>
      <Alert
        message="Informational Notes"
        description={text}
        type="info"
        showIcon
      />
    </>
  );
}