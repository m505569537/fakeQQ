import React, { ReactNode, useState } from 'react'
import { Modal } from 'antd'

import './style.less'

type Props = {
    list: any[],
    showModal?: boolean
}

const Gallary = (props: Props) => {
    const [ visible, setVisible ] = useState(false)
    const [ img, setImg ] = useState('')
    const { list, showModal } = props
    return (
        <div className='gallary'>
            {
                list.map(item => <a key={item.imgUrl || item} href={ item.link || '#'} target="_blank" onClick={showModal ? () => { setImg(item.imgUrl || item); setVisible(true)} : null}><img height='100%' src={item.imgUrl || item} /></a>)
            }
            <Modal
                title='图片'
                visible={visible}
                width={600}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
            >
                <img width='500px' src={img} />
            </Modal>
        </div>
    )
}

export default Gallary