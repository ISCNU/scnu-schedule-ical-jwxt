import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { useAsync, useInViewport, useResponsive, useToggle } from '@umijs/hooks'
import {
	Affix,
	Button,
	Checkbox,
	Form,
	InputNumber,
	Layout,
	Menu,
	Select,
	Switch,
	Tooltip,
	Drawer,
	Result,
	Skeleton,
} from 'antd'
import copy from 'copy-to-clipboard'
import { motion } from 'framer-motion'
import React, {
	CSSProperties,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import ReactDOM from 'react-dom'
import SmoothScroll from 'smooth-scroll'
import { getAppState, ProgressState, useAppState } from './AppState'
import { IntroductionImageSources } from './fragments.assets'
import Styles from './fragments.module.css'
import { useBodyScrollLock } from './hooks'
import MarkdownParser, { ContentWithTocNodesSet } from './MarkdownParser'
import * as Rules from './rules'
import { FinishCircle } from './movieclips'

const { animateScroll } = new SmoothScroll()

const Section = React.forwardRef<
	HTMLElement,
	React.PropsWithChildren<{
		className?: string
		style?: CSSProperties
	}>
>(({ children, style, className }, ref) => {
	return (
		<section
			{...{ ref }}
			className={className ? `${Styles.Section} ${className}` : Styles.Section}
			{...{ children, style }}
		/>
	)
})

function IntroductionImage({ id }: { id: number }) {
	return (
		<img
			className={Styles.DisplayImage}
			alt="展示效果"
			src={IntroductionImageSources[id - 1]}
		/>
	)
}

enum MenuItemKey {
	Introduction,
	GettingStart,
	Help,
	AboutUs,
}

export function Navbar() {
	const biggerThanXs = useResponsive().sm
	const { state: collapsed, toggle: toggleCollapsed } = useToggle()
	const showingHelpDoc = useAppState(state => state.showingHelpDoc)
	const [watchingGettingStart] = useInViewport(
		useAppState(state => state.gettingStartElement)
	)

	const menuItems = useMemo(
		() => [
			<Menu.Item
				onClick={() => {
					const appState = getAppState()
					appState.turnToIdle()
					appState.hideHelpDoc()
					animateScroll(getAppState().introductionElement)
					toggleCollapsed(false)
				}}
				key={`${MenuItemKey.Introduction}`}
			>
				介绍
			</Menu.Item>,
			<Menu.Item
				key={`${MenuItemKey.GettingStart}`}
				onClick={() => {
					const appState = getAppState()
					appState.turnToIdle()
					appState.hideHelpDoc()
					animateScroll(appState.gettingStartElement)
					toggleCollapsed(false)
				}}
			>
				立即使用
			</Menu.Item>,
			<Menu.Item
				onClick={() => {
					const appState = getAppState()
					appState.showHelpDoc()
					appState.turnToIdle()
					toggleCollapsed(false)
				}}
				key={`${MenuItemKey.Help}`}
			>
				帮助文档
			</Menu.Item>,
			<Menu.Item key={`${MenuItemKey.AboutUs}`}>
				<a href="https://i.scnu.edu.cn/" target="_about">
					关于我们
				</a>
			</Menu.Item>,
		],
		[]
	)

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
								: `${MenuItemKey.Introduction}`,
						]}
					>
						{biggerThanXs ? (
							[
								<Menu.Item
									onClick={() => {
										window.open('https://i.scnu.edu.cn/about/')
									}}
									style={{ float: 'left' }}
								>
									<img src="logo.png" style={{ height: '1.75rem' }} />
								</Menu.Item>,
								...menuItems,
							]
						) : (
							<Menu.Item
								onClick={() => {
									toggleCollapsed()
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
					toggleCollapsed(false)
				}}
				style={{ padding: 0 }}
			>
				<Menu mode="vertical" style={{ marginTop: 64, border: 0 }}>
					{menuItems}
				</Menu>
			</Drawer>
		</>
	)
}

