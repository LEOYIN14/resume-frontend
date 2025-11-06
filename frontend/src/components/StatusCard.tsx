import React, { CSSProperties } from 'react';
import { Card } from 'antd';
import { PieChartOutlined, BarChartOutlined, AreaChartOutlined } from '@ant-design/icons';

interface StatusCardProps {
  title: string;
  count?: number | string;
  percentage?: number;
  color: string;
  bgColor: string;
  icon?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
  hoverable?: boolean;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  count,
  percentage,
  color,
  bgColor,
  icon,
  description,
  children,
  style,
  hoverable = true,
  onMouseEnter,
  onMouseLeave
}) => {
  // 根据标题选择默认图标
  const getDefaultIcon = () => {
    if (title.includes('状态')) return <PieChartOutlined />;
    if (title.includes('统计')) return <BarChartOutlined />;
    return <AreaChartOutlined />;
  };

  const displayIcon = icon || getDefaultIcon();
  const defaultHandleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  };

  const defaultHandleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
  };

  return (
    <Card
      style={{
        ...cardStyle,
        ...style,
        borderColor: bgColor
      }}
      onMouseEnter={onMouseEnter || defaultHandleMouseEnter}
      onMouseLeave={onMouseLeave || defaultHandleMouseLeave}
      hoverable={hoverable}
    >
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <div style={{ ...colorIndicatorStyle, backgroundColor: color, boxShadow: `0 0 0 4px ${bgColor}` }} />
          <span style={titleStyle}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {count !== undefined && count !== '' ? (
            <span style={{ ...countStyle, color }}>{count}</span>
          ) : (
            <div style={{ color, fontSize: '18px' }}>{displayIcon}</div>
          )}
          {percentage !== undefined && (
            <span style={percentageStyle}>{percentage.toFixed(1)}%</span>
          )}
        </div>
      </div>
      
      {description && (
        <div style={{ ...descriptionStyle, color: '#64748B', marginBottom: '12px' }}>
          {description}
        </div>
      )}
      
      {percentage !== undefined && (
        <div style={progressBarContainer}>
          <div 
            style={{
              ...progressBarStyle,
              backgroundColor: color,
              width: `${percentage}%`
            }}
          />
        </div>
      )}
      
      {children}
    </Card>
  );
};

// 样式常量定义
const cardStyle: CSSProperties = {
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const descriptionStyle: CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.5,
  opacity: 0.9
};

const titleContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};

const colorIndicatorStyle: CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  marginRight: '10px'
};

const titleStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1E293B'
};

const countStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: '700'
};

const progressBarContainer: CSSProperties = {
  position: 'relative',
  height: '8px',
  borderRadius: '6px',
  overflow: 'hidden',
  backgroundColor: '#f0f0f0',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
};

const progressBarStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  borderRadius: '6px',
  transition: 'width 1s ease-out'
};

const percentageStyle: CSSProperties = {
  fontSize: '13px',
  fontWeight: '500',
  color: '#64748B',
  textAlign: 'right'
};

export default StatusCard;