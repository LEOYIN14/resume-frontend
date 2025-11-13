import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectCreate from './pages/ProjectCreate'
import ProjectDetail from './pages/ProjectDetail'
import ProjectEdit from './pages/ProjectEdit'
import Resume from './pages/Resume'
import ResumeLibrary from './pages/ResumeLibrary'
import Skills from './pages/Skills'
import Settings from './pages/Settings'

import './App.css'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Header />
      <Layout>
        <Sidebar />
        <Layout className="content-layout">
          <Content className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/create" element={<ProjectCreate />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/projects/:id/edit" element={<ProjectEdit />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/resume/library" element={<ResumeLibrary />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/settings" element={<Settings />} />

            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App