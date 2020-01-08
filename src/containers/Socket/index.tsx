import React, { useEffect, useState, ReactNode } from 'react'
import { Input, Button, Layout, Menu, Tabs, Badge } from 'antd'
import Cookie from 'js-cookie'
import io from 'socket.io-client'

import InfoDetail from '../../components/InfoDetail'
import Notification from '../../components/Notification'
import ChatInput from '../../components/ChatInput'
import ChatPanel from '../../components/ChatPanel'
import LoginRegister from './LoginRegister'
import AddFriendModal from './AddFriendModal'
import { getFriendsList, getGroupsList, getUserInfo, getMessages } from '../../services/api'

import './style.less'

const { Sider, Content, Header } = Layout
const { SubMenu, Item } = Menu
const { TabPane } = Tabs
let curRoom = ''
let socket

const Socket = ():ReactNode => {
    const [ value, setValue ] = useState('')
    const [ friends, setFriends ] = useState(null)
    const [ groups, setGroups ] = useState(null)
    const [ visible, setVisible ] = useState(false)
    const [ infoVisible, setInfoVisible ] = useState(false)
    const [ type, setType ] = useState('')
    const [ isLogin, setIsLogin ] = useState(false)
    const [ user, setUser ] = useState(null)
    const [ target, setTarget ] = useState(null)
    const [ messages, setMessages ] = useState([])
    const [ tasks, setTasks ] = useState([])
    const [ unRead, setUnRead ] = useState(null)
    const [ nocVisible, setNocVisible ] = useState(false)
    
    useEffect(() => {
        socket = io('http://localhost:4000')
        const token = Cookie.get('token')
        if(!token){
            setIsLogin(true)
        } else {
            if(!user) {
                const fn = async () => {
                    const result:any = await getUserInfo({ token })
                    if(result.errcode === 0) {
                        setUser(result.data)
                    } else {
                        setIsLogin(true)
                    }
                }
                fn()
            }
            // io.Socket.on('chat message', function (msg) {
            //     console.log('msg', msg);
            // })
            if(user){
                handleFriendsList()
                handleGroupsList()
                socket.emit('getTasks', { userid: user.userid })
                socket.on('refresh', function () {
                    handleFriendsList()
                })
            }
        }
    }, [user])

    useEffect(() => {
        socket.on('msg', function(msg) {
            setMessages([].concat(messages,msg))
        })
    }, [messages])

    useEffect(() => {
        socket.on('tasks', function (data) {
            setTasks(tasks.concat(data))
        })
    }, [user, tasks])

    useEffect(() => {
        socket.on('unread', function ({ from }) {
            let tmp = {...unRead}
            if(!tmp[from]) {
                tmp[from] = 1
            } else {
                tmp[from] = tmp[from] + 1
            }
            setUnRead(tmp)
        })
    }, [user, unRead])

    const handleFriendsList = ():void => {
        getFriendsList({ userid: user.userid }).then((res:any) => {
            if(res.errcode === 0) {
                setFriends(res.data)
            }
        })
    }
    const handleGroupsList = ():void => {
        getGroupsList({ userid: user.userid }).then((res: any) => {
            if(res.errcode === 0) {
                setGroups(res.data)
            }
        })
    }
    const getMsg = (target:any) => {
        let chatid:string
        if(target.userid){
            chatid = user.userid > target.userid ? (user.userid + '_' + target.userid) : (target.userid + '_' + user.userid)
        } else {
            chatid = target.groupid.toString()
        }
        if(curRoom){
            socket.emit('leaveroom', { chatid: curRoom, userid: user.userid })
        }
        socket.emit('linkroom', { chatid, userid: user.userid })
        curRoom = chatid
        getMessages({ chatid }).then((res: any) => {
            if(res.errcode === 0) {
                setMessages(res.data.messages)
            } else {
                setMessages([])
            }
        })
    }
    const handleMenu = ({ key, keyPath }, type: string): void => {
        if(type == 'user') {
            const friend = friends[keyPath[1]].filter(item => item.userid == key)[0]
            setTarget(friend)
            getMsg(friend)
            let tmp = { ...unRead }
            delete tmp[friend.userid]
            setUnRead(tmp)
        } else {
            const group = groups.filter(item => item._id === key)[0]
            setTarget(group)
            getMsg(group)
        }
    }
    return (
        <Layout style={{ padding: '50px 200px', height: 800 }}>
            <Header style={{ backgroundColor: 'rgba(0,0,0,.1)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div className='user-container'>
                    <div className='user-avatar' style={{ backgroundImage: `url(${user ? user.avatar : ''})` }}></div>
                    {
                        tasks && tasks.length > 0 ? <div className='task-status-dot' /> : null
                    }
                    <div className="triangle"></div>
                    <div className='user-content'>
                        <p onClick={() => setInfoVisible(true)}>个人信息</p>
                        <p onClick={() => setNocVisible(true)}>消息通知</p>
                    </div>
                </div>
            </Header>
            <Layout style={{ backgroundColor: '#fff' }}>
                <Sider width={200} style={{ backgroundColor: '#fff', padding: '10px', borderRight: '1px solid #e9e9e9', boxShadow: '0 0 10px 1px #e9e9e9' }}>
                    <Button icon="plus" type="dashed" block onClick={() => { setType('addfriend'); setVisible(true) }}>添加好友/群</Button>
                    <Button icon="plus" type="dashed" block onClick={() => { setType('build'); setVisible(true) }} style={{ margin: '10px 0' }}>新建群</Button>
                    <Tabs defaultActiveKey='friend' style={{ textAlign: 'center' }}>
                        <TabPane tab='好友' key='friend'>
                            {
                                friends && Object.keys(friends).length > 0 && <Menu mode='inline' style={{ textAlign: 'left' }} onClick={(e) => handleMenu(e,'user')}>
                                    {
                                        Object.keys(friends).map(item => <SubMenu key={item} title={item}>
                                            {
                                                friends[item].map(friend => <Item key={friend.userid} style={{ display:'flex', alignItems: 'center', justifyContent: 'space-between' }}>{friend.username}<Badge count={ unRead && unRead[friend.userid] } style={{ backgroundColor: '#ff6e00' }} /></Item>)
                                            }
                                        </SubMenu>)
                                    }
                                </Menu>
                            }
                        </TabPane>
                        <TabPane tab='群' key='group'>
                        {
                            groups && <Menu mode="inline" style={{ textAlign: 'left' }} onClick={e => handleMenu(e, 'group')}>
                                {
                                    groups.map(item => <Item key={item._id} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name}</Item>)
                                }
                            </Menu>
                        }
                        </TabPane>
                    </Tabs>
                </Sider>
                {
                    target && <Layout>
                        <Header style={{ backgroundColor: 'white', height: '50px', lineHeight: '50px', padding: '0 30px', borderBottom: '1px solid #e9e9e9', zIndex: 2, boxShadow: '0 1px 5px 1px #f2f2f2', fontSize: 22 }}>{ target.username || target.name }</Header>
                        <Content style={{ backgroundColor: 'white',  height: 550, display:'flex', flexDirection: 'column'}}>
                            <ChatPanel user={user} target={target} messages={messages} />
                            <ChatInput user={user.userid} friend={target.userid || undefined} group={target.groupid || ''} setMsg={(data: object[]) => setMessages(data)} socket={socket} />
                        </Content>
                    </Layout>
                }
            </Layout>
            <Notification visible={nocVisible} tasks={tasks} closeModal={() => setNocVisible(false)} getFriendList={handleFriendsList} socket={socket} refreshTasks={(_id) => setTasks(tasks.filter(item => item._id !== _id))} />
            <InfoDetail data={user} user={user} visible={infoVisible} closeModal={() => setInfoVisible(false)} />
            <LoginRegister visible={isLogin} closeModal={() => setIsLogin(false)} getUser={(user: object) => setUser(user)} />
            <AddFriendModal type={type} visible={visible} user={user} closeModal={() => setVisible(false)} getGroupsList={handleGroupsList} friendgroups={friends} socket={socket} />
        </Layout>
    )
}

export default Socket