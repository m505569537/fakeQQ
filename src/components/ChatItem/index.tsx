import React from 'react'

import './style.less'

export interface Props {
    user: any,
    target: any,
    msg: any
}

const ChatItem = (props) => {
    const { user, target, msg } = props

    const userChat = () => (
        <div className='user-chat'>
            <div className="chat-container">
                <div className="chat-name">
                    { target.groupid ? user.username : '' }
                </div>
                <div className="chat-msg">
                    { msg.message }
                </div>
            </div>
            <div className="chat-avatar" style={{ backgroundImage: `url(${user.avatar})` }}></div>
        </div>
    )

    const targetChat = () => {
        let avatar, name
        if(target.userid) {
            avatar = target.avatar
        }
        return (
            <div className='target-chat'>
                <div className="chat-avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
                <div className="chat-container">
                    <div className="chat-name">
                    </div>
                    <div className="chat-msg">
                        { msg.message }
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className='chat-item'>
            {
                msg.userid == user.userid ? userChat() : targetChat()
            }
        </div>
    )
}

export default ChatItem