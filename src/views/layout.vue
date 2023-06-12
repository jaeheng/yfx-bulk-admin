<template>
    <div class="layout">
        <div class="menu">
            <router-link to="/dashboard" class="logo">
                <img src="@img/logo-white.png" alt="logo">
                后台管理系统
            </router-link>

            <div class="el-menu-primary">
                <div class="links">
                    <router-link to="/dashboard">控制台</router-link>
                    <router-link to="/accounts">项目管理</router-link>
                    <router-link to="/task">任务管理</router-link>
                    <router-link to="/sets">集合管理</router-link>
                    <router-link to="/tool">工具管理</router-link>
                    <router-link to="/statistic">统计中心</router-link>
                    <router-link to="/system">系统管理</router-link>
                </div>
            </div>

            <el-dropdown trigger="click" class="dropdown" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ userInfo.username }} <i class="iconfont icon-down"></i>
        </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="main" :class="$route.meta.mainClass || ''">
            <router-view></router-view>
        </div>
    </div>
</template>
<style lang="scss">
.layout {
    display: flex;
    flex-direction: column;

    .main {
        flex: 1;
    }
}

.menu {
    background: linear-gradient(90deg, #3672F6, #0090ff, rgba(21, 98, 248, 0.9));
    height: 54px;
    line-height: 54px;
    padding: 0 25px;
    width: 100%;
    box-sizing: border-box;
    color: #fff;
    position: sticky;
    top: 0;
    z-index: 999;
    box-shadow: var(--el-box-shadow-light);

    .logo {
        margin-top: 12px;
        float: left;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: rgba(255, 255, 255, .8);

        img {
            height: 80%;
            margin-right: 10px;
        }
    }

    .dropdown {
        line-height: 1;
        float: right;
        margin-top: 18px;
        color: #fff;
        cursor: pointer;
    }
}

.el-menu-primary {
    display: inline-block;
    margin-left: 50px;
    position: relative;

    .links {
        display: flex;
    }

    a {
        position: relative;
        padding: 0 10px;
        margin: 0 5px;
        font-size: 15px;
        color: hsla(0, 0%, 100%, .7);

        &:after {
            content: '';
            display: block;
            width: 0;
            height: 3px;
            background: #fc3c3c;
            position: absolute;
            left: 50%;
            bottom: -1px;
            transition: all .2s;
            border-radius: 2px;
        }

        &:hover,
        &.router-link-active {
            color: #fff;

            &:after {
                left: 0;
                width: 100%;
            }
        }
    }
}
</style>
<script>
import {mapGetters, mapActions} from 'vuex'

export default {
    data() {
        return {
            activeIndex: this.$route.fullPath
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'user/userInfo'
        })
    },
    methods: {
        ...mapActions({
            setUserInfo: 'user/setUserInfo',
            clearUserInfo: 'user/clearUserInfo'
        }),
        handleCommand(path) {
            if (path === 'logout') {
                this.logout()
            } else {
                this.$router.push(path)
            }
        },
        logout() {
            this.$util.get(this.api.logout, {}, resp => {
                this.clearUserInfo()
                this.$router.push('/')
            })
        }
    },
    mounted() {
        this.setUserInfo()
    }
}
</script>
