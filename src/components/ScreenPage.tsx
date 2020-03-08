import React, { CSSProperties } from 'react';
import ReactDOM from 'react-dom';
import { useBodyScrollLock } from '../utils/hooks';

import NavBar from './NavBar';

export default function ScreenPage({
  show,
  children,
  style
}: React.PropsWithChildren<{
  show: boolean;
  style?: CSSProperties;
}>) {
  useBodyScrollLock(show);

  return ReactDOM.createPortal(
    <div hidden={!show}>
      <div className="screen-page" {...{ style }}>
        <NavBar />
        {children}
      </div>
    </div>,
    document.body
  );
}
