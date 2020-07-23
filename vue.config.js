let proxyObj = {};
proxyObj['/'] = {
    ws : false,
    target : 'http://localhost:8888',
    changeOrigin: true,
    pathrewirte : {
        '^/' : ''
    }
}
module.exports={
    devServer : {
        host : 'localhost',
        port : '8080',
        proxy : proxyObj
    }
}