import React, { useState } from 'react'
import { Modal, Layout, Menu } from 'antd'

import FriNoc from './friends'

const { Sider, Content } = Layout
const { Item } = Menu

export interface Props {
    visible: boolean,
    tasks: object[],
    closeModal: any,
    getFriendList: any,
    socket: any,
    refreshTasks: any
}

const Notification = (props: Props) => {
    const [ route, setRoute ] = useState('friend-notice')
    const { visible, tasks, closeModal, getFriendList, socket, refreshTasks } = props

    const content = () => {
        switch(route) {
            case 'friend-notice':
                return (
                    <FriNoc tasks={tasks.filter((item: any) => item.taskid === 1)} getFriendList={getFriendList} socket={socket} refreshTasks={refreshTasks} />
                )
            case 'system-info':
                return (
                    <div>hhh</div>
                )
            default:
                return (
                    <div>hhhh</div>
                )
                break
        }
    }
    
    return (
        <Modal
            title='消息通知'
            visible={visible}
            width={1000}
            onCancel={closeModal}
            footer={null}
        >
            <Layout style={{ height: 500 }}>
                <Sider width={150} theme='light'>
                    <Menu defaultSelectedKeys={['friend-notice']} mode='inline' onClick={({ key }) => setRoute(key)}>
                        <Item key='friend-notice'>好友通知</Item>
                        <Item key='system-info'>系统消息</Item>
                    </Menu>
                </Sider>
                <Content style={{ backgroundColor: '#fff', paddingLeft: 30 }}>
                    { content() }
                </Content>
            </Layout>
        </Modal>
    )
}

export default Notification