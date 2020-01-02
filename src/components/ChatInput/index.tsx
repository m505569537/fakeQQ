import React, { useState } from 'react';
import { Input, message } from 'antd';
import { sendMessage } from '../../services/api'

import './style.less';

const { TextArea } = Input

export interface Props {
    user: number,
    friend?: number,
    group?: string,
    setMsg: any,
    socket: any
}

const ChatInput = (props: Props) => {
    const [ value, setValue ] = useState('')
    const { user, friend, group, setMsg, socket } = props
    const sendMsg = (e):void => {
        e.preventDefault()
        if(e.target.value == '') {
            return
        }
        let chatid: string
        if(group){
            chatid = group
        } else {
            if(user > friend){
                chatid = user + '_' + friend
            } else {
                chatid = friend + '_' + user
            }
        }
        const params = {
            chatid,
            to: friend,
            msg: {
                userid: user,
                message: e.target.value
            }
        }
        socket.emit('sendmsg', params)
        
        sendMessage(params).then((res: any) => {
            if(res.errcode === 0) {
                setMsg(res.data.messages)
                setValue('')
            } else {
                message.error(res.message)
            }
        })
    }
    
    return (
        <div className='chat-input'>
            <div className='operations'>👴服辣</div>
            <TextArea autoSize={{ minRows: 5, maxRows: 5 }} value={value} onChange={e => setValue(e.target.value)} onPressEnter={sendMsg} />
        </div>
    )
}

export default ChatInput;