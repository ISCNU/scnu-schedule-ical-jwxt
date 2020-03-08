import React, { useState } from 'react';
import MarkdownParser, { ContentWithTocNodesSet } from './MarkdownParser';
import { Result, Skeleton } from 'antd';
import { useResponsive, useAsync } from '@umijs/hooks';
import { useAppState } from '../../AppState';

import ScreenPage from '../ScreenPage';

import * as Rules from '../../utils/rules';
import './index.scss';

export default function HelpDoc() {
  const [content, setContent] = useState<ContentWithTocNodesSet | undefined>();
  const [error, setError] = useState('');
  const show = useAppState((state) => state.showingHelpDoc);
  const smallerThanMd = !useResponsive().md;

  useAsync(async () => {
    if (show && !content) {
      try {
        setContent(MarkdownParser.convert(await (await fetch(Rules.documentPath)).text()));
      } catch (error) {
        setError(`${error}`);
      }
    }
  }, [show, content]);

  return (
    <ScreenPage {...{ show }}>
      {error ? (
        <Result status="error" title="发生错误" subTitle="你可以把这个问题反馈给我们。">
          {error}
        </Result>
      ) : !content ? (
        <Skeleton />
      ) : smallerThanMd ? (
        <div style={{ overflowY: 'auto', padding: '2rem' }}>
          <nav>
            <h1>目录</h1>
            {content.toc}
          </nav>
          <article className="doc-article" style={{ paddingTop: '1rem' }}>
            {content.body}
          </article>
        </div>
      ) : (
        <div className="doc-container" style={{ overflowY: 'hidden' }}>
          <nav style={{ overflowY: 'auto' }}>
            <h1>目录</h1>
            {content.toc}
          </nav>
          <article
            className="doc-article"
            style={{ overflowY: 'auto', flexGrow: 1, padding: '1rem 2rem 0' }}
          >
            {content.body}
          </article>
        </div>
      )}
    </ScreenPage>
  );
}
