// 编辑页面调试工具
export const editPageDebugger = {
  // 检查编辑页面状态
  checkEditPageStatus: (projectId: string) => {
    console.log('=== 编辑页面调试信息 ===')
    console.log('当前项目ID:', projectId)
    console.log('当前URL:', window.location.href)
    
    // 检查localStorage中的项目数据
    const storedProjects = localStorage.getItem('projects')
    console.log('localStorage项目数据:', storedProjects)
    
    if (storedProjects) {
      const projects = JSON.parse(storedProjects)
      const project = projects.find((p: any) => p.id === projectId)
      console.log('找到的项目数据:', project)
      
      if (project) {
        console.log('项目详情:')
        console.log('- 标题:', project.title)
        console.log('- 状态:', project.status)
        console.log('- 开始日期:', project.startDate)
        console.log('- 结束日期:', project.endDate)
        console.log('- 技术栈:', project.technologies)
        console.log('- 标签:', project.tags)
      } else {
        console.log('❌ 未找到对应ID的项目')
        console.log('可用的项目ID:', projects.map((p: any) => p.id))
      }
    } else {
      console.log('❌ localStorage中没有项目数据')
    }
    
    // 检查路由参数
    const pathParts = window.location.pathname.split('/')
    console.log('路由参数:', pathParts)
    
    // 检查浏览器历史记录
    console.log('历史记录长度:', window.history.length)
    console.log('历史记录状态:', window.history.state)
  },
  
  // 修复编辑页面问题
  fixEditPageIssues: (projectId: string) => {
    console.log('=== 开始修复编辑页面问题 ===')
    
    // 1. 确保项目数据存在
    const storedProjects = localStorage.getItem('projects')
    if (!storedProjects) {
      console.log('❌ 没有项目数据，创建测试数据...')
      const testProjects = [
        {
          id: projectId,
          title: '测试项目 ' + projectId,
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
      ]
      localStorage.setItem('projects', JSON.stringify(testProjects))
      console.log('✅ 测试数据创建完成')
    } else {
      const projects = JSON.parse(storedProjects)
      const project = projects.find((p: any) => p.id === projectId)
      
      if (!project) {
        console.log('❌ 项目不存在，创建项目...')
        const newProject = {
          id: projectId,
          title: '测试项目 ' + projectId,
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
        projects.push(newProject)
        localStorage.setItem('projects', JSON.stringify(projects))
        console.log('✅ 项目创建完成')
      } else {
        console.log('✅ 项目数据正常')
      }
    }
    
    // 2. 检查并修复日期格式
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const project = projects.find((p: any) => p.id === projectId)
    
    if (project) {
      // 修复日期格式
      if (project.startDate && typeof project.startDate === 'string') {
        try {
          const date = new Date(project.startDate)
          if (isNaN(date.getTime())) {
            console.log('❌ 开始日期格式错误，修复中...')
            project.startDate = new Date().toISOString()
          }
        } catch (error) {
          console.log('❌ 开始日期解析错误，修复中...')
          project.startDate = new Date().toISOString()
        }
      }
      
      if (project.endDate && typeof project.endDate === 'string') {
        try {
          const date = new Date(project.endDate)
          if (isNaN(date.getTime())) {
            console.log('❌ 结束日期格式错误，修复中...')
            project.endDate = undefined
          }
        } catch (error) {
          console.log('❌ 结束日期解析错误，修复中...')
          project.endDate = undefined
        }
      }
      
      localStorage.setItem('projects', JSON.stringify(projects))
      console.log('✅ 日期格式修复完成')
    }
    
    console.log('=== 修复完成 ===')
    console.log('建议: 刷新页面查看修复效果')
  },
  
  // 模拟编辑页面访问
  simulateEditPage: (projectId: string) => {
    console.log('=== 模拟编辑页面访问 ===')
    
    // 检查当前状态
    editPageDebugger.checkEditPageStatus(projectId)
    
    // 尝试修复问题
    editPageDebugger.fixEditPageIssues(projectId)
    
    console.log('=== 模拟完成 ===')
    console.log('现在可以尝试访问编辑页面')
  },
  
  // 快速测试所有功能
  runAllTests: () => {
    console.log('=== 运行所有调试测试 ===')
    
    const testProjectId = 'test-' + Date.now()
    
    // 1. 检查状态
    editPageDebugger.checkEditPageStatus(testProjectId)
    
    // 2. 修复问题
    editPageDebugger.fixEditPageIssues(testProjectId)
    
    // 3. 再次检查状态
    editPageDebugger.checkEditPageStatus(testProjectId)
    
    console.log('=== 所有测试完成 ===')
  }
}

// 导出全局调试函数
declare global {
  interface Window {
    editPageDebugger: typeof editPageDebugger
  }
}

// 在开发环境中自动挂载到window对象
if (process.env.NODE_ENV === 'development') {
  window.editPageDebugger = editPageDebugger
}