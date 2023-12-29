import { Menu, Dropdown, Button } from 'antd';
import React, { useContext, useState } from 'react';
import { LanguageContext } from './LanguageContext.tsx';

const { SubMenu } = Menu;

export default function SettingsMenu() {
  const { language, setLanguage } = useContext(LanguageContext);
  const clickZh = () => {
    setLanguage('zh');
    // console.log(language);
  }
  const clickEn = () => {
    setLanguage('en');
    // console.log(language);
  }

  const menu = (
    <Menu>
      <SubMenu
        className='setting-submenu-language'
        key="sub1"
        title={language === 'zh' ? '语言' : 'Language'}>
        <Menu.Item key="1" onClick={clickZh}>
          中文
        </Menu.Item>
        <Menu.Item key="2" onClick={clickEn}>
          English
        </Menu.Item>
      </SubMenu>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} className='settings'>
      <Button>
        {language === 'zh' ? '设置' : 'Settings'}
      </Button>
    </Dropdown>
  );
}