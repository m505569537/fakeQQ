import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4000'
axios.interceptors.request.use(config => {
    config.withCredentials = true;
    return config;
}, err => {
    return Promise.reject(err)
})
axios.interceptors.response.use(response => {
    return response.data
})

export const getImages = (params?: object) => axios.get('/getImages', {
    params
})

export const getTest = (params?: object) => axios.get('/test',{ params })
// 获取好友列表
export const getFriendsList = (params: object) => axios.get('/friendslist', { params })
// 获取群列表
export const getGroupsList = (params: object) => axios.get('/groupslist', { params })
// 新建群
export const buildGroup = (params: object, config: object) => axios.post('/buildgroup', params, config)
// 用户注册
export const registerUser = (params: object) => axios.post('/register', params)
// 用户登录
export const loginUser = (params: object) => axios.post('/login', params)
// 获取用户信息
export const getUserInfo = (params: object) => axios.get('/getuserinfo', { params })
// 搜索用户/群
export const getFriendOrGroup = (params: object) => axios.get('/getfriendorgroup', { params })
// 添加好友/群
export const addFriendOrGroup = (params: object) => axios.post('/addfriendorgroup', params)
// 确认是否添加好友/群
export const deciseAddOrNot = (params: object) => axios.post('/deciseAddOrNot', params)
// 获取消息
export const getMessages = (params: object) => axios.get('/getmessage', { params })
// 发送消息
export const sendMessage = (params: object) => axios.post('/sendmessage', params)