import React, { useRef } from 'react';
import copy from 'copy-to-clipboard';
import { Layout, Tooltip, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import * as Rules from '../../utils/rules';

const scratchScript =
  // eslint-disable-next-line
  'javascript:' + Rules.scratchScript.replace(/^[\s\t]+/g, '').replace(/\n?\r?/g, '');

const { Content } = Layout;

export default function CodeCopier({ onCopy }: { onCopy?: () => void }) {
  const code = scratchScript;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Content>
      <div>
        <textarea
          ref={textAreaRef}
          style={{
            resize: 'none',
            color: 'black',
            border: '2px solid gray',
            borderRadius: '8px',
            padding: '4px 16px',
            width: '40%',
            margin: '1rem 0'
          }}
          rows={3}
          value={code}
          onClick={() => {
            textAreaRef.current!.select();
            onCopy!();
          }}
          readOnly
        />
      </div>
      <Tooltip title="已复制" trigger="click">
        <Button
          type="primary"
          shape="round"
          icon={<FontAwesomeIcon icon={faCopy} />}
          onClick={() => {
            copy(code);
            onCopy!();
          }}
        >
          复制
        </Button>
      </Tooltip>
    </Content>
  );
}
