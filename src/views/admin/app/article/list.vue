<template>
    <div>
        <b-breadcrumb :items="breadcrumb"/>
    </div>
</template>

<script>
    export default {
        name: "list",
        data () {
            return {
                breadcrumb: [{
                    text: 'Article',
                    href: '/admin/app/article/list'
                }]
            }
        }
    }
</script>

<style scoped>

</style>