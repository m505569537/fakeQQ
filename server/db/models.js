const mongoose = require('mongoose')

// 用户添加的好友
const friendslistSchema = mongoose.Schema({
    userid: { type: Number, required: true },
    friends: { type: Object, default: { '所有好友': [] } }
})

const FriendsListModel = mongoose.model('friendslist', friendslistSchema)

exports.FriendsListModel = FriendsListModel

// 用户加入的群
const groupslistSchema = mongoose.Schema({
    userid: { type: Number, required: true },
    groups: { type: Array, required: true }
})

const GroupsListModel = mongoose.model('groupslist', groupslistSchema)

exports.GroupsListModel = GroupsListModel

// 群信息
const groupSchema = mongoose.Schema({
    groupid: { type: Number, required: true },
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    members: { type: Array }
})

const GroupModal = mongoose.model('groups', groupSchema)

exports.GroupModal = GroupModal

// 用户信息
const userSchema = mongoose.Schema({
    userid: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true }
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel

// 聊天信息
const chatSchema = mongoose.Schema({
    // 分为用户聊天和群聊，chatid = 用户聊天: userA_userB，群聊天: groupid
    chatid: { type: String, required: true },
    messages: { type: Array }
})

const ChatModel = mongoose.model('chat', chatSchema)

exports.ChatModel = ChatModel

// 任务列表
const taskSchema = mongoose.Schema({
    //taskid 表示任务类型, 1 表示添加好友
    taskid: { type: Number, required: true },
    from: { type: Object },
    to: { type: Number },
    taskData: { type: Object }
})

const TaskModel = mongoose.model('tasks', taskSchema)

exports.TaskModel = TaskModel


