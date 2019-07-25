import Api from './Api'

export default {
    fetchTest () {
        return Api().get('test')
    }
}