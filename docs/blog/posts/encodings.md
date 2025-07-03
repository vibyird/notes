---
title: 编码
date: 2017-05-22T20:12:47+08:00
categories:
- Encoding
tags: 
- encoding
- unicode
---
## 文本编码

### 单字节编码

* 7Bit编码：ASCII
* 8Bit编码：ISO/IEC 8859

### 多字节编码

* 简体中文：GB 2312、GBK、GB 18030
* 繁体中文：Big5

### Unicode

* 定长编码：UCS-2、UTF-32/UCS-4
* 变长编码：UTF-8、UTF-16

<!-- more -->

### ISO/IEC 8859

1. Latin-1 Western European 
1. Latin-2 Central European
1. Latin-3 South European
1. Latin-4 North European
1. Latin/Cyrillic
1. Latin/Arabic
1. Latin/Greek
1. Latin/Hebrew
1. Latin-5 Turkish
1. Latin-6 Nordic
1. Latin/Thai
1. Latin/Devanagari
1. Latin-7 Baltic Rim
1. Latin-8 Celtic
1. Latin-9
1. Latin-10 South-Eastern European

### Unicode/UCS

UCS是国际标准ISO/IEC 10646定义字符集，是很多字符编码的基础。
Unicode是世界上大多数文字系统进行一致性编码、呈现以及处理的行业标准。

* UCS和Unicode有着相同的字库和字码，相同的字符在两个标准中有着相同的位置。
* 相比UCS ，Unicode新版本的发布和新字符的添加更加频繁。 
* 不同于UCS仅仅是字符映射 ，Unicode额外定义了许多与字符相关的规则与规范，包括字符串排序／比较规则，文字规范化、双向文字（比如：拉丁文和希伯来文的混合文字）处理算法等。

### 不同的Unicode实现历史

* UCS-2
* UTF-8
 * 1992年7月
USL的Dave Prosser提出FSS-UTF提案。
 * 1992年9月
Ken Thompson和Rob Pike基于FSS-UTF提案进行部分修改，并最终被X/Open接纳称成为FSS-UTF （UTF-8的旧称）规范。
 * 1993年1月
UTF-8在圣地亚哥举办的USENIX 会议上被首次正式使用。
* UTF-16
 * 1996年7月
在Unicode 2.0 中首次出现。

### Unicode实现对比

编码范围(16进制编码) | UTF-8 | UTF-16 | UTF-32 | UTF-EBCDIC | GB 18030
-------------------- | ----- | ------ | ------ | ---------- | --------
000000 – 00007F      | 1位   | 2位    | 4位    | 1位        | 1位     
000080 – 00009F      | 2位   | -      | -      | -          | 2位：继承自GB 2312/GBK 编码的字符（大多数都是中文字符）；4 位：除上面之外的字符。
0000A0 – 0003FF      | -     | -      | -      | 2位        | -       
000400 – 0007FF      | -     | -      | -      | 3位        | -       
000800 – 003FFF      | 3位   | -      | -      | -          | -       
004000 – 00FFFF      | -     | -      | -      | 4位        | -       
010000 – 03FFFF      | 4位   | 4位    | -      | -          | 4位     
040000 – 10FFFF      | -     | -      | -      | 5位        | -       

### 中文编码

1. GB2312编码
国家标准，使用2Byte进行编码。
1. GBK编码
微软标准，与GB2312完全兼容，使用2Byte进行编码。
1. GB18030编码
国家标准，与GB2312／GBK基本兼容，并且符合Unicode规范。和UTF-8一样，是一种Unicode实现。

### 文本文件的编码

* Windows
 * ASNI
默认编码方式，不同语言环境下不同。简体中文环境下为GBK编码。
 * Unicode
对应带BOM头的UTF-16编码。
 * UTF-8
对应带BOM头的UTF-8编码。
* Mac
 * UTF-8
默认编码方式，对应UTF-8编码。
 * UTF-16
对应UTF-16编码。
 * 简体中文（Mac）
 * GB 18030

## 二进制转文本编码

直到20世纪90年代初，大多数程序和数据传输通道假设所有的字符都是用0到127（7位）的数表示的。二进制文件不能直接使用7位的数据通道传输。为了解决这个问题，我们设计了使用 7位ASCII字符表示的二进制转文本编码。

* Quoted-Printable编码
任何8位字节的值可以被编码成3个字符：一个“=”字符紧跟着两个16进制的数字 （0–9或A–F）字符用于表示字节的数值。

* Base64编码
首先，选取64个不同可打印ASCII字符，64不同的字符可以完整地表示6位的数据。然后，按照4个6位数据可表示3个8位数据的逻辑进行转换。

* Percent／URL编码
和Quoted-Printable类似，只是将“=”字符换成了“%”字符。

