<template>
  <div class="card mt-3">
      <div class="card-body">
          <div class="card-title">
              <h3>Class ID: {{this.userProfile.class}}</h3>
              <hr>
          </div>
          <div v-for="message in messages" class="p-containter">
                <!--<p><span style="font-weight: bold">Message:</span> {{ message.message }}, <span style="font-weight: bold">sent by:</span> <span style="font-style: italic">{{ message.user.username }}</span></p>-->
                <p><span style="font-weight: bold">{{message.user.username}}</span>: <span style="word-wrap: break-word">{{message.message}}</span> <span style="font-style:italic;float:right">{{message.time}}</span></p>
        </div>
      </div>
      <hr>
      <div class="card-footer">
          <form @submit.prevent="sendMessage">
              <div class="form-group pb-3">
                  <label for="message" style="font-weight:bold">{{userProfile.username}}:</label>
                  <input type="text" v-model="message" class="form-control">
              </div>
              <button type="submit" class="btn btn-success">Send</button>
          </form>
      </div>
  </div>
</template>

<script>
    import io from 'socket.io-client'
    import {mapState} from 'vuex'
    import moment from 'moment'
    export default {
        data () {
            return {
                message: '',
                messages: [],
                socket: io('localhost:3001', {query: 'auth_token=' + this.$cookie.get('token')})
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            sendMessage() {

                this.socket.emit('SEND_MESSAGE', {
                    user: this.userProfile,
                    message: this.message,
                    time: moment().format('MMMM Do YYYY, h:mm:ss a')
                })
                this.message = ''
            }
        },
        created () {
            this.socket.emit('join class', {class: this.userProfile.class})
        },
        mounted() {
            this.socket.on('MESSAGE', (data) => {
                this.messages.push(data)
            })
        },
        filters: {
            formatDate (val) {
                if (!val) {
                    return 'Unknown date'
                }
                let date = moment().startOf(val).fromNow()
                return date
            }
        }
    }
</script>




