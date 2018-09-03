<template>
    <b-container>
        <b-row>
            <b-jumbotron header="Bootstrap Vue" lead="Bootstrap 4 Components for Vue.js 2" class="pad">
                <p>For more information visit website</p>
                <b-btn variant="primary" href="#">More Info</b-btn>
            </b-jumbotron>
        </b-row>
        <!-- Stack the columns on mobile by making one full-width and the other half-width -->
        <b-row>
            <router-view class="view"></router-view>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>
.pad{
    flex-grow: 1;
    margin: 40px;
}
</style>