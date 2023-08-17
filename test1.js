const http = require('http')
const https = require('https')
const URL = require('url')

let options =   {
	hostname: 'www.kuaishou.com',
	path: '/short-video/3x8j9vht8i7yzyu?fid=0&cc=share_copylink&followRefer=151&shareMethod=TOKEN&docId=9&kpn=NEBULA&subBiz=BROWSE_SLIDE_PHOTO&photoId=3x8j9vht8i7yzyu&shareId=17576085851217&shareToken=X2fCXuc1UUAO1dL&shareResourceType=PHOTO_OTHER&userId=3xhmiwbrmtbyhhm&shareType=1&et=1_i%252F2002435180316334226_sl105bl&shareMode=APP&originShareId=17576085851217&appType=2&shareObjectId=5243597449986068567&shareUrlOpened=0&timestamp=1691914769712&utm_source=app_share&utm_medium=app_share&utm_campaign=app_share&location=app_share',
	method: 'GET',
	headers: {
	  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
	  Host: 'www.kuaishou.com',
	  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
	  cookie: 'did=web_bd1d6abf0bca4809b23f977db52d7c09; didv=1691917060000;',
	  'Accept-Language': 'zh-CN,zh;q=0.9',
	  Connection: 'keep-alive',
	  'Sec-Fetch-Dest': 'document',
	  'Sec-Fetch-Mode': 'navigate',
	  'Sec-Fetch-Site': 'none',
	  'Sec-Fetch-User': '?1',
	  'Upgrade-Insecure-Requests': '1',
	  'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
	  'sec-ch-ua-mobile': '?0',
	  'sec-ch-ua-platform': 'Windows',
	  Referer: 'https://www.kuaishou.com/short-video/3x8j9vht8i7yzyu?fid=0&cc=share_copylink&followRefer=151&shareMethod=TOKEN&docId=9&kpn=NEBULA&subBiz=BROWSE_SLIDE_PHOTO&photoId=3x8j9vht8i7yzyu&shareId=17576085851217&shareToken=X2fCXuc1UUAO1dL&shareResourceType=PHOTO_OTHER&userId=3xhmiwbrmtbyhhm&shareType=1&et=1_i%252F2002435180316334226_sl105bl&shareMode=APP&originShareId=17576085851217&appType=2&shareObjectId=5243597449986068567&shareUrlOpened=0&timestamp=1691914769712&utm_source=app_share&utm_medium=app_share&utm_campaign=app_share&location=app_share'
	}
}

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`) //返回状态码
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部
    res.setEncoding('utf8') // 设置编码
    res.on('data', (chunk) => { //监听 'data' 事件
        console.log(`主体: ${chunk}`)
    })

})
req.end() 

// const parseCookie = (headers)=>{
//     let cookie = '';
//       const cookieArr = headers['set-cookie'];
//       if (cookieArr) {
//         cookie = cookieArr
//           .map(cookieItem => cookieItem.split(' ')[0])
//           .join(' ');
//       }

//       return cookie;
// }

// const options = {
//     hostname: 'v.kuaishou.com',
//     path: '/1H4qKw',
//     method: 'GET',
//     headers: {
//       Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//       Host: 'v.kuaishou.com',
//       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
//     }
// }

// const req = https.request(options, (res) => {
//         console.log(`STATUS: ${res.statusCode}`) //返回状态码
//         console.log(`HEADERS: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部

//         if(res.statusCode === 302){
//             const headersfirst = res.headers;
//             const location = headersfirst.location;
//             const urlObj = URL.parse(location);
//             const { hostname, path } = urlObj;

//             const opt1 = {
//                 hostname,
//                 path,
//                 method: 'GET',
//                 headers: {
//                     Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                     Host: hostname,
//                     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
//                     cookie: parseCookie(headersfirst)
//                   }
//             }

//             const req1 = https.request(opt1, (res)=>{
//                 console.log(`STATUS1: ${res.statusCode}`) //返回状态码
//                 console.log(`HEADERS1: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部

//                 if(res.statusCode === 302){
//                     const headers = res.headers;
//                     const location = headers.location;
//                     const urlObj = URL.parse(location);
//                     const { hostname, path } = urlObj;

//                     const opt2 = {
//                         hostname,
//                         path,
//                         method: 'GET',
//                         headers: {
//                             Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                             Host: hostname,
//                             'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
//                             cookie: parseCookie(headers)
//                         }
//                     }

//                     console.log('opts:', opt2)
        
//                     const req1 = http.request(opt2, (res)=>{
//                         console.log(`STATUS2: ${res.statusCode}`) //返回状态码
//                         console.log(`HEADERS2: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部


//                         if(res.statusCode === 307){
//                             const headers = res.headers;
//                             const location = headers.location;
//                             const urlObj = URL.parse(location);
//                             const { hostname, path } = urlObj;

//                             const opt3 = {
//                                 hostname,
//                                 path,
//                                 method: 'GET',
//                                 headers: {
//                                     Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
//                                     Host: hostname,
//                                     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
//                                     cookie: parseCookie(headersfirst)
//                                 }
//                             }
        
//                             console.log('opts3:', opt3)

//                             const req2 = https.request(opt3, (res)=>{
//                                 console.log(`STATUS2: ${res.statusCode}`) //返回状态码
//                                 console.log(`HEADERS2: ${JSON.stringify(res.headers, null, 4)}`) // 返回头部



//                                 res.setEncoding('utf8') // 设置编码
//                                 res.on('data', (chunk) => { //监听 'data' 事件
//                                     console.log(`主体3: ${chunk}`)
//                                 })


//                             })

//                             req2.end()

//                         }
        
        
//                         res.setEncoding('utf8') // 设置编码
//                         res.on('data', (chunk) => { //监听 'data' 事件
//                             console.log(`主体2: ${chunk}`)
//                         })
        
//                     })

//                     req1.end();

//                 }




//                 res.setEncoding('utf8') // 设置编码
//                 res.on('data', (chunk) => { //监听 'data' 事件
//                     console.log(`主体1: ${chunk}`)
//                 })

//             })

//             req1.end();



//         }


//         res.setEncoding('utf8') // 设置编码
//         res.on('data', (chunk) => { //监听 'data' 事件
//             console.log(`主体: ${chunk}`)
//         })
//     });

//     req.end()

