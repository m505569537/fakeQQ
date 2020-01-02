import React, { useEffect } from 'react';

import ChatItem from '../ChatItem'
import './style.less';

export interface Props {
    user: {
        userid: string,
        username: string,
        avatar: string
    },
    target: any,
    messages: object[]
}

const ChatPanel = (props: Props) => {
    const { user, target, messages } = props
    let divRef
    useEffect(() => {
        divRef.scrollTop = divRef.scrollHeight
    }, [messages])
    
    return (
        <div className="chat-panel" ref={div => divRef = div}>
            {
                messages.map((msg: any) => <ChatItem user={user} target={target} msg={msg} />)
            }
        </div>
    )
}

export default ChatPanel;