import React from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { ProgressState, useAppState } from '../../AppState';
import FinishCircle from './FinishCircle';
import ScreenPage from '../ScreenPage';

import './index.scss';

export default function ResultPage() {
  const progress = useAppState((state) => state.progress);
  const turnToIdle = useAppState((state) => state.turnToIdle);
  const url = useAppState((state) => state.downloadableBlobUrl);

  const isNotIdle = progress !== ProgressState.Idle;
  const isSuccess = progress === ProgressState.Success;
  const isFailure = progress === ProgressState.Failure;

  return (
    <ScreenPage show={isNotIdle}>
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="result-success"
        >
          <FinishCircle />
          <h1>恭喜！你的精品日历已做好</h1>
          <div>
            <a href={url ?? '#'} download="ISCNU匠心营造.ics">
              <Button size="large" style={{ width: 256 }} shape="round">
                下载日历
              </Button>
            </a>
          </div>
          <button
            style={{ lineHeight: 4, color: 'white' }}
            onClick={(ev) => {
              ev.preventDefault();
              turnToIdle();
            }}
          >
            返回
          </button>
        </motion.div>
      )}
      {isFailure && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="result-fail"
        >
          <h1>Oops, 出现了故障</h1>
          <button
            onClick={() => {
              turnToIdle();
            }}
          >
            完成
          </button>
        </motion.div>
      )}
    </ScreenPage>
  );
}
