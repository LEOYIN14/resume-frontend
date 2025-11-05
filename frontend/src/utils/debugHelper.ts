// 调试助手工具
export const debugHelper = {
  // 检查应用状态
  checkAppStatus: () => {
    console.log('=== 应用诊断信息 ===')
    console.log('当前路径:', window.location.pathname)
    console.log('localStorage项目数据:', localStorage.getItem('projects'))
    console.log('Redux store状态:', (window as any).__REDUX_DEVTOOLS_EXTENSION__ ? '可用' : '不可用')
    
    // 检查是否有JavaScript错误
    const errors = window.onerror ? '有错误处理函数' : '无错误处理函数'
    console.log('JavaScript错误状态:', errors)
  },
  
  // 初始化测试数据
  initTestData: () => {
    const testProjects = [
      {
        id: '1',
        title: '个人简历管理系统',
        description: '基于React和Ant Design的个人简历管理系统，支持项目管理和技能展示',
        status: 'completed',
        priority: 'high',
        technologies: ['React', 'TypeScript', 'Ant Design'],
        tags: ['前端', '管理系统'],
        startDate: new Date('2024-01-01').toISOString(),
        endDate: new Date('2024-03-01').toISOString(),
        documents: [],
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-03-01').toISOString()
      },
      {
        id: '2',
        title: 'AI营销实验室',
        description: 'AI驱动的营销工具平台，包含内容生成、数据分析等功能',
        status: 'in-progress',
        priority: 'urgent',
        technologies: ['Python', 'FastAPI', 'React'],
        tags: ['AI', '营销', '数据分析'],
        startDate: new Date('2024-02-01').toISOString(),
        endDate: undefined,
        documents: [],
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    localStorage.setItem('projects', JSON.stringify(testProjects))
    console.log('测试数据初始化完成')
    return testProjects
  },
  
  // 清除所有数据
  clearAllData: () => {
    localStorage.removeItem('projects')
    console.log('所有数据已清除')
  },
  
  // 检查特定页面状态
  checkPageStatus: (pageName: string) => {
    console.log(`=== ${pageName}页面状态检查 ===`)
    
    switch (pageName) {
      case 'dashboard':
        console.log('仪表板页面检查:')
        console.log('- 项目数据:', localStorage.getItem('projects'))
        console.log('- 当前路径:', window.location.pathname)
        break
        
      case 'project-edit':
        console.log('项目编辑页面检查:')
        const urlParams = new URLSearchParams(window.location.search)
        console.log('- URL参数:', urlParams.toString())
        console.log('- 路径参数:', window.location.pathname.split('/'))
        break
        
      default:
        console.log('未知页面类型')
    }
  }
}

// 导出全局调试函数
declare global {
  interface Window {
    debugHelper: typeof debugHelper
  }
}

// 在开发环境中自动挂载到window对象
if (process.env.NODE_ENV === 'development') {
  window.debugHelper = debugHelper
}