export function Introduction() {
	return (
		<div ref={_ => getAppState().setIntroductionElement(_)}>
			<Section style={{ padding: '3rem' }}>
				<h1>绿色、简洁的校园日历</h1>
				<p>
					无需下载第三方APP、无流氓推广、没有多余的社交功能、耗电量极低，没有任何副作用
				</p>
				<IntroductionImage id={1} />
			</Section>
			<Section style={{ background: '#09f', color: 'white', padding: '3rem' }}>
				<h1 style={{ color: 'white' }}>跨平台的云课表</h1>
				<p>手机与电脑云端同步。随时随地在手机上查看我的课程！</p>
				<div>
					<IntroductionImage id={3} />
					<IntroductionImage id={2} />
				</div>
			</Section>
			<Section style={{ padding: '3rem' }}>
				<h1>还有……</h1>
				<p>
					{/* cspell:words Siri Cortana */}
					将课表导入日历以后，Siri, Cortana
					这些智能助理也能派上用场啦！更多惊喜，待您发现
					<span role="img" aria-label="开心">
						😋
					</span>
				</p>
				<div>
					<IntroductionImage id={7} />
					<IntroductionImage id={6} />
				</div>
			</Section>
			<div style={{ height: '8rem', paddingTop: '2rem', textAlign: 'center' }}>
				<h1>开始尝试 ↓</h1>
			</div>
		</div>
	)
}

const scratchScript =
	// eslint-disable-next-line
	'javascript:' +
	Rules.scratchScript.replace(/^[\s\t]+/g, '').replace(/\n?\r?/g, '')

const { Content } = Layout

function CodeCopier({ onCopy }: { onCopy?: () => void }) {
	const code = scratchScript
	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	return (
		<Content>
			<div>
				<textarea
					ref={textAreaRef}
					style={{ resize: 'none', color: 'black' }}
					rows={3}
					value={code}
					onClick={() => {
						textAreaRef.current?.select()
						onCopy?.()
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
						copy(code)
						onCopy?.()
					}}
				>
					复制
				</Button>
			</Tooltip>
		</Content>
	)
}

function ChildWindowOpener() {
	const hasWindow = Boolean(useAppState(state => state.window))
	const openChildWindow = useAppState(state => state.openChildWindow)

	return hasWindow ? null : (
		<div>
			<Button
				onClick={() => {
					openChildWindow(Rules.jwxtUrl)
				}}
			>
				打开教务处官网
			</Button>
		</div>
	)
}

export function TroubleOnGettingStart() {
	return (
		<details style={{ paddingTop: '1rem' }}>
			<summary>遇到问题吗？</summary>
			已知在某些浏览器可能会把前缀
			<code>javascript:</code>
			去掉，请补上后粘贴
			<br />
			一些出于安全考虑，禁用 javascript url 的浏览器也无法使用
			{/* TODO */}
		</details>
	)
}

const { Option } = Select

