const http = require('http')
const crypto = require('crypto');
const md5 = crypto.createHash('md5');


// var cryptostr = md5.update('Hello, world!').digest('hex');

const app_secret = "QLDNPBQr2oWxdButviwELqR1qass4ueN"
const app_key = "cm4r7kbdqusoknkpsa4g"
const host = "api.paojiaoyun.com"


/**
 *  当前时间戳（10位）
 */
function getTimestamp(){
    let outcome = Math.round(new Date().getTime()/1000)
    return outcome
}

function randomString(length) {
    let result = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result;
}
  
function http_json_post(api, data, callback) {
    data = JSON.stringify(data)
    const options = {
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


function login(card, device_id, cb) {
    const urlpath = "/v1/card/login"
    const nonce = randomString(32)
    const timestamp = getTimestamp()
    const params = "app_key="+app_key+"&card="+card+"&device_id="+device_id+"&nonce="+nonce+"&timestamp="+timestamp;
    const sign = md5.update('POST' + host + urlpath + params + app_secret).digest('hex');
    const data = {
        app_key: app_key,
        card: card,
        device_id: device_id,
        nonce: nonce,
        timestamp: timestamp,
        sign: sign
    }
    http_json_post('http://api.paojiaoyun.com/v1/card/login', data, (res) => {
        const resJson = JSON.parse(res);
        const resBase64 = Buffer.from(res, 'utf-8').toString('base64')
        console.log(resBase64);
    });
}


login("P33cBhDLMAfxj5DC2rcv", "hello,world.", (res) => {

})

// {"code":0,"message":"ok","result":{"card_type":"月卡","token":"lFDNgmSnxM2DzN3c8uWk","expires":"2024-01-23 00:38:29","expires_ts":1705941509,"config":"","server_time":1703349698},"nonce":"cm3grggo3pj84aihq3r0",
// {"code":0,"message":"ok","result":{"card_type":"天卡","token":"6b1DusjUFAoHSecdhIgq","expires":"2023-12-27 09:54:25","expires_ts":1703642065,"config":"","server_time":1703555665},"nonce":"cm534k8o3pj84aljovs0","sign":"825272af52f8c2da3f0d03ae469f738c"}
