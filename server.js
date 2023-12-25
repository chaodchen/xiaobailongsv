const http = require('http');
const fs = require('fs')
const path = require('path');
const { gzip } = require('zlib');

const server = http.createServer();

const ret_json_1 = {"code":0,"message":"ok","result":{"notice":"38|https://www.123pan.com/s/l6x0Vv-htTu3.html|小白龙白龙马"},"nonce":"cm4j6r0o3pj84ant4a00","sign":"295b1ffe6101999d9ba9e03bea56b987"};
const ret_base64_1 = 'LI4CcopnLhVi4x2yUZZVB/tjuH9XDKnLK3uk7dv6Z4lB3kZdz1gC0IJQls1XYpwnw2q6IT3cLVsULGXdc6gx1BbHgHoEcNE0qnM16ftPre+HKvXF1yi7cPjRfX2Y+Tkb4vWnca8+h5DHzrToGODnz/zqZ+0lpOm7CFnKKoYWwU8='
const ret_base64_2 = 'eyJjb2RlIjo0MDQsIm1lc3NhZ2UiOiLljaHlr4bkuI3lrZjlnKjvvIzor7fmo4Dmn6XovpPlhaXnmoTljaHlr4YiLCJub25jZSI6ImNtNG45cTBvM3BqODRhamhvZTUwIiwic2lnbiI6IjUwOWYzNTgzZDcyNzQxNGViOTQ3OGJhYzhmMzE1OTE3In0'

function main () {
    server.on('request', function(req, res) {
        let url = req.url;
        console.log("url=" + url);
        if (url == '/xbl/xblxbl1.8') {
            res.writeHead(200, {
                "Connection": "Upgrade, close",
                "ETag": "5fed5-60b371e805db5-gzip",
                "Accept-Ranges": "bytes",
                "Vary": "Accept-Encoding",
                "Content-Encoding": "gzip",
                "Transfer-Encoding": "chunked"
            });
            fs.readFile(__dirname + "/files/xblxbl1.8", (err, data) => {
                if (err) return;
                gzip(data, (err, buffer) => {
                    if (err) return;
                    res.write(buffer);
                    res.end();
                });
            });
        } else if (url == '/xbl/abcabc') {
            res.writeHead(200, {
                "Upgrade": "h2",
                "Connection": "Upgrade, close",
                "ETag": "5054-60b371e7e0bf5-gzip",
                "Accept-Ranges": "bytes",
                "Vary": "Accept-Encoding",
                "Content-Encoding": "gzip",
            });
            fs.readFile(__dirname + "/files/abcabc.zip", (err, data) => {
                if (err) return;
                gzip(data, (err, buffer) => {
                    if (err) return;
                    res.write(buffer, (err) => {
                        res.end();
                    });
                });
            });
        } else if (url.match(/\/yy.php\?card=\w{32}/g)) {
            res.writeHead(200, {
                "Connection": "keep-alive",
                "Content-Encoding": "gzip",
                "Content-Type": "text/html; charset=UTF-8",
                "Vary": "Accept-Encoding"
            });
            res.write(ret_base64_1, 'utf8', (err) => {
                res.end();
            });
        } else if (url.match(/\/v1\/software\/notice\?app_key=ckn72tjdqusvnto8uf9g&nonce=\w+&timestamp=\d{10}&sign=\w{32}/g)) {
            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8",
            });
            res.write(JSON.stringify(ret_json_1), (err) => {
                res.end();
            });
        } else if (url.match(/\/aa\.php\?card=yttt&device_id=\w+/g)) {
            res.writeHead(200, {
                "Connection": "keep-alive",
                "Content-Type": "text/html; charset=UTF-8",
                "Content-Encoding": "gzip",
                "Vary": "Accept-Encoding"
            });
            res.write(ret_base64_2, 'utf8', (err) => {
                res.end();
            });
        } else {    
            res.end('404 not found.');
        }
    });
}

main();

server.listen(9988, function() {
    console.log("服务端开始监听");
});


// http://yym.4yym.cn/xbl/xblxbl1.8
// http://aka.baodaoyun.com/xbl/xblxbl1.8
// http://yym.4yym.cn/xbl/abcabc
// http://yym.4yym.cn/yy.php?card=394bb139818460d3607e2b792c045afd
// http://api.paojiaoyun.com/v1/software/notice?app_key=ckn72tjdqusvnto8uf9g&nonce=fecfddacbabbcbab1703490410&timestamp=1703490410&sign=042ec072a67bf86fcdb53b215143fe9d
// http://api.paojiaoyun.com/v1/ping
// http://api.paojiaoyun.com/v1/software/notice?app_key=ckn72tjdqusvnto8uf9g&nonce=cm4j6q8o3pj84ant3hkg1703490413&timestamp=1703490413&sign=f651f766e8203e72d78b2b08a1269f24
// http://api.paojiaoyun.com/v1/software/notice?app_key=ckn72tjdqusvnto8uf9g&nonce=cm4j6r0o3pj84ant4a001703490417&timestamp=1703490417&sign=d02aebb2592afa4b4f1b62981ac314b2
// http://yym.4yym.cn/aa.php?card=yttt&device_id=fecfddacbabbcbab
// /yy.php\?card=\w{32}
// 042ec072a67bf86fcdb53b215143fe9d
