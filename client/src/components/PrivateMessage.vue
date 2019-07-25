<template>
  <div id="dashboard">
      <div class="card-body">
          <div class="card-title">
              <h5>Welcome to private message, {{this.userProfile.username}}!</h5>
              <hr>
          </div>


        <div class="all-users">
            <a @click="viewAllStudentsWithAPI">All users</a>
            <div v-for="user in allUsers" :key="user._id" class="user">
                <a @click="openUserModal(user.username)">{{user.username}}</a>
            </div>
        </div>

      </div>
      <hr>
      <transition name="fade">
            <div v-if="showUserModal" class="p-modal">
                <div class="p-container">
                    <a @click="closeUserModal" class="close">X</a>
                    <h5>Private messages between {{userProfile.username}} and {{username}}</h5>
                    <div v-for="message in messages" class="comments">
                        <!--<p><span style="font-weight: bold">Message:</span> {{ message.message }}, <span style="font-weight: bold">sent by:</span> <span style="font-style: italic">{{ message.user.username }}</span></p>-->
                        <p v-if="username == message.sender.username || userProfile.username == message.sender.username"><span style="font-weight: bold">{{message.sender.username}}</span>: <span style="word-wrap: break-word">{{message.message}}</span> <span style="font-style:italic;float:right">{{message.time}}</span></p>
                    </div>
                    <form @submit.prevent="sendPrivateMessage(username)">
                        <div class="form-group pb-3">
                            <label for="message" style="font-weight:bold">Message:</label>
                            <input type="text" v-model="message" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-success">Send</button>
                    </form>
                </div>
            </div>
        </transition>
  </div>

</template>

<script>
    import io from 'socket.io-client'
    import {mapState} from 'vuex'
    import moment from 'moment'
    import axios from 'axios'
    const api = axios.create({
        baseURL: 'http://localhost:3000'
    })
    export default {
        data () {
            return {
                socket: io('localhost:3001', {query: 'auth_token=' + this.$cookie.get('token')}),
                receiver: '',
                message: '',
                messages: [],
                items: [
                    [1, 2],
                    [3, 4],
                    [5, 6]
                ],
                allUsers: [],
                username: '',
                showUserModal: false
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        created () {
            this.socket.emit('join', {username: this.userProfile.username})
        },
        methods: {
            sendPrivateMessage(username) {
                this.socket.emit('send private message', {
                    sender: this.userProfile,
                    receiver: username,
                    message: this.message,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a')
                })
            },
            viewAllStudentsWithAPI () {
                api.get('/users', { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.allUsers = response.data
                    //this.showAllStudentsModal = true
                }).catch(error => {
                    //this.notification = error.response.data
                })
            },
            openUserModal(username) {
                this.username = username
                this.showUserModal = true
            },
            closeUserModal() {
                this.showUserModal = false
                this.messages = []
            }
        },
        mounted() {
            this.socket.on('new private message', (data) => {
                this.receiver = data.sender.username
                this.messages.push(data)
                //console.log(this.items[2][1])
            })
        }
    }
</script>