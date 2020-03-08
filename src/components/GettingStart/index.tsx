import React, { CSSProperties, useState, useEffect } from 'react';
import classnames from 'classnames';
import { getAppState, useAppState } from '../../AppState';
import { useResponsive } from '@umijs/hooks';

import { Button, Checkbox, Form, InputNumber, Select, Switch, Collapse } from 'antd';
import CodeCopier from './CodeCopier';

import * as Rules from '../../utils/rules';

const Section = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<{
    className?: string;
    style?: CSSProperties;
  }>
>(({ children, style, className }, ref) => {
  return (
    <section
      {...{ ref }}
      className={classnames('intro-section', className)}
      {...{ children, style }}
    />
  );
});

export default function GettingStart() {
  const closeWindow = useAppState((state) => state.closeChildWindow);
  const [selectedCampus, setCampus] = useState<Rules.Campus | undefined>();
  const [enableAlarm, setAlarm] = useState(true);
  const [minutes, setMinutes] = useState(30);
  const [copied, setCopied] = useState(false);
  const [showTeacherName, setTeacherName] = useState(false);

  useEffect(() => {
    if (selectedCampus)
      getAppState().setGenerateOptions({
        alarm: enableAlarm ? minutes : 0,
        teacherInTitle: showTeacherName,
        campus: selectedCampus
      });
  }, [selectedCampus, enableAlarm, minutes, showTeacherName]);

  const isXs = !useResponsive().sm;

  return (
    <Section
      className="getting-start"
      style={{ background: '#333', color: 'white', paddingTop: '3rem' }}
      ref={(_) => getAppState().setGettingStartElement(_)}
    >
      <Form
        className={classnames({
          'getting-start-form-mobile': isXs
        })}
        labelCol={{ sm: { offset: 5, span: 5 }, xs: 24 }}
        wrapperCol={{ sm: { offset: 1, span: 6 }, xs: 24 }}
      >
        <Form.Item
          label={
            <Checkbox
              checked={enableAlarm}
              onChange={(event) => {
                setAlarm(event.target.checked);
              }}
            >
              提前提醒我
            </Checkbox>
          }
        >
          <InputNumber
            step={5}
            min={5}
            max={60}
            value={minutes}
            onChange={(_) => {
              setMinutes(_ ?? 30);
            }}
            disabled={!enableAlarm}
            formatter={(value) => `${value} 分钟`}
            style={isXs ? { width: '50%' } : {}}
          />
        </Form.Item>
        <Form.Item label="在课名后面备注教师名字">
          <Switch
            style={showTeacherName ? {} : { boxShadow: '#888 0px 0px 2px 1px' }}
            checked={showTeacherName}
            onChange={(_) => {
              setTeacherName(_);
            }}
          />
        </Form.Item>
        <Form.Item label="你的校区：">
          <Select
            value={selectedCampus}
            style={{ width: isXs ? '50%' : '100%' }}
            onChange={(_) => {
              setCampus(_);
            }}
          >
            <Select.Option value={Rules.Campus.Shipai}>石牌</Select.Option>
            <Select.Option value={Rules.Campus.Daxuecheng}>大学城</Select.Option>
            <Select.Option value={Rules.Campus.Nanhai}>南海</Select.Option>
          </Select>
        </Form.Item>
      </Form>
      {useAppState((state) => state.generateOptions) && (
        <>
          <p style={{ paddingTop: '1rem' }}>复制如下代码</p>
          <CodeCopier
            onCopy={() => {
              setCopied(true);
            }}
          />
          <br />
          <div hidden={!copied}>
            打开教务信息网，登陆后，在地址栏内输入这串代码
            <br />
            （建议使用电脑版的 Chrome 浏览器完成操作）
            <br />
            <ChildWindowOpener />
          </div>
          <TroubleOnGettingStart />
          <div>
            <Button
              onClick={() => {
                closeWindow();
              }}
              size="large"
              shape="round"
            >
              重试
            </Button>
          </div>
          <br />
          <p style={{ padding: '0 2rem' }}>
            我们承诺不会收集教务网其他非课程相关的数据，您教务网的所有数据也不会被后台服务器采集，请放心使用。
          </p>
          <div style={{ height: '3rem' }} />
        </>
      )}
    </Section>
  );
}

function ChildWindowOpener() {
  const hasWindow = Boolean(useAppState((state) => state.window));
  const openChildWindow = useAppState((state) => state.openChildWindow);

  return hasWindow ? null : (
    <div>
      <Button
        onClick={() => {
          openChildWindow(Rules.jwxtUrl);
        }}
      >
        打开教务处官网
      </Button>
    </div>
  );
}

const { Panel } = Collapse;

function TroubleOnGettingStart() {
  const biggerThanXs = useResponsive().sm;

  return (
    <Collapse
      bordered={false}
      style={{
        margin: biggerThanXs ? '1rem auto' : '1rem 2rem',
        maxWidth: 512
      }}
    >
      <Panel header="遇到问题吗？" key="1">
        已知在某些浏览器可能会把前缀
        <code>javascript:</code>
        去掉，请补上后粘贴
        <br />
        出于安全考虑，禁用 javascript url 的一些浏览器也无法使用
        <br />
        多数手机浏览器和新版 FireFox 有这个问题，换一台设备或一个浏览器就行了。
      </Panel>
    </Collapse>
  );
}
