import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Project } from '../types/project';

interface ProjectStatusChartProps {
  projects: Project[];
}

const ProjectStatusChart: React.FC<ProjectStatusChartProps> = ({ projects }) => {
  // 统计项目状态分布
  const getStatusData = () => {
    const statusCount = {
      'planning': 0,
      'in-progress': 0,
      'completed': 0,
      'on-hold': 0
    };

    projects.forEach(project => {
      statusCount[project.status]++;
    });

    return [
      { value: statusCount['planning'], name: '规划中' },
      { value: statusCount['in-progress'], name: '进行中' },
      { value: statusCount['completed'], name: '已完成' },
      { value: statusCount['on-hold'], name: '暂停中' }
    ].filter(item => item.value > 0);
  };

  const chartOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '项目状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: getStatusData()
      }
    ],
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d']
  };

  return (
    <ReactECharts 
      option={chartOption} 
      style={{ height: '350px', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default ProjectStatusChart;