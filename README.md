用nodejs编写的小程序，功能是从网络上下载zip压缩包，解压缩，读取文件内容，输出并复制到剪贴板上。

更实际的用途，一键获取idea激活码，直接粘贴。

本地运行：

```bash
npm install
npm start
```

生成跨平台的二进制可执行文件：
```
npm install -g pkg
pkg index.js --targets=node12-win-x64
```

如果下载慢，可手动去网站上下载对应的包 https://github.com/vercel/pkg-fetch/releases

激活码来源：http://idea.medeming.com/jets/