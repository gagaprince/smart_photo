const http = require('http')
const https = require('https')
const URL = require('url')

let options =  {
	"hostname": "www.kuaishou.com",
	"path": "/short-video/3xa3xskb3un6kqk?fid=0&cc=share_copylink&followRefer=151&shareMethod=TOKEN&docId=9&kpn=NEBULA&subBiz=BROWSE_SLIDE_PHOTO&photoId=3xa3xskb3un6kqk&shareId=17574866976995&shareToken=X5zO6nCFBMRp1x2&shareResourceType=PHOTO_OTHER&userId=3xz25abg7wpsyzy&shareType=1&et=1_a%252F2006244406382665729_sl4375bl&shareMode=APP&originShareId=17574866976995&appType=2&shareObjectId=5198279977785424635&shareUrlOpened=0&timestamp=1691817380709&utm_source=app_share&utm_medium=app_share&utm_campaign=app_share&location=app_share",
	"method": "GET",
	"headers": {
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		"Host": "www.kuaishou.com",
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
		"cookie": "did=web_59dba2b84a6a48f09c2cb073c73d45eb; didv=1691850565000;"
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

