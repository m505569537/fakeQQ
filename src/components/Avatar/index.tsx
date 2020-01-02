import React from 'react'

import './style.less'

export interface Props {
    url: string,
    title?: string,
    size?: string,
    username?: string,
    id?: number,
    style?: any,
    onClick?: any
}

const Avatar = (props: Props) => {
    const { url, title, size, username, id, style, onClick } = props
    return (
        <div className='avatar' style={style} onClick={onClick}>
            <div className='avatar-img' style={{ backgroundImage: `url(${url || ''})`, width: size || 44, height: size || 44  }} />
            {
                username ? <p className='username'>{ username }</p> : null
            }
            {
                id ? <p className='id'>ID: {id}</p> : null
            }
        </div>
    )
}

export default Avatar