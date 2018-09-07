<template>
    <div>
        <b-breadcrumb :items="breadcrumb"/>
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