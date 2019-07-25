<template>
    <div id="dashboard">
        <section>
            <div class="col1">
                <div class="class">
                    <h5>Current User: {{ userProfile.username }}</h5>
                    <h5>Role: {{ userProfile.role }}</h5>
                    <a @click="viewAllStudentsWithAPI">View list of all students</a>
                    <div class="search-user">
                        <p style="font-style:italic">Search for a student</p>
                        <form @submit.prevent>
                            <input v-model.trim="student.sid" type="text" placeholder="Enter student id" id="class1" />
                            <button @click="searchStudentWithAPI(student.sid)" :disabled="student.sid == ''" class="button">Search</button>
                        </form>
                    </div>
                    <br><br>
                    <!--<div class="delete-user">
                        <p style="font-style:italic">Delete a student</p>
                        <form @submit.prevent>
                            <input v-model.trim="sid_del" type="text" placeholder="Enter student id" id="class2" />
                            <button @click="deleteStudentWithAPI(sid_del)" :disabled="sid_del == ''" class="button">Delete</button>
                        </form>
                    </div>
                    <br><br>-->
                    <div class="create-class">
                        <p style="font-style:italic">Create a new class</p>
                        <form @submit.prevent>
                            <input v-model.trim="className" type="text" placeholder="Enter name of the class" id="class3" />
                            <button @click="createClassWithAPI(className)" :disabled="className == ''" class="button">Create</button>
                        </form>
                    </div>
                    <br><br>
                    <div class="delete-class">
                        <p style="font-style:italic">Delete a class</p>
                        <form @submit.prevent>
                            <input v-model.trim="cla_del" type="text" placeholder="Enter name of the class" id="class4" />
                            <button @click="deleteClassWithAPI(cla_del)" :disabled="cla_del == ''" class="button">Delete</button>
                        </form>
                    </div>
                    <transition name="fade">
                            <div v-if="notification != ''" class="error-msg">
                                <p>{{ notification }}</p>
                            </div>
                    </transition>
                </div>
            </div>
            <div class="col2">
                <a @click="fetchAllClassesWithAPI">Fetch all classes</a>
                <div v-if="allClasses.length">
                    <div v-for="cla in allClasses" :key="cla._id" class="class">
                        <p>Class {{ cla.name }}</p>
                        <span>Created on: {{ cla.created }}</span>
                        <ul>
                            <li><a @click="openStudentModal(cla._id)">Add or remove students</a></li>
                            <li><a @click="viewAllStudentsInAClassWithAPI(cla._id)">View Student List</a></li>
                        </ul>
                        <br><br><br><br>
                    </div>
                </div>
                <div v-else>
                    <p class="no-results">No classes fetched</p>
                </div>
            </div>
        </section>
        <transition name="fade">
            <div v-if="showStudentModal" class="c-modal">
                <div class="c-container">
                    <a @click="closeStudentModal">X</a>
                    <p>Add a student to the class</p>
                    <form @submit.prevent>
                        <input v-model.trim="sid_add" type="text" placeholder="Enter student id" />
                        <button @click="addStudentToAClassWithAPI(classID,sid_add)" :disabled="sid_add == ''" class="button">Add</button>
                    </form>
                    <br><br><br>
                    <p>Remove a student from the class</p>
                    <form @submit.prevent>
                        <input v-model.trim="sid_remove" type="text" placeholder="Enter student id" />
                        <button @click="removeAStudentFromAClassWithAPI(classID,sid_remove)" :disabled="sid_remove == ''" class="button">Remove</button>
                    </form>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showClassModal" class="p-modal">
                <div class="p-container">
                    <a @click="closeClassModal" class="close">X</a>
                    <div class="post">
                        <a v-if="Object.keys(studentsInClass).length > 1">There are {{Object.keys(studentsInClass).length}} students in this class</a>
                        <a v-else-if="Object.keys(studentsInClass).length == 1">There is only {{Object.keys(studentsInClass).length}} student in this class</a>
                        <a v-else>No students in this class</a>
                    </div>
                    <div v-show="studentsInClass.length" class="comments">
                        <div v-for="student in studentsInClass" :key="student._id" class="comment">

                            <p>Student ID: {{ student }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- all students modal -->
        <transition name="fade">
            <div v-if="showAllStudentsModal" class="p-modal">
                <div class="p-container">
                    <a @click="closeAllStudentsModal" class="close">X</a>
                    <div class="post">
                        <a v-if="Object.keys(allStudents).length > 1">There are {{Object.keys(allStudents).length}} students in total</a>
                        <a v-else>Only {{Object.keys(allStudents).length}} student</a>
                    </div>
                    <div v-show="allStudents.length" class="comments">
                        <div v-for="student in allStudents" :key="student._id" class="comment">
                            <p>Name: {{ student.username }}</p>
                            <p>Student ID: {{ student._id }}</p>
                            <button @click="openConfirmModal(student._id)" :disabled="student._id == ''" class="button">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showGotStudentsModal" class="p-modal">
                <div class="p-container">
                    <a @click="closeGotStudentsModal" class="close">X</a>
                    <div class="comments">
                        <div class="comment">
                            <p>Name: {{ gotStudent.username }}</p>
                            <p>Student ID: {{ gotStudent._id }}</p>
                            <p>Role: {{ gotStudent.role }}</p>
                            <p>Description: {{ gotStudent.description }}</p>
                            <p>Class ID: {{ gotStudent.class }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div v-if="showConfirmModal" class="c-modal">
                <div class="c-container">
                    <a @click="closeConfirmModal">X</a>
                    <p style="text-align: center">Are you sure you want to delete this student?</p>
                    <div style="text-align: center">
                        <button @click="deleteStudentWithAPI(sid_del)" :disabled="sid_del == ''" class="button">YES</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import axios from 'axios'
    const api = axios.create({
        baseURL: 'http://localhost:3000'
    })
    import moment from 'moment'
    import { mapState } from 'vuex'
    import { log, error } from 'util';
    const fb = require('../firebaseConfig.js')
    import * as firebase from 'firebase';
    export default {
        data () {
            return {
                cla: {
                    name: ''
                },
                student: {
                    cid: '',
                    sid: '',
                    name: '',
                    cstudents: 0
                },
                showStudentModal: false,
                showClassModal: false,
                showAllStudentsModal: false,
                showGotStudentsModal: false,
                showConfirmModal: false,
                fullClass: {},
                studentsInClass: [],
                allStudents: [],
                gotStudent: '',
                notification: '',
                sid_del: '',
                allClasses: [],
                className: '',
                cla_del: '',
                classID: '',
                sid_add: '',
                sid_remove: ''
            }
        },
        computed: {
            ...mapState(['userProfile', 'currentUser', 'classes'])
        },
        methods: {
            createClass () {
                fb.classesCollection.add({
                    createdOn: new Date(),
                    name: this.cla.name,
                    countStudent: 0,
                    students: []
                }).then(ref => {
                    this.cla.name = ''
                }).catch(err => {
                    console.log(err)
                })
            },
            openStudentModal (classID) {
                this.classID = classID
                //this.student.cstudents = cla.countStudent
                this.showStudentModal = true
            },
            closeStudentModal () {
                this.student.cid = ''
                this.student.name = ''
                this.showStudentModal = false
            },
            addStudent () {
                let cid = this.student.cid
                let cstudents = this.student.cstudents
                var studentRef = fb.studentsCollection.where('sid', '==', this.student.sid)
                var exsited
                var refID
                var getStudent = studentRef.get().then(docs => {
                    if (docs.empty) {
                        exsited = false
                    }else {
                        exsited = true
                        refID = docs.docs[0].id
                    }
                }).catch(err => {
                    console.log('Error getting document', err)
                })
                var getUser = fb.usersCollection.where('uid', '==', this.student.sid).get().then(docs => {
                    if (docs.empty) {
                        console.log("No user with that id")
                    }else if (exsited) {
                            fb.studentsCollection.doc(refID).set({
                            name: docs.docs[0].get('name'),
                            cid: cid,
                            sid: docs.docs[0].get('uid')
                        }).then(doc => {
                            fb.classesCollection.doc(cid).update({
                                students: firebase.firestore.FieldValue.arrayUnion(docs.docs[0].data()),
                                countStudent: cstudents + 1
                            }).then(() => {
                                this.closeStudentModal()
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                    }else {
                        fb.studentsCollection.add({
                            name: docs.docs[0].get('name'),
                            cid: cid,
                            sid: docs.docs[0].get('uid')
                        }).then(doc => {
                            fb.classesCollection.doc(cid).update({
                                students: firebase.firestore.FieldValue.arrayUnion(docs.docs[0].data()),
                                countStudent: cstudents + 1
                            }).then(() => {
                                this.closeStudentModal()
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
            },
            viewClass (cla) {
                fb.classesCollection.where('name', '==', cla.name).get().then(docs => {
                    let studentsArray = []
                    Array.from(docs.docs[0]).forEach(element => {
                        let stu = element.data()
                        studentsArray.push(stu)
                    })

                    this.studentsInClass = studentsArray
                    this.fullClass = cla
                    this.showClassModal = true
                })
            },
            closeClassModal () {
                this.studentsInClass = []
                this.showClassModal = false
            },
            viewAllStudents () {
                fb.studentsCollection.get().then(docs => {
                    let sArray = []

                    docs.forEach(doc => {
                        let stu = doc.data()
                        stu.id = doc.id
                        sArray.push(stu)
                    })

                    this.allStudents = sArray
                    this.showAllStudentsModal = true
                }).catch(err => {
                    console.log(err)
                })
            },
            clearNoti () {
                this.notification = ''
            },
            closeAllStudentsModal () {
                this.allStudents = []
                this.showAllStudentsModal = false
            },
            closeGotStudentsModal () {
                this.gotStudent = ''
                this.showGotStudentsModal = false
            },
            testGet() {
                var docRef = fb.usersCollection.doc("CbQFcawEEPVsbi8v0QCS8dJKn1K3")
                docRef.get().then(function(doc) {
                    if (doc.exists) {
                        console.log("Document data: ", doc.data())
                    }else {
                        console.log("No such document!");
                    }
                }).catch(function(err) {
                    console.log("Error getting document: ", error);
                })
            },
            viewAllStudentsWithAPI () {
                api.get('/users', { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.allStudents = response.data
                    this.showAllStudentsModal = true
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            searchStudentWithAPI (sid) {
                this.clearNoti()
                api.get('/users/' + sid, { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.gotStudent = response.data
                    this.showGotStudentsModal = true
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            deleteStudentWithAPI (sid) {
                this.clearNoti()
                api.delete('/users/' + sid, { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.notification = response.data
                    this.closeConfirmModal()
                    this.viewAllStudentsWithAPI()
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            fetchAllClassesWithAPI () {
                this.clearNoti()
                api.get('/classes', { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    if (response.data == 'Literally no classes found') {
                        this.allClasses = []
                    }else{
                        this.allClasses = response.data
                    }
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            createClassWithAPI (name) {
                this.clearNoti()
                api.post('/classes', {name}, { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.notification = response.data
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            deleteClassWithAPI (name) {
                this.clearNoti()
                api.delete('/classes', {data: {name: name}, 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.notification = response.data
                    //this.fetchAllClassesWithAPI()
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            viewAllStudentsInAClassWithAPI (classID) {
                this.clearNoti()
                api.get('/classes/' + classID, { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.studentsInClass = response.data.students
                    this.showClassModal = true
                })
            },
            addStudentToAClassWithAPI (classID, userID) {
                this.clearNoti()
                api.post('/classes/students', {classID, userID}, { 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.notification = response.data
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            removeAStudentFromAClassWithAPI (classID, userID) {
                this.clearNoti()
                api.delete('/classes/students', {data: {classID: classID, userID: userID}, 'headers': { 'Authorization': this.$cookie.get('token')}}).then(response => {
                    this.notification = response.data
                }).catch(error => {
                    this.notification = error.response.data
                })
            },
            openConfirmModal (sid) {
                this.sid_del = sid
                this.showConfirmModal = true
            },
            closeConfirmModal () {
                this.sid_del = '',
                this.showConfirmModal = false
            }
        },
        filters: {
            formatDate (val) {
                if (!val) {
                    return 'Unknown date'
                }
                let date = val.toDate()
                return date
            }
        }
    }
</script>