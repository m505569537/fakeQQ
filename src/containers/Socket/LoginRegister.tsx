import React, { ReactNode, useState } from 'react'
import { Modal, Form, Input, Button, message, Radio, Icon } from 'antd'

import ImageSelect from '../../components/ImageSelect'
import { registerUser, loginUser } from '../../services/api'
import { RadioChangeEvent } from 'antd/lib/radio'

export interface Props {
    visible: boolean,
    closeModal: any,
    getUser: any
}

const FormItem = Form.Item
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
}

const LoginRegister = (props: Props) => {
    const [ status, setStatus ] = useState('login')
    const [ username, setName ] = useState('')
    const [ password, setPsd ] = useState('')
    const [ password2, setPsd2 ] = useState('')
    const [ avatar, setAvatar ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    const { visible, closeModal, getUser } = props

    const loginU = ():void => {
        if(!username.trim() || !password.trim()) {
            message.warn('请输入信息')
            return
        }
        setLoading(true)
        const params: object = {
            username,
            password
        }
        let timer
        let sign: boolean = false
        timer = setTimeout(() => {
            if(sign) {
                clearTimeout(timer)
                closeModal()
            }
        }, 500)
        loginUser(params).then((res: any) => {
            if(res.errcode === 0) {
                sign = true
                getUser(res.data)
                message.success('登录成功')
                if(timer > 500) {
                    clearTimeout(timer)
                    closeModal()
                }
            } else {
                clearTimeout(timer)
                setLoading(false)
                message.error(res.message)
            }
        })
    }

    const registerU = ():void => {
        if(!username.trim() || !password.trim() || !avatar){
            message.warn('请输入信息')
            return
        }
        if(password !== password2){
            message.error('两次输入的密码不一样')
            return
        }
        setLoading(true)
        let params = new FormData()
        params.append('avatar', avatar)
        params.append('username', username)
        params.append('password', password)
        let timer
        let sign: boolean = false
        timer = setTimeout(() => {
            if(sign) {
                clearTimeout(timer)
                closeModal()
            }
        }, 500)
        registerUser(params).then((res: any) => {
            if(res.errcode === 0) {
                sign = true
                getUser(res.data)
                message.success('注册成功')
                if(timer > 500) {
                    clearTimeout(timer)
                    closeModal()
                }
            } else {
                clearTimeout(timer)
                setLoading(false)
                message.error(res.message)
            }
        })
    }

    const handleChange = (e: RadioChangeEvent):void => {
        setName('')
        setPsd('')
        setPsd2('')
        setAvatar(null)
        setLoading(false)
        setStatus(e.target.value)
    }

    const login = ():ReactNode => (
        <Form {...formLayout}>
            <FormItem label="用户名">
                <Input value={username} onChange={e => setName(e.target.value)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </FormItem>
            <FormItem label="密码">
                <Input value={password} onChange={e => setPsd(e.target.value)} type='password' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </FormItem>
            <FormItem wrapperCol={{ offset: 4 }}>
                <Button onClick={loginU} loading={loading}>确定</Button>
            </FormItem>
        </Form>
    )

    const register = ():ReactNode => (
        <Form {...formLayout}>
            <FormItem label="用户名">
                <Input value={username} onChange={e => setName(e.target.value)} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </FormItem>
            <FormItem label="密码">
                <Input value={password} onChange={e => setPsd(e.target.value)} type='password' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </FormItem>
            <FormItem label="确认密码">
                <Input value={password2} onChange={e => setPsd2(e.target.value)} type='password' prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </FormItem>
            <FormItem label="头像"><ImageSelect getImg={(img) => setAvatar(img)} /></FormItem>
            <FormItem wrapperCol={{ offset: 4 }}>
                <Button onClick={registerU} loading={loading}>确定</Button>
            </FormItem>
        </Form>
    )

    return (
        <Modal
            visible={visible}
            footer={null}
            closable={false}
        >
            <FormItem wrapperCol={{ offset: 8 }}>
                <RadioGroup size='large' onChange={handleChange} value={status}>
                    <RadioButton value='login'>Login</RadioButton>
                    <RadioButton value='register'>register</RadioButton>
                </RadioGroup>
            </FormItem>
            {
                status === 'login' ? login() : register()
            }
        </Modal>
    )
}

export default LoginRegister