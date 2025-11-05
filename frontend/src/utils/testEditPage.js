// 测试项目编辑页面的脚本
// 在浏览器控制台中运行此脚本

// 初始化测试数据
function initTestData() {
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
    }
  ]
  
  localStorage.setItem('projects', JSON.stringify(testProjects))
  console.log('测试数据初始化完成')
  console.log('项目ID 1762220454315 已创建')
  return testProjects
}

// 检查项目是否存在
function checkProjectExists(projectId) {
  const storedProjects = localStorage.getItem('projects')
  if (storedProjects) {
    const projects = JSON.parse(storedProjects)
    const project = projects.find(p => p.id === projectId)
    console.log(`项目ID ${projectId} 是否存在:`, !!project)
    if (project) {
      console.log('项目详情:', project)
    }
    return !!project
  }
  console.log('localStorage中没有项目数据')
  return false
}

// 模拟访问编辑页面
function testEditPage(projectId = '1762220454315') {
  console.log('=== 测试项目编辑页面 ===')
  
  // 检查当前数据
  console.log('当前localStorage数据:', localStorage.getItem('projects'))
  
  // 检查项目是否存在
  const exists = checkProjectExists(projectId)
  
  if (!exists) {
    console.log('项目不存在，初始化测试数据...')
    initTestData()
  }
  
  // 模拟页面URL
  const editUrl = `/projects/${projectId}/edit`
  console.log('编辑页面URL:', editUrl)
  
  // 检查当前页面
  console.log('当前页面路径:', window.location.pathname)
  
  return true
}

// 导出到全局作用域
window.testEditPage = testEditPage
window.initTestData = initTestData
window.checkProjectExists = checkProjectExists

console.log('测试脚本已加载')
console.log('使用方法:')
console.log('1. testEditPage() - 测试编辑页面')
console.log('2. initTestData() - 初始化测试数据')
console.log('3. checkProjectExists("1762220454315") - 检查项目是否存在')