import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const fb = require('./firebaseConfig.js')

fb.auth.onAuthStateChanged(user => {
    if (user) {
        store.commit('setCurrentUser', user)
        store.dispatch('fetchUserProfile')

        fb.usersCollection.doc(user.uid).onSnapshot(doc => {
            store.commit('setUserProfile', doc.data())
        })

        fb.classesCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
            let classesArray = []

            querySnapshot.forEach(doc => {
                let cla = doc.data()
                cla.id = doc.id
                classesArray.push(cla)
            })
            store.commit('setClasses', classesArray)
        })
    }
})

import AuthApi from '@/services/AuthApi'
import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:3000'
})
import { stat } from 'fs';


export const store = new Vuex.Store({
    state: {
        currentUser: null,
        userProfile: {},
        classes: []
    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null)
            commit('setUserProfile', null)
            commit('setClasses', null)
        },
        fetchUserProfile({ commit, state}) {
            api.get('users/' + state.currentUser._id, { 'headers': { 'Authorization': Vue.cookie.get('token')}}).then(res => {
                commit('setUserProfile', res.data)
            })
        },
        updateProfile({ commit, state}, data) {
            let name = data.name
            let title = data.title

            fb.usersCollection.doc(state.currentUser.uid).update({ name, title}).then(user => {
                fb.studentsCollection.where('sid', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.studentsCollection.doc(doc.id).update({
                            name: name
                        })
                    })
                })
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setClasses(state, val) {
            if (val) {
                state.classes = val
            }else {
                state.classes = []
            }
        }
    }
})