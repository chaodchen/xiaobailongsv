const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { gzip } = require('zlib')
const urltool = require('url')

const rc4key = 'chaodchen'
function rc4(key, text) {
    let s = [], j = 0, x, res = '';
    for (let i = 0; i < 256; i++) {
        s[i] = i;
    }
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        [s[i], s[j]] = [s[j], s[i]];
    }
    i = 0;
    j = 0;
    for (let y = 0; y < text.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        [s[i], s[j]] = [s[j], s[i]];
        x = text.charCodeAt(y) ^ s[(s[i] + s[j]) % 256];
        res += String.fromCharCode(x);
    }
    return res;
}

const userdict = {}
const server = http.createServer()

const app_secret = "YXDmQTvWK0gPmKwGN0CqY9mHC7YITDU0"
const app_key = "cm239ujdqusutr291pt0"

// 我的
// const app_secret = "QLDNPBQr2oWxdButviwELqR1qass4ueN"
// const app_key = "cm4r7kbdqusoknkpsa4g"
const host = "api.paojiaoyun.com"

// let isLock = false;
// let lockList = [];
// async function lock() {
//     function unlock() {
//         let waitFunc = lockList.shift();
//         if (waitFunc) {
//             waitFunc.resolve(unlock);
//         } else {
//             isLock = false;
//         }
//     }
//     if (isLock) {
//         return new Promise((resolve, reject) => {
//             lockList.push({ resolve, reject });
//         });
//     } else {
//         isLock = true;
//         return unlock;
//     }
// }

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
            if (callback) callback(chuck)
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

function heartbeat(card, callback) {
    let urlpath = "/v1/card/heartbeat";
    let nonce = randomString(32);
    let timestamp = getTimestamp();
    let params = "app_key="+app_key+"&card="+card+"&nonce="+nonce+"&timestamp="+timestamp+"&token="+userdict[card];
    let sign = crypto.createHash('md5').update('POST' + host + urlpath + params + app_secret).digest('hex');
    let data = {
        app_key: app_key,
        card: card,
        nonce: nonce,
        timestamp: timestamp,
        token: userdict[card],
        sign: sign
    }
    http_json_post('http://api.paojiaoyun.com'+urlpath, data, callback);
}


server.on('request', function(req, res) {
    let url = req.url;
    if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            console.log(body)
            res.end('404')
        })
    } else if (req.method === 'GET') {
        const reqobj = urltool.parse(req.url, true)
        const pathname = reqobj.pathname
        const query = reqobj.query
        switch (pathname) {
            case '/login':
                console.log('卡密登录')
                if (!query.card || !query.device_id) break;
                login(query.card, query.device_id, (data) => {
                    console.log(data)
                    let datajson = JSON.parse(data)
                    if (datajson.code == 0) {
                        userdict[query.card] = datajson['result']['token']
                    }
                    res.end(rc4(rc4key, data), 'utf-8')
                });
                break;
            case '/heartbeat':
                console.log('心跳')
                if (!query.card) break;
                heartbeat(query.card, (data) => {
                    console.log(data)
                    res.end(rc4(rc4key, data), 'utf-8')
                })
                break;
            default:
                res.end('404')
        }
    }
});

server.listen(9999, function() {
    console.log("服务端开始监听2");
});
