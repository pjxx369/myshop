import axios from 'axios'

export default function(config) {
    const instance = axios.create({ baseURL: '/api', })

    instance.interceptors.request.use((config) => {
        if (config.url == 'login' || config.url == 'users') {
            return config
        } else {
            config.headers['token'] = window.sessionStorage.getItem('token');
            return config
        }
    })
    instance.interceptors.response.use((response) => {
        return response.data
    })


    return instance(config)

}