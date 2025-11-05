import React from 'react';
import { Input as AntInput, type InputProps as AntInputProps } from 'antd';

interface InputProps extends AntInputProps {
  label?: string;
  error?: string;
}

/**
 * 通用输入框组件
 * 封装了Ant Design的Input组件，提供统一的样式和交互体验
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="input-wrapper">
      {label && <div className="input-label">{label}</div>}
      <AntInput {...props} status={error ? 'error' : undefined} />
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;