<template>
    <b-jumbotron border-variant="dark"  header="Install N-Boke" lead=" Set Up Your MongoDB" class="pad">
        <hr class="my-4">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="exampleInputGroup1"
                          label="Host/Port:"
                          label-for="url">
                <b-form-input id="url"
                              type="text"
                              v-model="form.url"
                              required
                              placeholder="Enter Host/Port. exp:db.mongo.com:27017">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup2"
                          label="Database Name:"
                          label-for="dbName">
                <b-form-input id="dbName"
                              type="text"
                              v-model="form.db"
                              required
                              placeholder="Enter Database Name">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup3"
                          label="Username:"
                          label-for="Username">
                <b-form-input id="Username"
                              type="text"
                              v-model="form.username"
                              required
                              placeholder="Enter Username">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup4"
                          label="Password:"
                          label-for="Password">
                <b-form-input id="Password"
                              type="password"
                              v-model="form.password"
                              required
                              placeholder="Enter Password">
                </b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
    </b-jumbotron>
</template>

<script>
    export default {
        name: "mongo"
        ,data () {
            return {
                form: {
                    url: '',
                    db: '',
                    username: '',
                    password: '',
                },
                show: true
            }
        },
        methods: {
            onSubmit (evt) {
                evt.preventDefault();
                this.axios.post('/api/install/mongodb', this.form).then(res=>{
                    console.log(res);
                }).catch(res=>{
                    console.error(res);
                });
            },
            onReset (evt) {
                evt.preventDefault();
                /* Reset our form values */
                this.form.url = '';
                this.form.db = '';
                this.form.username = '';
                this.form.password = '';
                /* Trick to reset/clear native browser form validation state */
                this.show = false;
                this.$nextTick(() => { this.show = true });
            }
        }
    }
</script>

<style scoped>

    .pad{
        flex-grow: 1;
        margin: 40px;
    }
</style>