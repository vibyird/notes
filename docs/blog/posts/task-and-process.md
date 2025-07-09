---
title: 任务与进程
date: 2017-02-18T14:28:15+08:00
tags:
- Task
- Process
- Bash
- Shell
categories: 
- Unix/Linux
---

任务是一个工作单元或者执行单元。任务会包含一个抽象的引用指向一个进程或一个进程组，被称为任务id。任务是被交互地启动的。

进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。

<!-- more -->

## 任务与进程

### 任务类型

``` bash
cmd [arg …]                   # 前台任务
cmd [arg …]&                  # 后台任务
cmd1 [arg …] | cmd2 [arg …]   # 多个命令组成的任务
```

### 任务查看与管理

``` bash
ctrl + z                # 将前台任务切换至后台，并暂停
fg [jobspec …]          # 将后台任务切换至前台，并执行
bg [jobspec …]          # 执行后台任务
disown [jobspec …]      # 取消后台任务
jobs [jobspec …]        # 查看后台任务
jobs  –l                # 列出进程组ID
jobs –p                 # 仅列出进程组ID
jobs –r                 # 仅列出正在执行的任务
jobs –s                 # 仅列出停止的任务
jobs -x cmd [arg …]     # 将cmd命令中的任务ID转成进程ID，并执行
```

\+ 代表最近被放到背景的工作号码
\- 代表最近最后第二个被放置到背景中的工作号码

### 进程、进程组和会话

![Process, Process group & Session](../images/task-and-process/1-light.png#only-light)
![Process, Process group & Session](../images/task-and-process/1-dark.png#only-dark)

1. 每个会话有1个或多个进程组组成，可能有一个领头进程((session leader))，也可能没有。 
2. 会话领导进程的PID成为识别会话的SID(session ID) 。
3. 会话中的每个进程组称为一个工作(job)。
4. 会话可以有一个进程组成为会话的前台工作(foreground)，而其他的进程组是后台工作(background)。
5. 每个会话可以连接一个控制终端(control terminal)。当控制终端有输入输出时，都传递给该会话的前台进程组。由终端产生的信号，比如CTRL+Z， CTRL+\，会传递到前台进程组。
6. 会话的意义在于将多个job(进程组)囊括在一个终端，并取其中的一个job(进程组)作为前台，来直接接收该终端的输入输出以及终端信号。 其他工作在后台运行。

## Hang Up

在Unix的早期版本中，每个终端都会通过modem和系统通讯。当用户logout时，modem就会挂断（hang up）电话。同理，当modem断开连接时，就会给终端发送hangup信号来通知其关闭所有子进程。

如何避免进程在终端结束时也随之结束呢？

+ 方案一：让进程忽略 HUP 信号
	- nohup cmd [arg …]
	- disown -h [jobspec …]
	- disown –ah
	- disown –rh
+ 方案二：让进程不属于此终端的子进程
	- setsid cmd [arg …]
	- (cmd [arg …] &)

## Daemon

在多任务操作系统中，Daemon是作为后台进程运行，而非在一个交互的环境的控制下运行的程度。传统上，Daemon程序会以d作为程序后缀，例如：httpd（ Apache服务器）、sshd（ SSH服务器）等。

### Daemon进程特点

+ 断开控制终端的连接
+ 成为会话的领头进程
+ 成为进程组的领头进程
+ 通过fork和exit成为一个后台进程（一次或两次）
+ 设置根目录／成为当前的工作目录
+ 更改umask允许读写
+ 关闭所有从父进程继承过来的文件描述符，包括标准输出、标准错误
+ 使用日志文件控制台或/dev/null作为标准输入、标准输出和标准错误

### Shell实现原理

+ setsid命令，可以让一个进程变成一个新的会话进程
+ cd命令，可以更改进程的工作目录
+ umask命令，可以调整进程的umask模式
+ <>&-，可以关闭文件描述符

### Demo代码

``` bash
#!/usr/bin/env bash

# 断开控制终端的连接
# 成为会话的领头进程
# 成为进程组的领头进程
if [ 'true' != "$DAEMONIZE" ]
then
    export DAEMONIZE=true
    setsid /usr/bin/env bash "$0" "$@" &
    exit 0
fi

# 设置根目录/成为当前的工作目录
cd /

# 更改umask允许读写
umask 0

# 关闭所有从父进程继承过来的文件描述符
# 使用~/text文件作为标准输出
exec 0<&-
exec 1>~/text
exec 2>&-

# 代码执行区域
while true
do
    sleep 5
    echo 'Hello World!'
done
```

