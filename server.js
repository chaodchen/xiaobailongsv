const http = require('http');
const fs = require('fs')
const path = require('path');
const crypto = require('crypto');
const { gzip } = require('zlib');

const server = http.createServer();
const ret_json_1 = {"code":0,"message":"ok","result":{"notice":"38|https://www.123pan.com/s/l6x0Vv-eLTu3.html|小白龙白龙马"},"nonce":"cm587j0o3pj84ai68ro0","sign":"88ecd3a5c7ea32ad59a1387880b54132"}
// const ret_json_1 = {"code":0,"message":"ok","result":{"notice":"38|https://www.123pan.com/s/l6x0Vv-htTu3.html|小白龙白龙马"},"nonce":"cm4j6r0o3pj84ant4a00","sign":"295b1ffe6101999d9ba9e03bea56b987"};
const ret_base64_1 = 'LI4CcopnLhVi4x2yUZZVB/tjuH9XDKnLK3uk7dv6Z4lB3kZdz1gC0IJQls1XYpwnw2q6IT3cLVsULGXdc6gx1BbHgHoEcNE0qnM16ftPre+HKvXF1yi7cPjRfX2Y+Tkb4vWnca8+h5DHzrToGODnz/zqZ+0lpOm7CFnKKoYWwU8='
const ret_base64_2 = 'eyJjb2RlIjo0MDQsIm1lc3NhZ2UiOiLljaHlr4bkuI3lrZjlnKjvvIzor7fmo4Dmn6XovpPlhaXnmoTljaHlr4YiLCJub25jZSI6ImNtNG45cTBvM3BqODRhamhvZTUwIiwic2lnbiI6IjUwOWYzNTgzZDcyNzQxNGViOTQ3OGJhYzhmMzE1OTE3In0'
const ret_base64_3 = 'eyJjb2RlIjo0MDAsIm1lc3NhZ2UiOiLlj4LmlbDplJnor68iLCJlcnJzIjp7IkNhcmRMb2dpblBhcmFtcy5Db21tb25TaWduUGFyYW1zLk5vbmNlIjoiTm9uY2Xplb/luqbkuI3og73otoXov4czNuS4quWtl+espiIsIkNhcmRMb2dpblBhcmFtcy5EZXZpY2VJRCI6IkRldmljZUlE5Li65b+F5aGr5a2X5q61In0sIm5vbmNlIjoiIiwic2lnbiI6IiJ9'
const app_secret = "YXDmQTvWK0gPmKwGN0CqY9mHC7YITDU0"
const app_key = "cm239ujdqusutr291pt0"
const host = "api.paojiaoyun.com"

function getTimestamp(){
    let outcome = Math.round(new Date().getTime()/1000)
    return outcome
}

function randomString(length) {
    let result = '';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result;
}
  
function http_json_post(api, data, callback) {
    data = JSON.stringify(data)
    let options = {
        // protocol: 'http',
        port: 80,
        hostname: api.split('/')[2],
        path: api.split(api.split('/')[2])[1],
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = http.request(options, res => {
        let chuck = ''
        res.on('data', check => {
            chuck += check
        })
        res.on('end', () => {
            if (callback) {
                callback(chuck)
            }
        })
    }).on('error', err => {
        console.log("Error", err.message)
    })
    req.write(data)
    req.end()
}

function login(card, device_id, callback) {
    let urlpath = "/v1/card/login";
    let nonce = randomString(32);
    let timestamp = getTimestamp();

    let params = "app_key="+app_key+"&card="+card+"&device_id="+device_id+"&nonce="+nonce+"&timestamp="+timestamp;
    let sign = crypto.createHash('md5').update('POST' + host + urlpath + params + app_secret).digest('hex');
    let data = {
        app_key: app_key,
        card: card,
        device_id: device_id,
        nonce: nonce,
        timestamp: timestamp,
        sign: sign
    }
    http_json_post('http://api.paojiaoyun.com/v1/card/login', data, callback);
}


function main () {
    server.on('request', function(req, res) {
        let url = req.url;
        console.log("url=" + url);
        // console.log(req.headers);
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
        } else if (url.match(/\/yy.php\?card=\w{32}$/g)) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=UTF-8",
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
        } else if (url.match(/\/aa\.php\?card=\w+&device_id=\w+/g) || 
            url.match(/\/\?card=\w+&device_id=\w+/g)) {
            let card = url.match(/card=\w+/g)[0].split('=')[1];
            let device_id = url.match(/device_id=\w+/g)[0].split('=')[1];
            login(card, device_id, (data) => {
                let dataJson = JSON.parse(data);
                console.log(data);
                let database64 = "";
                // if (dataJson['code'] == 0 && dataJson['result']) {
                //     let oldJson = {
                //         code: 0,
                //         message: "ok",
                //         result: {
                //             card_type: dataJson['result']['card_type'],
                //             token: "lFDNgmSnxM2DzN3c8uWk",
                //             expires: dataJson['result']['expires'],
                //             expires_ts: 1705941509,
                //             config: "",
                //             server_time: 1703349698
                //         },
                //         nonce: "cm3grggo3pj84aihq3r0",
                //         sign: "4b797e0187f273d288eb76a41054c7b8"
                //     }
                //     database64 = Buffer.from(JSON.stringify(oldJson), 'utf-8').toString('base64') + '\n';
                // } else {
                //     database64 = Buffer.from(data, 'utf-8').toString('base64');
                // }
                database64 = Buffer.from(data, 'utf-8').toString('base64');
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=UTF-8",
                });
                res.end(database64, 'utf-8');
                
            });
        } else if (url.match(/\/aa\.php\?card=\w+$/g)) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=UTF-8",
            });
            res.write(ret_base64_3, 'utf8', (err) => {
                res.end();
            });
        } else if (url.match(/\/v1\/ping/)) {
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
            });
            res.end('Pong', 'utf-8');
        } else if (url == '/') {
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
            });
            let ip = req.connection.remoteAddress + '';
            ip = ip.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g)[0];
            res.end(ip+'连接成功', 'utf-8');
        } else {
            console.log('非法访问: ' + url);
            res.end('404 not found.');
        }
    });
}

main();
server.listen(9988, function() {
    console.log("服务端开始监听");
});
