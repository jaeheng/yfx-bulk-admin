<template>
    <div class="layout">
        <el-container>
            <el-aside :width="!isCollapse ? '220px' : '64px'" class="page-side">
                <router-link to="/dashboard" class="logo">
                    <img src="@img/logo.svg" alt="logo" />
                    <span v-if="!isCollapse">BULK后台管理系统</span>
                </router-link>

                <el-menu
                    :default-active="activeIndex"
                    :class="isCollapse ? 'is-collapse' : ''"
                    :collapse="isCollapse"
                    background-color="transparent"
                    style="border-right: 0"
                    text-color="#fff"
                    active-text-color="#fff"
                    router
                >
                    <template v-for="(v, index) in MainMenus" :key="v.path">
                        <el-menu-item :index="v.path" v-if="!v.children">
                            <el-icon>
                                <i class="iconfont" :class="v.meta.icon"></i>
                            </el-icon>
                            <template #title>{{ v.meta.title }}</template>
                        </el-menu-item>

                        <el-sub-menu :index="'sub' + index" v-else>
                            <template #title>
                                <el-icon>
                                    <i class="iconfont" :class="v.meta.icon"></i>
                                </el-icon>
                                <span>{{ v.meta.title }}</span>
                            </template>
                            <el-menu-item
                                :index="child.path"
                                v-for="child in v.children"
                                :key="child.path"
                            >
                                {{ child.meta.title }}
                            </el-menu-item>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="trigger">
                        <i
                            class="iconfont icon-shousuo"
                            @click="isCollapse = true"
                            v-if="!isCollapse"
                        ></i>
                        <i class="iconfont icon-zhankai" @click="isCollapse = false" v-else></i>
                    </div>
                    <div class="menu">
                        <el-dropdown trigger="hover" class="dropdown" @command="handleCommand">
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
                </el-header>
                <el-main class="main" :class="$route.meta.mainClass || ''">
                    <slot></slot>
                </el-main>
            </el-container>
        </el-container>
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

.trigger {
    .iconfont {
        font-size: 20px;
        cursor: pointer;
    }
}

.el-header {
    background: #fff;
    box-shadow: var(--el-box-shadow-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.page-side {
    background: #2a2e3d;
    color: #fff;

    .logo {
        padding: 15px;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            height: 30px;
            margin-right: 10px;
        }
    }
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import { MainMenus } from '@/router/app'
import { Location } from '@element-plus/icons-vue'

export default {
    components: { Location },
    data() {
        return {
            activeIndex: this.$route.fullPath,
            isCollapse: false,
            MainMenus
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
            this.$util.get(this.api.logout, {}, (resp) => {
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
