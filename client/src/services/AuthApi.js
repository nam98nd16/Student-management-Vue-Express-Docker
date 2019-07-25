import Api from './Api'

export default {
    signupUsingAPI (username, password) {
        return Api().post('register', {username, password})
    },
    loginUsingAPI (username, password) {
        return Api().post('login', {username, password})
    },
    getUser (userID) {
        return Api().get('users/' + userID, { 'headers': { 'Authorization': this.$cookie.get('token')}})
    },
    logoutUsingAPI () {
        return Api().get('logout')
    }
}