import React, { useState, useEffect, ReactNode } from 'react'
import { Modal, Button, Row, Col, Select, message } from 'antd'

import { addFriendOrGroup } from '../../services/api'
import './style.less'

type Props = {
    data: any,
    visible: boolean,
    user: any,
    closeModal: any,
    friendgroups?: any[],
    socket?: any
}

const hobby: string[] = ['爱好']
const job: string[] = ['公司', '职业']

const { Option } = Select

const InfoDetail = (props: Props) => {
    const [ nextStep, setNextStep ] = useState(false)
    const [ selectGroup, setGroup ] = useState(null)
    const { data, visible, user, closeModal, friendgroups, socket } = props

    useEffect(() => {
        if(friendgroups) {
            setGroup(Object.keys(friendgroups)[0])
        }
    }, [friendgroups])

    const detailItems = () => (
        <div className="detail-items">
            <Row>
                <Col span={4} className='detail-items-label' style={{ letterSpacing: 3 }}>id</Col>
                <Col span={19} offset={1} className='detail-items-value'>{ data.userid || data.groupid }</Col>
            </Row>
            <Row>
                <Col span={4} className='detail-items-label'>昵称</Col>
                <Col span={19} offset={1} className='detail-items-value'>{ data.username || data.name }</Col>
            </Row>
            {
                hobby.map(item => <Row key={item}>
                    <Col span={4} className='detail-items-label'>{item}</Col>
                    <Col span={19} offset={1} className='detail-items-value'></Col>
                </Row>)
            }
            <br/>
            {
                job.map(item => <Row key={item}>
                    <Col span={4} className='detail-items-label'>{item}</Col>
                    <Col span={19} offset={1} className='detail-items-value'></Col>
                </Row>)
            }
        </div>
    )

    const confirmGroup = ():ReactNode => (
        <div>
            <p>请为好友选择分组:</p>
            <Select onChange={value => setGroup(value)} style={{ width: 200, marginTop: 10 }} defaultValue={Object.keys(friendgroups)[0]}>
            {
                friendgroups && Object.keys(friendgroups).map((group:any) => <Option key={group} value={group}>{ group }</Option>)
            }
            </Select>
        </div>
    )

    const handleClick = ():void => {
        if(data.userid) {
            if(!nextStep) {
                setNextStep(true)
            } else {
                const params = {
                    type: 'addfriend',
                    from: user,
                    to: data.userid,
                    taskData : {
                        groupname: selectGroup
                    },
                    taskid: 1
                }
                addFriendOrGroup(params).then((res:any) => {
                    if(res.errcode === 0) {
                        message.success('请求已发出')
                        socket.emit('immediate task', res.data)
                    }
                    closeModal()
                })
            }
        } else {

        }
    }

    return (
        <Modal
            className='info-modal'
            footer={null}
            visible={visible}
            width={310}
            onCancel={closeModal}
            destroyOnClose={true}
        >
            {
                data && <div className='info-detail'>
                <div className="info-detail-header">
                    <div className='info-detail-avatar' style={{ backgroundImage: `url(${data.avatar})` }}></div>
                    <p className='info-detail-name'>{ data.username || data.name }</p>
                </div>
                <div className='info-detail-content'>
                    { nextStep ? confirmGroup() : detailItems() }
                </div>
                <div className="footer" style={{ justifyContent: data.userid && user.userid == data.userid ? 'flex-end' : 'space-between' }}>
                    <Button onClick={() => nextStep ? setNextStep(false) : closeModal()}>{ nextStep ? '上一步': '取消' }</Button>
                    {
                        !data.userid || (data.userid && user.userid !== data.userid) ? <Button type="primary" onClick={handleClick}>{ data.userid ? (nextStep ? '确定' : '加好友') : '加群' }</Button> : null
                    }
                </div>
            </div>
            }
        </Modal>
    )
}

export default InfoDetail