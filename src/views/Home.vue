<template>
    <div>
        <el-button @click="loginout" type="info">退出</el-button>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {

        };
    },
    methods: {
        loginout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    },
    components: {

    },
};
</script>

<style scoped lang="less">

</style>
