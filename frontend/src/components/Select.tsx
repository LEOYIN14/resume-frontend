import React from 'react';
import { Select as AntSelect } from 'antd';
import type { ReactNode } from 'react';

// 定义选项类型
interface Option {
  value: string | number;
  label: string | ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value?: string | number | string[] | number[];
  onChange?: (value: string | number | string[] | number[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  multiple?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 通用选择器组件
 * 封装了Ant Design的Select组件，提供统一的下拉选择体验
 */
const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  // multiple参数暂时未使用
  size = 'middle',
  className,
  style,
}) => {
  // 转换size属性以兼容Ant Design v5
  const selectSize = size === 'middle' ? 'default' : size;
  
  return (
    <div className={`select-wrapper ${className || ''}`} style={style}>
      {label && <div className="select-label">{label}</div>}
      <AntSelect
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        size={selectSize as any}
        status={error ? 'error' : undefined}
      >
        {options.map((option) => (
          <AntSelect.Option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </AntSelect.Option>
        ))}
      </AntSelect>
      {error && <div className="select-error">{error}</div>}
    </div>
  );
};

export default Select;