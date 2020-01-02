const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/chatroom', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('connected', () => {
    console.log('数据库连接成功');
})