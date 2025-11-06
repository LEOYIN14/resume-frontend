import React from 'react';
import { Empty } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { Project } from '../types/project';
import StatusCard from './StatusCard';

interface ProjectStatusChartProps {
  projects: Project[];
  showLegend?: boolean;
  size?: number;
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ projects, showLegend = true }) => {

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
        .filter(item => item.count > 0),
      pieData: Object.entries(statusCount)
        .map(([status, count]) => ({
          type: statusColors[status as keyof typeof statusColors].name,
          value: count,
          color: statusColors[status as keyof typeof statusColors].color
        }))
        .filter(item => item.value > 0)
    };
  };

  const { stats, total } = getStatusStats();
  
  // 饼图数据（即使为空也保持结构）
  const pieData = stats.length > 0 ? stats.map(item => ({
    name: item.name,
    value: item.count,
    color: item.color
  })) : [];

  // 渲染空状态
  if (total === 0) {
    return (
      <div style={containerStyle}>
        <StatusCard
          title="项目状态分布"
          color="#8B5CF6"
          bgColor="#EDE9FE"
          icon={<PieChartOutlined />}
          description="暂无项目数据"
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: 200,
            color: '#64748B',
            fontSize: '14px'
          }}>
            暂无项目数据，添加项目后将显示状态分布
          </div>
        </StatusCard>
      </div>
    );
  }

  // 不需要pieConfig配置，直接使用recharts组件

  return (
    <div className="project-status-chart" style={{ height: '100%' }}>
      {/* 项目统计总览 - 合并了项目总数和活动概览 */}
      <StatusCard
        title="项目统计总览"
        color="#6366F1"
        bgColor="#E0E7FF"
        icon={<PieChartOutlined />}
        description="项目总数与健康状况分析"
        style={{ marginBottom: '16px' }}
      >
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* 项目总数和核心指标 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>项目总数</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6366F1' }}>{total}</div>
            </div>
            
            {/* 状态分布简短指标 */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {pieData.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: item.color,
                      marginRight: '6px'
                    }} 
                  />
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {total > 0 && (
            <div style={{ width: '100%' }}>
              {/* 活跃度可视化 */}
              <div style={{ 
                marginBottom: '16px', 
                padding: '12px', 
                backgroundColor: '#F0FDFA', 
                borderRadius: '8px',
                border: '1px solid #A7F3D0'
              }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#065F46', marginBottom: '8px' }}>
                  项目活跃度分析
                </div>
                <div style={{ height: '8px', backgroundColor: '#ECFDF5', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      height: '100%', 
                      width: '75%', 
                      backgroundColor: '#10B981',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
              
              {/* 项目健康指标 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>项目完成率</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155' }}>
                    {total > 0 ? ((pieData.find(item => item.name === '已完成')?.value || 0) / total * 100).toFixed(1) : '0'}%
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>活跃项目数</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155' }}>
                    {total > 0 ? pieData.filter(item => item.name === '规划中' || item.name === '进行中').reduce((sum, item) => sum + item.value, 0) : 0}
                  </div>
                </div>
              </div>
            </div>
          )}
          {total === 0 && <Empty description="暂无项目数据" style={{ marginTop: 20 }} />}
        </div>
      </StatusCard>
      
      {/* 状态分布详情 - 只有当showLegend为true时显示 */}
      {showLegend && (
        <div style={statsContainerStyle}>
          {stats.map((item, index) => (
            <StatusCard
              key={item.status}
              title={item.name}
              count={`${item.count}个`}
              percentage={item.percentage}
              color={item.color}
              bgColor={item.bgColor}
              description={`占总数的 ${item.percentage.toFixed(1)}%`}
              style={{
                marginBottom: index === stats.length - 1 ? 0 : '8px'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 样式常量定义
const containerStyle = {
  width: '100%',
  height: '100%',
  padding: '8px',
  margin: '0',
  boxSizing: 'border-box' as const,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px'
};

// 移除未使用的emptyStateStyle变量

const statsContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px'
};

export default ProjectStatusChart;