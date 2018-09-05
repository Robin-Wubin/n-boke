<template>
    <b-jumbotron border-variant="dark"  header="Install N-Boke" lead=" Set Up Your Admin Account" class="pad">
        <hr class="my-4">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="exampleInputGroup1"
                          label="User Name:"
                          label-for="user_name">
                <b-form-input id="user_name"
                              type="text"
                              v-model="form.name"
                              required
                              placeholder="Enter Your User Name">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup4"
                          label="Password:"
                          label-for="Password">
                <b-form-input id="Password"
                              type="password"
                              v-model="form.password"
                              required
                              placeholder="Enter Your Password">
                </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup4"
                          label="Confirm Password:"
                          label-for="cPassword">
                <b-form-input id="cPassword"
                              type="password"
                              v-model="form.confirm_password"
                              required
                              placeholder="Please Confirm Your Password">
                </b-form-input>
            </b-form-group>
            <div>
                <b-button type="submit" class="float-right" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
            </div>
        </b-form>
    </b-jumbotron>
</template>

<script>
    export default {
        name: "mongo"
        ,data () {
            return {
                form: {
                    name: '',
                    password: '',
                    confirm_password: ''
                },
                show: true
            }
        },
        methods: {
            onSubmit (evt) {
                evt.preventDefault();
                let _that = this;
                this.axios.post('/api/install/admin', this.form).then(res=>{
                    _that.$router.push("/admin");
                }).catch(res=>{
                    console.error(res);
                });
            },
            onReset (evt) {
                evt.preventDefault();
                /* Reset our form values */
                this.form.name = '';
                this.form.password = '';
                this.form.confirm_password = '';
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