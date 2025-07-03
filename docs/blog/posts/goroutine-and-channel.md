---
title: Goroutine & Channel
date: 2019-10-24T09:28:31+08:00
categories:
- BackEnd
tags: 
- Golang
- BackEnd
- Concurrency
---

## 并发模型

###  进程 vs 线程 vs Goroutine

* 进程，是操作系统分配资源的基本单元。不同的进程之间内存空间资源独占，只能通过信号、管道、文件等方式进行通信。PHP-FPM即采取多进程并发模型，每一个请求过来，都会fork一个独立的进程用于处理该请求。
* 线程，是操作系统调度的基本单元。同一进程下的不同线程之间共享内存，可能出现资源竞争等问题。Java Servlet即采用多线程并发模型，每一个请求过来，都会创建一个独立的线程用于处理该请求。由于多线程使用共同的内存空间，就需要考虑全局性资源（全局的变量、对象、文件等）的线程安全问题。
<!-- more -->
* Goroutine，是一种协程，即用户空间的线程，操作系统不直接调度。相比进程和线程的优势，下文会具体阐述。

## Goroutine & Channel

Golang使用CSP模型实现并发，goroutine和channel即分别对应CSP模型中的Process和Channel。不同于多线程并发模型需要在竞态情形(race condition)下，通过复杂的锁机制确保资源正确使用。goroutine之间可以使用channel进行通信。Channel可以看成一个 FIFO 队列，对 FIFO 队列的读写都是原子的操作，不需要加锁。

### Goroutine创建

* 在Golang中，Goroutine是语言级别的支持，只需要通过一个简单的go关键字即可创建Goroutine，十分快捷简单。

```golang
    go func() { // 开启Goroutine
        fmt.Println("Hello World!")
    }()
```

### Channel创建 & 关闭

* Channel对象必须使用make()函数进行创建。


```golang
	channel := make(chan int) // 创建Channel
    channel := make(chan int) // 创建Channel 
	channel := make(chan int) // 创建Channel
	buffered_channel := make(chan int, 2) // 创建带有缓冲的Channel
	close(channel) // 关闭Channel
```

### Channel发送 & 接收

* 当"<-"发送运算符在Channel对象右边时，代表发送操作。
* 当"<-"接收运算符在Channel对象左边时，代表接收操作。可以只接收，不赋值；也可以接收完，再通过"="赋值运算符赋值给一个变量。

```golang
package main

import (
    "fmt"
    "time"
)

func main() {
    channel := make(chan int) // 创建Channel
    go func() { // 开启Goroutine
        time.Sleep(1000000000)
        channel <- 1 // 向Channel发送数据
    }()
    result := <-channel // 接收Channel中的数据
    fmt.Println(result)
}
```

### select语句

* select语句由多个带有Channel的发送或接收操作的case组成。
* 一组select语句执行，只会处理第一个就绪的发送或接收case。

```golang
package main

import (
    "fmt"
    "time"
)

func main() {
    channel1 := make(chan int) // 创建Channel1
    channel2 := make(chan int) // 创建Channel2
    go func() { // 开启Goroutine1
        time.Sleep(1000000000)
        channel1 <- 1 // 向Channel1发送数据
    }()
    go func() { // 开启Goroutine2
        time.Sleep(100000000)
        channel2 <- 2 // 向Channel2发送数据
    }()
    select { // 同时等待接收Channel1和Channel2的数据，只要有一个就绪，即完成对应case的处理
    case result := <-channel1:
        fmt.Println(result)
    case result := <-channel2:
        fmt.Println(result)
    }
}
```

### for … range语句

* for … range语句可以迭代接收Channel中的数据，直到Channel被关闭。

```golang
package main

import (
    "fmt"
    "time"
)

func main() {
    channel := make(chan int) // 创建Channel
    go func() {
        for i := 0; i < 10; i++ {
            time.Sleep(1000000000)
            channel <- i // 不断向Channel发送数据
        }
        close(channel) // 关闭Channel
    }()
    for result := range channel { // 迭代Channel中的数据，并打印出来
        fmt.Println(result)
    }
}
```

### 优雅地实现处理超时

* golang标准库中的time.After()函数的返回值，即是一个channel。
* 通过和select语句相结合，我们优雅地实现处理超时。

```golang
package main

import (
    "fmt"
    "time"
)

func main() {
    channel := make(chan int) // 创建Channel
    go func() { // 开启Goroutine
        time.Sleep(1000000000)
        channel <- 1 // 向Channel发送数据
    }()

    select {
    case result := <-channel: // 接收Channel中的数据
        fmt.Println(result)
    case <-time.After(100000000):
        fmt.Println("time out")
    }
}
```