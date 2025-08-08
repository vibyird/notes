---
title: Html2Image
date: 2017-04-18T20:59:23+08:00
tags:
  - Html2Image
  - PhantomJS
categories:
  - Service
---

如何实现一个简单的HTML生成Image的服务？

## 实现要素：

1. Html渲染引擎 + 截图
1. Web Server

<!-- more -->

## 实现方案

PhantomJS

> PhantomJS is a headless WebKit scriptable with a JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG.

- webpage模块
  - content变量 用于设置需要渲染的web页面内容
  - onLoadFinished回调 用于在web页渲染完成后，执行相应的操作
  - renderBuffer方法 用于获取渲染完成后的图片数据(Uint8ClampedArray格式)
  - renderBase64方法 用于获取渲染完成后的图片数据(Base64编码String格式)
- webserver模块
  - 用于实现WebServer

### 问题&解决

1. PhantomJS的wiki定义了renderBuffer方法但是没有实现？
   使用renderBase64方法获取图片数据。
1. 上一问题的解决方案解决了获取的数据问题，但没有解决如何将获取的数据输出为图片的问题，如何解决？
   将Base64字符串解码成二进制字符串。
1. 渲染的图片上的文字显示效果差？
   在系统中安装适当的字体。

## 实现Demo

### Base64解码

```javascript

var Base64Binary = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    decode: function(input){
        if(input.length % 4 || !(input.match(/^[A-Za-z0-9\+\/]+(={0,2})$/)){
            return null;
        }
        var str = '';
        var code_1, code_2, code_3, code_4;
        for(var j = 0; j < input.length;){
            // 取本组第1、2位编码
            code_1 = this._keyStr.indexOf(input.charAt(j++));
            code_2 = this._keyStr.indexOf(input.charAt(j++));
            str += String.fromCharCode(((code_1 << 2) & 0xFC) | ((code_2 >> 4) & 0x03));
            // 取本组第3位编码
            code_3 = this._keyStr.indexOf(input.charAt(j++));
            if(0x40 === code_3){
                break;
            }
            str+= String.fromCharCode(((code_2 << 4) & 0xF0) | ((code_3 >> 2) & 0x0F));
            // 取本组第4位编码
            code_4 = this._keyStr.indexOf(input.charAt(j++));
            if(0x40 === code_4){
                break;
            }
            str+= String.fromCharCode(((code_3 << 6) & 0xC0) | ((code_4 >> 0) & 0x3F));
        }
        return str;
    }
};

```

### Html2Image服务

```javascript
var server = require('webserver').create()

server.listen(8001, function (request, response) {
  var format = 'png'

  var page = require('webpage').create()

  page.viewportSize = {
    width: 800,
    height: 600,
  }

  page.content = request.post

  page.onLoadFinished = function (status) {
    // Buffer is an binary string
    var buffer_base64 = page.renderBase64(format)
    buffer = Base64Binary.decode(buffer_base64)

    response.statusCode = 200
    response.headers = {
      Cache: 'no-cache',
      'Content-Type': 'image/' + format,
    }

    // Pass the Buffer to 'write' to send the binary string to the client
    response.setEncoding('binary')
    response.write(buffer)
    response.close()
  }
})
```
