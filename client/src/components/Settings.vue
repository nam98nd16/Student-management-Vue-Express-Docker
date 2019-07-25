<template>
    <section id="settings">
        <div class="col1">
            <h3>Settings</h3>
            <p>Username: {{ userProfile.username }}</p>
            <p>Role: {{ userProfile.role }}</p>
            <p>Description: {{ userProfile.description }}</p>
            <transition name="fade">
                <p v-if="showSuccess" class="success">profile updated</p>
            </transition>

            <form @submit.prevent>
                <!--<label for="name">Name</label>
                <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />-->

                <label for="description">Update description</label>
                <input v-model.trim="description" type="text" :placeholder="userProfile.description" id="description" />

                <button @click="updateProfileWithAPI(description)" class="button">Update Profile</button>
            </form>
        </div>
    </section>
</template>

<script>
    import axios from 'axios'
    const api = axios.create({
        baseURL: 'http://localhost:3000'
    })
    import {mapState} from 'vuex'
import { error } from 'util';
    export default {
        data () {
            return {
                name: '',
                title: '',
                description: '',
                showSuccess: false
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            updateProfile () {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title
                })

                this.name = ''
                this.title = ''

                this.showSuccess = true

                setTimeout(() => {
                    this.showSuccess = false
                }, 2000)
            },
            updateProfileWithAPI (description) {
                api.put('/users/' + this.$store.state.userProfile._id, {description}, { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.$store.dispatch('fetchUserProfile')
                    this.showSuccess = true
                    setTimeout(() => {
                    this.showSuccess = false
                }, 2000)
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    }
</script>