export function GettingStart() {
	const closeWindow = useAppState(state => state.closeChildWindow)
	const [selectedCampus, setCampus] = useState<Rules.Campus | undefined>()
	const [enableAlarm, setAlarm] = useState(false)
	const [minutes, setMinutes] = useState(30)
	const [copied, setCopied] = useState(false)
	const [showTeacherName, setTeacherName] = useState(false)

	useEffect(() => {
		if (selectedCampus)
			getAppState().setGenerateOptions({
				alarm: enableAlarm ? minutes : 0,
				teacherInTitle: showTeacherName,
				campus: selectedCampus,
			})
	}, [selectedCampus, enableAlarm, minutes, showTeacherName])

	return (
		<Section
			className={Styles.GettingStart}
			style={{ background: '#333', color: 'white', paddingTop: '3rem' }}
			ref={_ => getAppState().setGettingStartElement(_)}
		>
			<Form
				style={{ textAlign: 'center' }}
				labelCol={{ offset: 6, span: 4 }}
				wrapperCol={{ offset: 1, span: 6 }}
			>
				<Form.Item
					label={
						<Checkbox
							checked={enableAlarm}
							onChange={event => {
								setAlarm(event.target.checked)
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
						onChange={_ => {
							setMinutes(_ ?? 30)
						}}
						disabled={!enableAlarm}
						formatter={value => `${value} 分钟`}
					/>
				</Form.Item>
				<Form.Item label="在课名后面备注教师名字">
					<Switch
						style={showTeacherName ? {} : { boxShadow: '#888 0px 0px 2px 1px' }}
						checked={showTeacherName}
						onChange={_ => {
							setTeacherName(_)
						}}
					></Switch>
				</Form.Item>
				<Form.Item label="你的校区：">
					<Select
						value={selectedCampus}
						style={{ width: '100%' }}
						onChange={_ => {
							setCampus(_)
						}}
					>
						<Option value={Rules.Campus.Shipai}>石牌</Option>
						<Option value={Rules.Campus.Daxuecheng}>大学城</Option>
						<Option value={Rules.Campus.Nanhai}>南海</Option>
					</Select>
				</Form.Item>
			</Form>
			{useAppState(state => state.generateOptions) && (
				<>
					复制如下代码
					<CodeCopier
						onCopy={() => {
							setCopied(true)
						}}
					/>
					<br />
					<div hidden={!copied}>
						打开教务信息网，登陆后，在地址栏内输入这串代码
						<br />
						（建议使用电脑版的 Chrome 浏览器/老板 Firefox 完成操作）
						<ChildWindowOpener />
					</div>
					<TroubleOnGettingStart />
					<div>
						<Button
							onClick={() => {
								closeWindow()
							}}
						>
							重试
						</Button>
					</div>
					<br />
					我们承诺不会收集教务网其他非课程相关的数据，您教务网的所有其他数据也不会被后台服务器采集。
					<div style={{ height: '3rem' }} />
				</>
			)}
		</Section>
	)
}

export function ScreenPage({
	show,
	children,
	style,
}: React.PropsWithChildren<{
	show: boolean
	style?: CSSProperties
}>) {
	useBodyScrollLock(show)

	return ReactDOM.createPortal(
		<div hidden={!show}>
			<div className={Styles.ScreenPage} {...{ style }}>
				<Navbar></Navbar>
				{children}
			</div>
		</div>,
		document.body
	)
}

export function HelpDoc() {
	const [content, setContent] = useState<ContentWithTocNodesSet | undefined>()
	const [error, setError] = useState('')
	const show = useAppState(state => state.showingHelpDoc)

	useAsync(async () => {
		if (show && !content) {
			try {
				setContent(
					MarkdownParser.convert(await (await fetch(Rules.documentPath)).text())
				)
			} catch (error) {
				setError(`${error}`)
			}
		}
	}, [show, content])

	return (
		<ScreenPage {...{ show }}>
			{error ? (
				<Result
					status="error"
					title="发生错误"
					subTitle="你可以把这个问题反馈给我们。"
				>
					{error}
				</Result>
			) : !content ? (
				<Skeleton />
			) : (
				<div className={Styles.HelpDocContainer}>
					<nav style={{ overflowY: 'auto', flex: '0 256px' }}>
						<h1>目录</h1>
						{content.toc}
					</nav>
					<article className={Styles.Article} children={content.body} />
				</div>
			)}
		</ScreenPage>
	)
}

export function ResultPage() {
	const progress = useAppState(state => state.progress)
	const turnToIdle = useAppState(state => state.turnToIdle)
	const url = useAppState(state => state.downloadableBlobUrl)

	const isNotIdle = progress !== ProgressState.Idle
	const isSuccess = progress === ProgressState.Success
	const isFailure = progress === ProgressState.Failure

	return (
		<ScreenPage show={isNotIdle}>
			{isSuccess && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
					className={Styles.Success}
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
					<a
						style={{ lineHeight: 4, color: 'white' }}
						onClick={() => {
							turnToIdle()
						}}
					>
						返回
					</a>
				</motion.div>
			)}
			{isFailure && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
					className={Styles.Failure}
				>
					<h1>Oops, 出现了故障</h1>
					<button
						onClick={() => {
							turnToIdle()
						}}
					>
						完成
					</button>
				</motion.div>
			)}
		</ScreenPage>
	)
}

export function Footer() {
	return (
		<footer style={{ textAlign: 'center', lineHeight: 2, margin: '2rem 0' }}>
			Copyright © 2008-2018
			<a href="https://i.scnu.edu.cn/about/" target="_about">
				ISCNU
			</a>
			. All rights Reserved.
			<br />
			华南师范大学网络协会 版权所有
		</footer>
	)
}
