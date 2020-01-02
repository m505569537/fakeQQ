const Koa = require('koa');
const router = require('./routes/index.js');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const staticServer = require('koa-static');
const path = require('path');
const app = new Koa();
const server = require('http').createServer(app.callback())
require('./db')
const io = require('socket.io')(server)
const { TaskModel } = require('./db/models')

app.use(cors({
    origin: function(ctx) {
        const whiteList = ['http://localhost:3000', 'http://localhost:8080'];
        if(whiteList.indexOf(ctx.request.header.origin) !== -1){
            return ctx.request.header.origin;
        }
        return '*'
    },
    maxAge: 5,
    credentials: true,     //允许服务器发送cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['www-Authenticate', 'Server-Authorization']
}));
// 搭建静态资源服务器，使目录中的文件可以被访问
// localhost:4000/images/XXX.jpg
app.use(staticServer(path.join(__dirname, '/public/')));
app.use(bodyParser());
app.use(router.routes());

let onlineList = {}

io.on('connection', function (socket) {
    console.log('一个哈皮连了进来');
    socket.on('linkroom', function (msg) {
        console.log('link', msg);
        socket.join(msg.chatid)
        if(!onlineList[msg.userid]) {
            onlineList[msg.userid] = {}
            onlineList[msg.userid].id = socket.id
        }
        if(!onlineList[msg.userid].rooms) {
            onlineList[msg.userid].rooms = []
        }
        // 存储该用户所在的房间号
        onlineList[msg.userid].rooms.push(msg.chatid)
    })
    socket.on('leaveroom', function (msg) {
        console.log('leave', msg);
        socket.leave(msg.chatid)
        onlineList[msg.userid].rooms = onlineList[msg.userid].rooms.filter(item => item != msg.chatid)
    })
    socket.on('sendmsg', function (params) {
        // 在Room中发送消息
        const { chatid, msg, to } = params
        io.to(chatid).emit('msg', msg)
        console.log('online', onlineList);
        if(onlineList[to] && (!onlineList[to].rooms || onlineList[to].rooms.indexOf(chatid) === -1)){
            const unReadMsg = { from: msg.userid }
            io.to(onlineList[to].id).emit('unread', unReadMsg)
        }
    })
    socket.on('getTasks', async function ({ userid }) {
        // 将在线信息存储到列表中，这样就可以处理在线收到的消息了
        if(!onlineList[userid]) {
            onlineList[userid] = {}
        }
        onlineList[userid].id = socket.id
        // 每次登录的时候获取所有离线时收到的任务，无法获的在线时的收到的好友申请
        const tasks = await TaskModel.find({ to: userid })
        socket.emit('tasks', tasks)
    })
    socket.on('immediate task', function (task) {
        if(onlineList[task.to]){
            io.to(onlineList[task.to].id).emit('tasks', task)
        }
    })
    socket.on('refresh friendlist', function (userid) {
        if(onlineList[userid]) {
            io.to(onlineList[userid]).emit('refresh')
        }
    })
    socket.on('disconnect', function () {
        for(let key in onlineList) {
            if(onlineList[key].id == socket.id) {
                delete onlineList[key]
            }
        }
        console.log('一个哈皮断开了连接');
    })
})

server.listen(4000);