<template>
    <div>
        <div class="main_container">
            <b-breadcrumb class="bread_head" :items="breadcrumb"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "dashboard",
        data () {
            return {
                breadcrumb: [{
                    text: 'Dashboard',
                    href: '/admin/app/dashboard'
                }]
            }
        }
    }
</script>

<style scoped>

</style>