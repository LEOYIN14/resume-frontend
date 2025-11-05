import React from 'react';
import { Statistic } from 'antd';
import { Project } from '../types/project';

interface ProjectStatusChartProps {
  projects: Project[];
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ projects }) => {
  // 统计项目状态分布
  const getStatusStats = () => {
    // 颜色配置 - 更和谐的颜色方案
    const statusColors = {
      'planning': {
        name: '规划中',
        color: '#6366F1',
        bgColor: '#E0E7FF'
      },
      'in-progress': {
        name: '进行中', 
        color: '#3B82F6',
        bgColor: '#DBEAFE'
      },
      'completed': {
        name: '已完成', 
        color: '#14B8A6',
        bgColor: '#CCFBF1'
      },
      'on-hold': {
        name: '暂停中', 
        color: '#F97316',
        bgColor: '#FFEDD5'
      }
    };

    const statusCount = {
      'planning': 0,
      'in-progress': 0,
      'completed': 0,
      'on-hold': 0
    };

    projects.forEach(project => {
      statusCount[project.status]++;
    });

    const total = projects.length;
    
    return {
      total,
      stats: Object.entries(statusCount)
        .map(([status, count]) => ({
          status,
          name: statusColors[status as keyof typeof statusColors].name,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
          color: statusColors[status as keyof typeof statusColors].color,
          bgColor: statusColors[status as keyof typeof statusColors].bgColor
        }))
        .filter(item => item.count > 0)
    };
  };

  const { stats, total } = getStatusStats();

  // 渲染空状态
  if (total === 0) {
    return <div style={emptyStateStyle}>暂无项目数据</div>;
  }

  return (
    <div style={containerStyle}>
      {/* 项目总数卡片 */}
      <div style={totalCardStyle}>
        <Statistic 
          title="项目总数" 
          value={total} 
          valueStyle={valueStyle}
          titleStyle={titleStyle}
        />
      </div>
      
      {/* 状态分布卡片 */}
      <div style={statsContainerStyle}>
        {stats.map((item, index) => (
          <div 
            key={item.status} 
            style={{
              ...statusCardStyle,
              marginBottom: index === stats.length - 1 ? 0 : '16px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={headerStyle}>
              <div style={titleContainerStyle}>
                <div style={{ ...colorIndicatorStyle, backgroundColor: item.color, boxShadow: `0 0 0 4px ${item.bgColor}` }} />
                <span style={statusNameStyle}>{item.name}</span>
              </div>
              <span style={{ ...countStyle, color: item.color }}>{item.count}个</span>
            </div>
            
            {/* 进度条 */}
            <div style={{ ...progressBarContainer, backgroundColor: item.bgColor }}>
              <div 
                style={{
                  ...progressBarStyle,
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}33`,
                  animationDelay: `${index * 0.15}s`
                }}
              />
            </div>
            
            <div style={percentageStyle}>
              {item.percentage.toFixed(1)}%
            </div>
          </div>
          ))}
      </div>
    </div>
  );
};

// 样式常量定义
const containerStyle = {
  width: '100%',
  height: '100%',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px',
  margin: '0',
  boxSizing: 'border-box',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  background: 'white',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden' as const
};

const emptyStateStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#94A3B8',
  fontSize: '14px',
  fontWeight: '500',
  height: '100%'
};

const totalCardStyle = {
  marginBottom: '16px',
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
};

const valueStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1E293B'
};

const titleStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#64748B',
  marginBottom: '8px'
};

const statsContainerStyle = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  paddingRight: '4px',
  boxSizing: 'border-box'
};

const statusCardStyle = {
  padding: '16px',
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const titleContainerStyle = {
  display: 'flex',
  alignItems: 'center'
};

const colorIndicatorStyle = {
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  marginRight: '10px'
};

const statusNameStyle = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1E293B'
};

const countStyle = {
  fontSize: '18px',
  fontWeight: '700'
};

const progressBarContainer = {
  position: 'relative',
  height: '12px',
  borderRadius: '6px',
  overflow: 'hidden',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
};

const progressBarStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  borderRadius: '6px',
  transition: 'width 1s ease-out',
  animation: 'progressAnimation 1s ease-out forwards',
  transform: 'translateX(-100%)'
};

const percentageStyle = {
  fontSize: '13px',
  fontWeight: '500',
  color: '#64748B',
  marginTop: '8px',
  textAlign: 'right'
};

// 鼠标悬停处理函数
const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
};

// 移除全局样式注入，避免可能的副作用

export default ProjectStatusChart;