// 编辑页面诊断工具
import { message } from 'antd'

export const editPageDiagnostic = {
  // 检查编辑页面状态
  checkEditPageStatus: (projectId: string) => {
    console.log('=== 编辑页面诊断开始 ===')
    
    // 1. 检查localStorage数据
    const storedProjects = localStorage.getItem('projects')
    console.log('1. localStorage项目数据:', storedProjects)
    
    if (!storedProjects) {
      console.error('❌ 没有找到项目数据')
      message.error('没有找到项目数据')
      return false
    }
    
    // 2. 解析项目数据
    let projects = []
    try {
      projects = JSON.parse(storedProjects)
      console.log('2. 解析后的项目数据:', projects)
    } catch (error) {
      console.error('❌ 解析项目数据失败:', error)
      message.error('项目数据格式错误')
      return false
    }
    
    // 3. 查找特定项目
    const foundProject = projects.find((p: any) => p.id === projectId)
    console.log('3. 查找项目结果:', foundProject)
    
    if (!foundProject) {
      console.error('❌ 项目不存在，ID:', projectId)
      message.error('项目不存在')
      return false
    }
    
    // 4. 检查项目数据完整性
    const requiredFields = ['id', 'title', 'description', 'status']
    const missingFields = requiredFields.filter(field => !foundProject[field])
    
    if (missingFields.length > 0) {
      console.error('❌ 项目数据不完整，缺少字段:', missingFields)
      message.error('项目数据不完整')
      return false
    }
    
    console.log('✅ 项目数据检查通过')
    
    // 5. 检查URL参数
    const currentPath = window.location.pathname
    const urlProjectId = currentPath.split('/').pop()
    console.log('4. 当前URL路径:', currentPath)
    console.log('5. URL中的项目ID:', urlProjectId)
    
    if (urlProjectId !== projectId) {
      console.warn('⚠️ URL中的项目ID与传入的不一致')
    }
    
    // 6. 检查路由状态
    console.log('6. 浏览器历史记录长度:', window.history.length)
    console.log('7. 当前页面状态:', window.history.state)
    
    console.log('=== 编辑页面诊断结束 ===')
    return true
  },
  
  // 修复编辑页面问题
  fixEditPageIssues: (projectId: string) => {
    console.log('=== 开始修复编辑页面问题 ===')
    
    // 1. 检查并修复localStorage数据
    let projects = []
    try {
      const storedProjects = localStorage.getItem('projects')
      if (storedProjects) {
        projects = JSON.parse(storedProjects)
      }
    } catch (error) {
      console.error('修复: 清除损坏的localStorage数据')
      localStorage.removeItem('projects')
      projects = []
    }
    
    // 2. 如果项目不存在，创建测试数据
    const foundProject = projects.find((p: any) => p.id === projectId)
    if (!foundProject) {
      console.log('修复: 创建测试项目数据')
      const testProject = {
        id: projectId,
        title: '测试项目',
        description: '这是一个测试项目',
        status: 'planning',
        priority: 'medium',
        technologies: ['React', 'TypeScript'],
        tags: ['测试'],
        startDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      projects.push(testProject)
      localStorage.setItem('projects', JSON.stringify(projects))
      message.success('已创建测试项目数据')
    }
    
    // 3. 强制刷新页面
    console.log('修复: 强制刷新页面')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    
    console.log('=== 修复完成 ===')
    return true
  },
  
  // 实时监控编辑页面状态
  monitorEditPage: () => {
    console.log('=== 开始监控编辑页面状态 ===')
    
    let lastPath = window.location.pathname
    let redirectCount = 0
    
    const monitorInterval = setInterval(() => {
      const currentPath = window.location.pathname
      
      if (currentPath !== lastPath) {
        redirectCount++
        console.log(`🚨 检测到页面跳转 (${redirectCount}次):`)
        console.log('  从:', lastPath)
        console.log('  到:', currentPath)
        console.log('  时间:', new Date().toLocaleTimeString())
        
        lastPath = currentPath
        
        // 如果跳转次数过多，停止监控
        if (redirectCount >= 5) {
          console.error('❌ 检测到过多跳转，停止监控')
          clearInterval(monitorInterval)
          message.error('检测到页面频繁跳转，请检查代码逻辑')
        }
      }
    }, 100) // 每100ms检查一次
    
    // 10秒后自动停止监控
    setTimeout(() => {
      clearInterval(monitorInterval)
      console.log('=== 监控结束 ===')
    }, 10000)
    
    return monitorInterval
  },
  
  // 运行完整诊断
  runFullDiagnostic: (projectId: string) => {
    console.log('🔍 运行完整诊断...')
    
    const status = editPageDiagnostic.checkEditPageStatus(projectId)
    
    if (!status) {
      console.log('尝试自动修复...')
      editPageDiagnostic.fixEditPageIssues(projectId)
    }
    
    // 开始监控
    editPageDiagnostic.monitorEditPage()
    
    return status
  }
}

// 全局调试工具
if (typeof window !== 'undefined') {
  (window as any).editPageDiagnostic = editPageDiagnostic
  
  // 自动检测编辑页面
  if (window.location.pathname.includes('/edit')) {
    const projectId = window.location.pathname.split('/').pop()
    if (projectId) {
      console.log('🔧 检测到编辑页面，自动加载诊断工具')
      setTimeout(() => {
        editPageDiagnostic.runFullDiagnostic(projectId)
      }, 1000)
    }
  }
}

export default editPageDiagnostic