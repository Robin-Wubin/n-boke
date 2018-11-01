<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="login_col">
                    <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="login_form">
                        <b-form-group id="login_username"
                                      label="用户名:"
                                      label-for="input_user_name">
                            <b-form-input id="input_user_name"
                                          type="text"
                                          v-model="form.name"
                                          required
                                          placeholder="输入你的登录名">
                            </b-form-input>
                        </b-form-group>
                        <b-form-group id="login_password"
                                      label="密码:"
                                      label-for="input_password">
                            <b-form-input id="input_password"
                                          type="password"
                                          v-model="form.password"
                                          required
                                          placeholder="输入你的密码">
                            </b-form-input>
                        </b-form-group>
                        <b-button type="submit" class="float-right" variant="primary">登录</b-button>
                        <b-button type="reset" variant="danger">重置</b-button>
                    </b-form>
                </b-col>
            </b-row>
            <!-- Content here -->
        </b-container>
    </div>
</template>

<script>
    export default {
        name: "index",
        data () {
            return {
                form: {
                    name: '',
                    password: ''
                },
                show: true
            }
        },
        methods: {
            onSubmit (evt) {
                evt.preventDefault();
                let _that = this;
                this.axios.post('/api/admin/login', this.form).then(res=>{
                    _that.$store.dispatch('setAdminInfo').then(()=>{
                        _that.$router.push("/admin");
                    });
                }).catch(res=>{
                    console.error(res);
                });
            },
            onReset (evt) {
                evt.preventDefault();
                /* Reset our form values */
                this.form.name = '';
                this.form.password = '';
                /* Trick to reset/clear native browser form validation state */
                this.show = false;
                this.$nextTick(() => { this.show = true });
            }
        }
    }
</script>

<style scoped>
    .login_col{
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .login_form{
        width: 375px;
        margin: 50px 0;
    }
</style>