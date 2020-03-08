import { useEventListener, useKeyPress } from '@umijs/hooks';
import React, { useEffect, useState } from 'react';
import { getAppState, useAppState } from './AppState';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HelpDoc from './components/HelpDoc';
import Introduction from './components/Introduction';
import GettingStart from './components/GettingStart';
import ResultPage from './components/ResultPage';

import generator, { CourseDataTransformer } from './utils/generator';
import * as Rules from './utils/rules';

import 'antd/dist/antd.css';
import './App.css';

function Debugger() {
  const [visible, setVisible] = useState(false);

  useKeyPress('`', () => {
    setVisible(true);
  });

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2 }} hidden={!visible}>
      <button
        onClick={() => {
          getAppState().turnToFailure();
        }}
      >
        失败模拟
      </button>
      <button
        onClick={() => {
          getAppState().turnToSuccess(null!);
        }}
      >
        成功模拟
      </button>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = Rules.title;
  }, []);

  const setFailure = useAppState((state) => state.turnToFailure);

  useEventListener('message', ({ data, origin }: MessageEvent) => {
    if (origin === Rules.jwxtOrigin) {
      const appState = getAppState();
      appState.closeChildWindow();
      try {
        const { generateOptions } = getAppState();
        if (generateOptions) {
          const calendar = generator((data as any[]).map(CourseDataTransformer), generateOptions);
          appState.turnToSuccess(calendar);
        } else {
          throw new Error('错误');
        }
      } catch (error) {
        setFailure({ code: error.toString() });
      }
    }
  });

  return (
    <>
      <Debugger />
      <NavBar />
      <Introduction />
      <GettingStart />
      <HelpDoc />
      <ResultPage />
      <Footer />
    </>
  );
}

export default App;
