// 测试助手工具
export const testHelper = {
  // 创建测试项目数据
  createTestProject: (id: string = Date.now().toString()) => {
    const testProject = {
      id: id,
      title: '测试项目 ' + id,
      description: '这是一个用于测试的项目',
      status: 'in-progress',
      priority: 'medium',
      technologies: ['React', 'TypeScript'],
      tags: ['测试', '前端'],
      startDate: new Date().toISOString(),
      endDate: undefined,
      documents: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return testProject
  },
  
  // 初始化测试数据
  initTestData: () => {
    const testProjects = [
      {
        id: '1762220454315',
        title: '测试项目 1762220454315',
        description: '这是一个用于测试的项目',
        status: 'in-progress',
        priority: 'medium',
        technologies: ['React', 'TypeScript'],
        tags: ['测试', '前端'],
        startDate: new Date().toISOString(),
        endDate: undefined,
        documents: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
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
    console.log('测试数据初始化完成，包含项目ID: 1762220454315')
    return testProjects
  },
  
  // 检查特定项目是否存在
  checkProjectExists: (projectId: string) => {
    const storedProjects = localStorage.getItem('projects')
    if (storedProjects) {
      const projects = JSON.parse(storedProjects)
      const project = projects.find((p: any) => p.id === projectId)
      console.log(`项目ID ${projectId} 是否存在:`, !!project)
      if (project) {
        console.log('项目详情:', project)
      }
      return !!project
    }
    console.log('localStorage中没有项目数据')
    return false
  },
  
  // 模拟访问项目编辑页面
  simulateEditPage: (projectId: string) => {
    console.log(`=== 模拟访问项目编辑页面: ${projectId} ===`)
    
    // 检查项目是否存在
    const exists = testHelper.checkProjectExists(projectId)
    
    if (!exists) {
      console.log('项目不存在，创建测试项目...')
      const testProject = testHelper.createTestProject(projectId)
      const existingProjects = localStorage.getItem('projects')
      const projects = existingProjects ? JSON.parse(existingProjects) : []
      projects.push(testProject)
      localStorage.setItem('projects', JSON.stringify(projects))
      console.log('测试项目创建完成')
    }
    
    // 模拟页面URL
    const editUrl = `/projects/${projectId}/edit`
    console.log('编辑页面URL:', editUrl)
    
    return true
  }
}

// 导出全局测试函数
declare global {
  interface Window {
    testHelper: typeof testHelper
  }
}

// 在开发环境中自动挂载到window对象
if (process.env.NODE_ENV === 'development') {
  window.testHelper = testHelper
}