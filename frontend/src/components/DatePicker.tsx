import React from 'react';
import { DatePicker as AntDatePicker, TimePicker as AntTimePicker } from 'antd';
import type { DatePickerProps as AntDatePickerProps, TimePickerProps as AntTimePickerProps } from 'antd';

// 为DatePicker组件添加完整功能
interface DatePickerProps extends Omit<AntDatePickerProps, 'status'> {
  label?: string;
  error?: string;
  format?: string;
}

/**
 * 通用日期选择器组件
 * 封装了Ant Design的DatePicker组件，提供统一的样式和交互体验
 * 适用于选择出生日期、入职日期、项目截止日期等场景
 */
const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  format = 'YYYY-MM-DD',
  ...props
}) => {
  return (
    <div className="date-picker-wrapper">
      {label && <div className="date-picker-label">{label}</div>}
      <AntDatePicker 
        format={format}
        status={error ? 'error' : undefined}
        {...props}
      />
      {error && <div className="date-picker-error">{error}</div>}
    </div>
  );
};

// 同时添加TimePicker组件
interface TimePickerProps extends Omit<AntTimePickerProps, 'status'> {
  label?: string;
  error?: string;
}

/**
 * 通用时间选择器组件
 * 封装了Ant Design的TimePicker组件，提供统一的样式和交互体验
 * 适用于选择时间相关场景
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  error,
  ...props
}) => {
  return (
    <div className="time-picker-wrapper">
      {label && <div className="time-picker-label">{label}</div>}
      <AntTimePicker 
        status={error ? 'error' : undefined}
        {...props}
      />
      {error && <div className="time-picker-error">{error}</div>}
    </div>
  );
};

export default DatePicker;