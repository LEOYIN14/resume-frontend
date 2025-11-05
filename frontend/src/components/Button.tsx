import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps } from 'antd';

/**
 * 通用按钮组件
 * 封装了Ant Design的Button组件，提供统一的样式和交互体验
 */
const Button: React.FC<ButtonProps> = ({
  children,
  ...props
}) => {
  // 直接使用Ant Design Button组件的原生属性
  return (
    <AntButton {...props}>
      {children}
    </AntButton>
  );
};

export default Button;