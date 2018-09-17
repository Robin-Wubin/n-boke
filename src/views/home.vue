<template>
    <div class="bg-gray">
        <b-navbar toggleable="md" variant="faded" type="light" class="n_boke_header">
            <b-container>
                <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
                <b-navbar-brand href="#">NBoke</b-navbar-brand>
                <b-collapse is-nav id="nav_collapse">
                    <b-navbar-nav>
                        <b-nav-item href="#">Link</b-nav-item>
                        <b-nav-item href="#" disabled>Disabled</b-nav-item>
                    </b-navbar-nav>

                    <!-- Right aligned nav items -->
                    <b-navbar-nav class="ml-auto">

                        <b-nav-form>
                            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
                            <b-button size="sm" class="my-2 my-sm-0" type="submit"><i class="fa fa-search"></i></b-button>
                        </b-nav-form>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <b-container>
            <!-- Stack the columns on mobile by making one full-width and the other half-width -->
            <b-row>
                <router-view class="view"></router-view>
            </b-row>
        </b-container>
    </div>
</template>

<script>
export default {
}
</script>

<style>
    .n_boke_header{
        box-shadow: 0 1px 5px rgba(0,0,0,.1);
        background: #FFF;
    }
    .bg-gray{
        background-color: #f7f7f7!important;
    }
</style>