module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://lianghj.top:8888/api/private/v1/',
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}