## 这是一个仿QQ聊天模拟器

### 技术栈

+ Typescript
+ React
+ nodejs
+ Mongodb + mongoose
+ Socket.io
+ webpack

### 功能

+ 搜索功能
  + [x] 搜索好友
  + [x] 搜索群

+ 添加功能
  + [x] 添加好友
  + [ ] 添加群

+ 聊天功能
  + [x] 私聊
  + [ ] 群聊
  + [x] 文字交流
  + [ ] 图片交流
  + [x] 未读消息（目前仅支持在线时收到的消息）
+ 建群功能
  + [x] 建群
  + [ ] 邀请入群
+ 其它
  + [ ] 右键移动好友位置
  + [ ] 左键拖动好友移动
  + [ ] 修改昵称

### 功能实现

#### 搜索功能

简单的结合nodejs即可实现

这里使用关键字分别为 userid 和 groupid

<img src="/Users/xueee/Library/Containers/com.tencent.qq/Data/Library/Application Support/QQ/Users/505569537/QQ/Temp.db/552A97DE-F240-4E9B-A4DA-4C429E5D1F98.png" alt="552A97DE-F240-4E9B-A4DA-4C429E5D1F98" style="zoom:50%;" />

#### 添加功能

##### 添加好友

添加功能是在查找功能之上实现的逻辑。需要注意，a用户请求添加b用户为好友，不应该是a点击了添加按钮，b就直接变成了a的好友，还应该有一个b的确认过程。这样就很清楚了：

准备工作：

1. 用户的两种状态

   > 分别为离线和在线，可以考虑也可以不考虑，这主要会影响b用户收到请求消息的时间，即消息的及时性。解释：当用户处于离线状态，此时是收不到消息的，但一旦上线，即可通过在didmount中设置的方法请求到当前所有的未处理消息，而若用户处于在线状态，a用户发送请求，首先b这边需要先设置一个接受请求的方法，一旦接到新的通知即重新发送请求。如果不考虑状态，全部离线，只实现登录时请求数据，就会导致通知的滞后。

2. 服务器如何主动发送信息给b

   > 依旧是socket.io，只需要在client绑定监听，当a发请求到服务器时，socekt服务器先检测用户b是否在线，若在线直接向b发送消息，触发b的更新操作，否则就仅仅将任务对象存储到数据库中，等待下次b登录时请求。

3. 如何检测用户是否在线

   > 每个用户连接进io服务器的时候都会产生一个socket,可以将socket.id当作用户与io服务器之间链接的唯一身份标识。在app.js中定义一个空对象变量obj，然后将userid作为属性，其对应的socket.io作为属性值，检测是否在线就看obj[userid]是否存在。

流程：

1. 用户a在client创建任务对象发送ajax请求，同时向socket服务器发送消息通知事件
2. node服务器接受ajax请求，并将任务对象存储到数据库中
3. socket服务器检测用户b是否在线，若在线，向b发送确认事件，若不在线，就不做其它操作
4. 若b在线，b就可以收到即时的消息，若不在线，那么在b登录进来的时候会请求数据库中的任务数据，最终b都能获得任务内容
5. 一旦b这边将a发过来的请求处理掉了，无论同意还是拒绝，都会删掉数据库中存储的任务对象

##### 添加群



#### 聊天功能

> 关键库：socket.io

​	使用socket.io可以很轻松实现聊天功能，但是如果想要分开私聊和群聊的话，可能需要使用一些手段。

​	socket.io有Room这个概念，当你在Room中发送消息时，只有Room中的用户会收到消息，所以利用这一点，即可实现私聊（群聊还没试）

##### 私聊

​	将通讯双方的userid处理一下作为roomid，来创建唯一房间。由于我这边设置的接收消息的方法是通用的, 即

```js
// client
socket.on('msg', function (data) {
	...
})
```

而服务端中设置的是每个好友发送消息时都会触发'msg'方法，

```js
//server
io.to(roomid).emit('msg', data)
```

所以，如果用户同时处于多个room中时，可能收到多个用户的消息，这样就需要处理消息数据。我不是很想这样做，就只允许用户加入一个room，当前用户发送的消息能够即时的显示在聊天界面中，而其它用户发送的消息则会显示一个未读消息的badge，当然，所有的聊天信息都会存储到数据库中，当我们切换好友的时候，会触发请求聊天内容的函数，并将获得的信息存储到同一个对象中。<img src="/Users/xueee/Library/Containers/com.tencent.qq/Data/Library/Application Support/QQ/Users/505569537/QQ/Temp.db/A6669A3C-1CBD-4125-8106-1186B3EB9853.png" alt="A6669A3C-1CBD-4125-8106-1186B3EB9853" style="zoom:50%;" />

<img src="/Users/xueee/Library/Containers/com.tencent.qq/Data/Library/Application Support/QQ/Users/505569537/QQ/Temp.db/0563D759-34B2-48EE-9494-EFD4AEFE54EF.png" alt="0563D759-34B2-48EE-9494-EFD4AEFE54EF" style="zoom:50%;" />

#### 建群功能

