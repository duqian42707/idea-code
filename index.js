const fs = require("fs");
const path = require("path");
const request = require("request");
const unzipper = require("unzipper");
const rimraf = require("rimraf");
const il = require('iconv-lite');
const os = require('os');
const exec = require('child_process').exec;

// 定义一些常量
const tempDirPath = path.join(__dirname, "tempfile");
const zipFileName = 'jihuoma.zip';
const zipFilePath = path.join(tempDirPath, zipFileName);
const unzipDirPath = path.join(tempDirPath, 'jihuoma');
const downUrl = "http://idea.medeming.com/jets/images/jihuoma.zip";

function init() {
    // 创建文件夹目录
    if (!fs.existsSync(tempDirPath)) {
        fs.mkdirSync(tempDirPath);
        console.log("文件夹创建成功");
    } else {
        console.log("文件夹已存在");
    }
}


// 下载文件
function downFile() {
    let stream = fs.createWriteStream(zipFilePath);
    return new Promise(resolve => {
        request(downUrl).pipe(stream).on("close", function (err) {
            console.log('文件下载完毕.');
            resolve();
        });
    })

}

// 解压缩
function unzip() {
    // 创建解压缩的目录
    if (!fs.existsSync(unzipDirPath)) {
        fs.mkdirSync(unzipDirPath);
    }

    return new Promise(resolve => {
        fs.createReadStream(zipFilePath)
            .pipe(unzipper.Parse())
            .on('entry', function (entry) {
                // if some legacy zip tool follow ZIP spec then this flag will be set
                const isUnicode = entry.props.flags.isUnicode;
                // il.decode 解决文件名乱码问题
                const fileName = isUnicode ? entry.path : il.decode(entry.props.pathBuffer, 'GBK');
                const type = entry.type; // 'Directory' or 'File'
                const size = entry.vars.uncompressedSize; // There is also compressedSize;
                const filePath = path.join(unzipDirPath, fileName);
                entry.pipe(fs.createWriteStream(filePath));
            }).on('close', function () {
                console.log('解压缩完毕.');
                resolve();
            });
    })
}


// 读取文件内容，复制到剪贴板
function readFile() {
    // 遍历解压缩的文件，找到2018之后的版本应使用的激活码文件
    const fileNames = fs.readdirSync(unzipDirPath);
    const fileName = fileNames.filter(file => file.indexOf('之后') > -1)[0];
    const filePath = path.join(unzipDirPath, fileName);
    // 读取文件内容,输出到控制台
    const data = fs.readFileSync(filePath, "utf-8");
    console.log('------ IDEA CODE BEGIN ------');
    console.log(data);
    console.log('------ IDEA CODE END ------');

    return new Promise(resolve => {
        // 判断操作系统类型，调用系统命令，复制到剪贴板
        if (os.type() == 'Windows_NT') {
            const cmd = 'clip < ' + filePath;
            exec(cmd, function (error, stdout, stderr) {
                console.log('已复制到剪贴板，可直接粘贴')
                resolve();
            });
        } else if (os.type() == 'Darwin') {
            const cmd = 'pbcopy < ' + filePath;
            exec(cmd, function (error, stdout, stderr) {
                console.log('已复制到剪贴板，可直接粘贴')
                resolve();
            });
        } else {
            console.log('复制到剪贴板失败，不支持的系统：' + os.type())
            resolve();
        }
    })

}


// 删除临时目录
function del() {
    return new Promise(resolve => {
        rimraf(tempDirPath, function () {
            console.log("临时文件删除成功");
            resolve();
        });
    })
}

// 按顺序依次执行
async function run() {
    init();

    console.log("===>开始下载文件...");
    await downFile();

    console.log("===>开始解压缩...");
    await unzip();

    console.log("===>读取文件内容，并复制到剪贴板...");
    await readFile();

    console.log("===>删除临时文件");
    await del();

    console.log("===>程序结束");
}

run();

