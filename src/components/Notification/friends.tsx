import React, { useState } from 'react'
import { Button, message } from 'antd'
import { deciseAddOrNot } from '../../services/api'

import InfoDetail from '../InfoDetail'
import './style.less'

export interface Props {
    tasks: object[],
    getFriendList: any,
    socket: any,
    refreshTasks: any
}

const FriNoc = (props: Props) => {
    const [ select, setSelect ] = useState(null)
    const [ visible, setVisible ] = useState(false)
    const { tasks, getFriendList, socket, refreshTasks } = props

    const handleClick = (type, task): void => {
        const params = {
            type,
            task
        }
        deciseAddOrNot(params).then((res: any) => {
            if(res.errcode == 0) {
                if(type == 1) {
                    getFriendList()
                    socket.emit('refresh friendlist', task.from.userid)
                }
                console.log('task', type, task);
                refreshTasks(task._id)
                message.success(res.message)
            } else {
                message.error(res.message)
            }
        })
    }
    
    return (
        <div className='fri-noc'>
            {
                tasks.length > 0 ? tasks.map((task: any) => <div key={task._id} className='fri-task'>
                    <p><span onClick={() => {setSelect(task.from); setVisible(true)}}>{ task.from.username }</span>&nbsp;想要添加你为好友</p>
                    <Button type='primary' onClick={() => handleClick(1, task)}>同意</Button>
                    <Button type='primary' onClick={() => handleClick(0, task)}>拒绝</Button>
                </div>) : <div>暂无好友通知</div>
            }
            <InfoDetail data={select} user={select} visible={visible} closeModal={() => setVisible(false)} />
        </div>
    )
}

export default FriNoc