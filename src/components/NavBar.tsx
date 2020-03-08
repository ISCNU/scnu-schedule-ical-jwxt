import React, { useMemo } from 'react';
import { useInViewport, useResponsive, useToggle } from '@umijs/hooks';
import SmoothScroll from 'smooth-scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { Affix, Menu, Drawer } from 'antd';

import { getAppState, useAppState } from '../AppState';
const { animateScroll } = new SmoothScroll();

enum MenuItemKey {
  Introduction,
  GettingStart,
  Help,
  AboutUs
}

export default function NavBar() {
  const biggerThanXs = useResponsive().sm;
  const { state: collapsed, toggle: toggleCollapsed } = useToggle();
  const showingHelpDoc = useAppState((state) => state.showingHelpDoc);
  const [watchingGettingStart] = useInViewport(useAppState((state) => state.gettingStartElement));

  const menuItems = useMemo(
    () => [
      <Menu.Item
        onClick={() => {
          const appState = getAppState();
          appState.turnToIdle();
          appState.hideHelpDoc();
          animateScroll(getAppState().introductionElement);
          toggleCollapsed(false);
        }}
        key={`${MenuItemKey.Introduction}`}
      >
        介绍
      </Menu.Item>,
      <Menu.Item
        key={`${MenuItemKey.GettingStart}`}
        onClick={() => {
          const appState = getAppState();
          appState.turnToIdle();
          appState.hideHelpDoc();
          animateScroll(appState.gettingStartElement);
          toggleCollapsed(false);
        }}
      >
        立即使用
      </Menu.Item>,
      <Menu.Item
        onClick={() => {
          const appState = getAppState();
          appState.showHelpDoc();
          appState.turnToIdle();
          toggleCollapsed(false);
        }}
        key={`${MenuItemKey.Help}`}
      >
        帮助文档
      </Menu.Item>,
      <Menu.Item key={`${MenuItemKey.AboutUs}`}>
        <a href="https://i.scnu.edu.cn/" target="_about">
          关于我们
        </a>
      </Menu.Item>
    ],
    []
  );

  return (
    <>
      <Affix>
        <header>
          <Menu
            mode="horizontal"
            style={{ textAlign: 'right', padding: '0 2rem' }}
            selectedKeys={[
              showingHelpDoc
                ? `${MenuItemKey.Help}`
                : watchingGettingStart
                ? `${MenuItemKey.GettingStart}`
                : `${MenuItemKey.Introduction}`
            ]}
          >
            {biggerThanXs ? (
              [
                <Menu.Item
                  key={-1}
                  onClick={() => {
                    window.open('https://i.scnu.edu.cn/about/');
                  }}
                  style={{ float: 'left' }}
                >
                  <img src="logo.png" style={{ height: '1.75rem' }} />
                </Menu.Item>,
                ...menuItems
              ]
            ) : (
              <Menu.Item
                onClick={() => {
                  toggleCollapsed();
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </Menu.Item>
            )}
          </Menu>
        </header>
      </Affix>
      <Drawer
        visible={!biggerThanXs && collapsed}
        onClose={() => {
          toggleCollapsed(false);
        }}
        style={{ padding: 0 }}
      >
        <Menu mode="vertical" style={{ marginTop: 64, border: 0 }}>
          {menuItems}
        </Menu>
      </Drawer>
    </>
  );
}
