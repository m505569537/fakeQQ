const path = require('path')
const router = require('koa-router')()
const multer = require('koa-multer')
const { FriendsListModel, GroupsListModel, GroupModal, UserModel, ChatModel, TaskModel } = require('../db/models')

const filter = {__v: 0, password: 0}

// 与登录注册相关的使用token
// 设计到具体业务逻辑的使用userid

// 获取好友列表
router.get('/friendslist', async (ctx, next) => {
    const { userid } = ctx.request.query
    let errcode = 1, message, data
    const list = await FriendsListModel.findOne({ userid }, filter)
    if(list){
        errcode = 0
        data = list.friends
    } else {
        message = '暂无好友'
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 获取群列表
router.get('/groupslist', async (ctx, next) => {
    const { userid } = ctx.request.query
    let errcode, data = [], message
    const list = await GroupsListModel.findOne({ userid }, filter)
    if(list) {
        errcode = 0
        for(let i = 0; i < list.groups.length; i++) {
            const group = await GroupModal.findOne({ groupid: list.groups[i] }, filter)
            data.push(group)
        }
    } else {
        errcode = 1
        message = '暂无好友信息'
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

let img_time
let img_url
let storage = multer.diskStorage({
    // 文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../public/images'));
    },
    // 修改文件名称
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split('.');
        img_time = Date.now();
        img_url = '//localhost:4000/images/' + img_time + '.' + fileFormat[fileFormat.length - 1]
        cb(null, img_time + '.' + fileFormat[fileFormat.length - 1]);
    }
})
let upload = multer({ storage });

// 新建群
router.post('/buildgroup', upload.single('avatar'), async (ctx, next) => {
    const { name, userid } = ctx.req.body
    const groupObjs = await GroupModal.find({})
    const friendslist = await GroupsListModel.findOne({ userid })
    const group = new GroupModal({ groupid: groupObjs.length + 1, name, avatar: img_url})
    let errcode = 0, message = '建群成功'
    try {
        await group.save()
        if(!friendslist){
            const newList = new GroupsListModel({ userid, groups: [group.groupid] })
            await newList.save()
        } else {
            const { userid, groups } = friendslist
            await GroupsListModel.updateOne({ userid }, { groups: groups.concat(group.groupid) })
        }
    } catch (error) {
        errcode = 1
        message = '建群失败'
    }
    ctx.body = { errcode, message }
})

// 用户注册
router.post('/register', upload.single('avatar'), async (ctx, next) => {
    const { username, password } = ctx.req.body
    let errcode = 1, message, data
    const user = await UserModel.findOne({ username })
    if(user){
        message = '用户已存在'
    } else {
        const users = await UserModel.find({})
        let id
        if(users.length > 0) {
            id = users[users.length - 1].userid > users.length ? (users[users.length - 1].userid + 1) : (users.length + 1)
        } else {
            id = 1
        }
        const newUser = new UserModel({ userid: id, username, password, avatar: img_url })
        const newUserFriendsList = new FriendsListModel({ userid: newUser.userid })
        try {
            await newUser.save()
            await newUserFriendsList.save()
            errcode = 0
            data = newUser
            ctx.cookies.set('token', newUser._id, {
                maxAge: 1000*60*60*24*7,
                httpOnly: false
            });
        }catch(err){
            message = '注册失败'
        }
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 用户登录
router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body
    let errcode = 1, message, data
    const user = await UserModel.findOne({ username })
    if(user) {
        if(user.password !== password) {
            message = '用户名或密码错误'
        } else {
            errcode = 0
            data = user
            ctx.cookies.set('token', user._id, {
                maxAge: 1000*60*60*24*7,
                httpOnly: false
            });
        }
    } else {
        errcode = 1
        message = '用户不存在'
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 通过token获取用户信息
router.get('/getuserinfo', async (ctx, next) => {
    const { token } = ctx.request.query
    let errcode = 1, message, data
    const user = await UserModel.findOne({ _id: token },filter)
    if(user) {
        errcode = 0
        data = user
    } else {
        message = '通行证已过期，请重新登录'
        ctx.cookies.set('token', '', {
            maxAge: 0
        })
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 搜索好友/群
router.get('/getfriendorgroup', async (ctx, next) => {
    const { kw, type } = ctx.request.query
    let errcode = 1, message, data
    if(type === 'addfriend') {
        const users = await UserModel.find({ $or: [{ userid: !isNaN(kw) ? kw : -1 }, { username: kw }] }, filter)
        if(users) {
            errcode = 0
            data = users
        } else {
            message = '未找到符合条件的用户'
        }
    } else {
        const groups = await GroupModal.find({ $or: [{ groupid: kw }, { name: kw }] }, filter)
        if(groups) {
            errcode = 0
            data = groups
        } else {
            message = '未找到符合条件的群组'
        }
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 添加好友/群
router.post('/addfriendorgroup', async (ctx, next) => {
    const { type, from, to, taskData, taskid } = ctx.request.body
    let errcode = 1, data = {}
    if(type === 'addfriend'){
        const task = new TaskModel({ from, to, taskData, taskid })
        try {
            await task.save()
            errcode = 0
            data = task
        } catch (error) {
            
        }
    }
    ctx.body = { errcode, data }
})
// 确认选择
router.post('/deciseAddOrNot', async (ctx, next) => {
    const { type, task } = ctx.request.body
    const { from, to, taskData, taskid, _id } = task
    let errcode = 1, message
    if(type == 1) {
        // 1表示同意添加
        const userFrom = await FriendsListModel.findOne({ userid: from.userid })
        const userTo = await FriendsListModel.findOne({ userid: to })
        const userInfoTo = await UserModel.findOne({ userid: to }, filter)
        let objFrom = {}, objTo = {}
        objFrom[taskData.groupname] = userFrom.friends[taskData.groupname].concat(userInfoTo)
        objTo[taskData.groupname] = userTo.friends[taskData.groupname].concat(from)
        try {
            await FriendsListModel.updateOne({ userid: from.userid }, { friends: objFrom })
            await FriendsListModel.updateOne({ userid: to }, { friends: objTo })
            await TaskModel.deleteOne({ _id })
            errcode = 0
            message = '添加成功'
        } catch (error) {
            message = '添加失败'
        }
    } else {
        try {
            await TaskModel.deleteOne({ _id })
            errcode = 0
            message = '已拒绝'
        } catch (error) {
            message = '系统错误'
        }
    }
    ctx.body = { errcode, message }
})

// 获取消息
router.get('/getmessage', async (ctx, next) => {
    const { chatid } = ctx.request.query
    let errcode = 1, message, data
    const chat = await ChatModel.findOne({ chatid }, filter)
    if(chat) {
        errcode = 0
        data = chat
    } else {
        message = '暂无数据'
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

// 发送消息
router.post('/sendmessage', async (ctx, next) => {
    const { chatid, msg } = ctx.request.body
    let errcode = 1, message, data
    const chat = await ChatModel.findOne({ chatid })
    if(chat){
        const messages = [].concat(chat.messages, msg)
        await ChatModel.updateOne({ chatid }, { messages })
        errcode = 0
        data = { chatid, messages }
    } else {
        const newChat = new ChatModel({ chatid, messages: [msg] })
        try {
            await newChat.save()
            errcode = 0
            data = newChat
        } catch (error) {
            message = '发送失败' 
        }
    }
    ctx.body = errcode === 0 ? { errcode, data } : { errcode, message }
})

module.exports = router