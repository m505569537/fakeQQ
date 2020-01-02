import React, { useState, useEffect } from 'react'
import { Modal, message, Form, Input, Radio, Row, Col } from 'antd'

import ImageSelect from '../../components/ImageSelect'
import Avatar from '../../components/Avatar'
import InfoDetail from '../../components/InfoDetail'
import { buildGroup, getFriendOrGroup } from '../../services/api'
import './style.less'

export interface Props {
    type: string,
    visible: boolean,
    closeModal: any,
    getGroupsList: any,
    user: any,
    friendgroups?: object[],
    socket: any
}

const { Search } = Input
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10, offset: 2 }
}

const AddFriendModal = (props: Props) => {
    const [ radio, setRadio ] = useState('')
    const [ buildname, setBuildname ] = useState('')
    const [ avatar, setAvatar ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    const [ kw, setKw ] = useState('')
    const [ selected, setSelected ] = useState(null)
    const [ showDetail, setShowDetail ] = useState(false)
    const [ list, setList ] = useState([])  // 搜索得到的好友或群列表
    const { type, visible, closeModal, getGroupsList, user, friendgroups, socket } = props

    useEffect(() => {
        setRadio(props.type)
    }, [props.type])

    const handleSearch = (kw) => {
        if(kw.trim() == '') {
            return;
        }
        const params = {
            kw,
            type: radio
        }
        // setLoading(true)
        getFriendOrGroup(params).then((res: any) => {
            if(res.errcode === 0) {
                setList(res.data)
            } else {
                message.error(res.message)
            }
            // setLoading(false)
        })
    }

    const handleChange = (e) => {
        setKw(e.target.value)
    }

    const handleRadio = (e) => {
        setRadio(e.target.value)
        setKw('')
        setList([])
    }

    const handleClick = (obj) => {
        setSelected(obj)
        setShowDetail(true)
    }

    const add = () => (
        <div className='addfriends'>
            <Row>
                <Col span={16}><Search loading={loading} onChange={handleChange} value={kw} onSearch={kw => handleSearch(kw)} placeholder={radio === 'addfriend' ? '请输入好友昵称/id' : '请输入群名称/id'} /></Col>
                <Col span={7} offset={1}>
                    <RadioGroup onChange={handleRadio} value={radio}>
                        <RadioButton value='addfriend'>添加好友</RadioButton>
                        <RadioButton value='addgroup'>添加群</RadioButton>
                    </RadioGroup>
                </Col>
            </Row>
            <div className='searchresult'>
                {
                    list.map(item => <Avatar onClick={() => handleClick(item)} key={item.userid} url={item.avatar} style={{ width: '45%', float: 'left' }} username={item.username || item.name} />)
                }
            </div>
        </div>
    )

    const build = () => (
        <Form {...formLayout}>
            <FormItem label="群昵称"><Input placeholder='请输入群昵称' onChange={e => setBuildname(e.target.value)} /></FormItem>
            <FormItem label="群头像"><ImageSelect getImg={(img) => setAvatar(img)} /></FormItem>
        </Form>
    )

    const handleCancel = () => {
        closeModal()
    }

    const handleOk = ():void => {
        if(type === 'build') {
            if(buildname.trim() === '') {
                message.error('请输入群昵称')
                return
            }
            if(avatar === null) {
                message.error('请选择群头像')
                return
            }
            let params = new FormData()
            params.append('avatar', avatar)
            params.append('name', buildname)
            params.append('userid', user.userid)
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            buildGroup(params, config).then((res: any) => {
                if(res.errcode === 0) {
                    message.success('建群成功')
                    getGroupsList()
                }
            })
        } else {

        }
        closeModal()
    }

    return (
        <Modal
            title={type !== 'build' ? '添加好友/群' : '新建群'}
            visible={visible}
            width={600}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
        >
            {
                type !== 'build' ? add() : build()
            }
            <InfoDetail data={selected} visible={showDetail} user={user} closeModal={() => setShowDetail(false)} friendgroups={friendgroups} socket={socket} />
        </Modal>
    )
}

export default AddFriendModal