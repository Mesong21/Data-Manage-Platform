import { Layout, Menu, Dropdown, Button } from 'antd';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import DataForm from './components/DataManagement/DataForm.tsx';
import TagForm from './components/TagManagement/TagForm.tsx';
import React, { useState } from 'react';
import { OptionType } from './utils/LabelDropdown.tsx';
import SettingsMenu from './components/Settings/SettingsMenu.tsx';
import { LanguageContext } from './components/Settings/LanguageContext.tsx';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function App() {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  console.log(localStorage.getItem('language'));
  return (
    <div className='app'>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <Header className="header">
          <div className="title">
            {language === 'zh' ? '数据管理平台' : 'Data Management Platform'}
          </div>
          <SettingsMenu />
        </Header>
        <Router >
          <Layout >

            <Sider className='guide' width={150}>
              <Menu theme='dark' mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Link to="/dataform">{language === 'zh' ? '数据管理' : 'Manage Data'}</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/tagform">{language === 'zh' ? '标签管理' : 'Manage Tags'}</Link>
                </Menu.Item>
              </Menu>
            </Sider>

            <Layout>
              <Content>
                <Routes>
                  <Route path="/dataform"
                    element={<DataForm
                      onSearch={function (query: { name: string; labelData: OptionType[]; time: string; }): void {
                        throw new Error('Function not implemented.');
                      }} />} />
                  <Route path="/tagform"
                    element={<TagForm
                      onSearch={function (query: { labelname: string; }): void {
                        throw new Error('Function not implemented.');
                      }} handleSearch={function (): void {
                        throw new Error('Function not implemented.');
                      }} />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        </Router>
      </LanguageContext.Provider>
    </div>
  );
}

export default App;