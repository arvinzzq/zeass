# Zeass

#### Zeass -> GEASS

```
所有人的GEASS能力是在获得GEASS那一时刻，自己内心最深处的想要实现的愿望。
```

A node full-stack framework based on koa2.

## TODO

* [x] 路由收集
* [x] 模板渲染
* [x] 用户态管理
* [x] 权限校验
* [x] 支持ORM方式接入数据库
* [x] 基础性安全防御
* [x] 接入teehee，支持命令行操作

## Usage

```
teehee init web-demo

npm install

npm run start:dev -> server side code on dev mode

npm run webpack:dev -> frontend side resource compile on dev mode
```

![usage demo](./usage_demo.gif)

## Project Structure

```javascript
.
├── base
│   ├── controller.js // 基础controller类，提供controller需要的基础方法
│   └── service.js // 基础service类，提供service需要的基础方法
├── helper
│   ├── authorize.js // 用户登录校验，根据用户登录态进行登录状态判断进行不同回调
│   ├── autobind.js // 类及类的方法的this绑定，解决类方法独立调用时的this指向问题
│   ├── csrf.js // CSRF安全防范，自定义使用在需要的接口，进行基于session机制存储secret以及发放token，并且在目标接口进行CSRF-TOKEN校验
│   ├── model.js // 根据配置参数遍历指定目录ORM models，生成model map用于service层的MySQL数据库层调用
│   ├── permission.js // 根据给定权限列表进行权限校验，自定义权限列表获取方式以及回调处理，分为sync和async两种模式，支持前后端的权限校验
│   └── route.js // 路由搜集，decorator方式在对应controller方法处定义路由，结合router中间件注册路由方法，并且生成路由列表方便查看
└── middleware
    ├── body.js // 基于koa-body进行ctx.body解析【只是预设了默认参数的简单封装，这个其实没做啥额外的工作
    ├── code.js // 注入ctx.CODE对象，便于请求返回状态值设置
    ├── json.js // 注入ctx.json(status, data)方法，处理json数据请求返回
    ├── render.js // 注入ctx.render方法进行模板渲染，支持参数&全局变量传入
    ├── router.js // 结合route helper进行路由收集以及路由方法注册
    ├── session.js // cookie以及session储存的设置，基于koa-generic-session和koa-redis
    ├── state.js // 注入ctx.globalState支持全局状态的设置读取和判断【基于ctx的全局状态】
    └── xss.js // XSS攻击基础防御，对query parameters以及body中的参数进行转译
```

## Development

```
teehee init web-project
```

choose project type of web

then:

```
npm link Zeass && npm run dev
```
