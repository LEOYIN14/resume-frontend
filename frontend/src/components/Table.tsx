import React from 'react';
import { Table as AntTable, type TableProps as AntTableProps, Empty } from 'antd';

interface TableProps<T> extends Omit<AntTableProps<T>, 'rowKey'> {
  rowKey: keyof T;
  loading?: boolean;
  emptyText?: string;
}

/**
 * 通用表格组件
 * 封装了Ant Design的Table组件，提供统一的表格展示体验
 * 适用于展示项目列表、技能清单等数据
 */
function Table<T>({
  columns,
  dataSource,
  loading = false,
  rowKey,
  emptyText = '暂无数据',
  ...props
}: TableProps<T>) {
  // 确保columns是数组
  const safeColumns = columns || [];
  // 确保dataSource是数组
  const safeDataSource = dataSource || [];

  // 转换rowKey为函数
  const rowKeyFunction = (record: T) => {
    const key = record[rowKey];
    return String(key);
  };

  return (
    <AntTable
      columns={safeColumns}
      dataSource={safeDataSource}
      rowKey={rowKeyFunction}
      loading={loading}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条数据`,
        ...(props.pagination || {})
      }}
      locale={{
        emptyText: (
          <Empty
            description={emptyText}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )
      }}
      {...props}
    />
  );
}

export default Table;