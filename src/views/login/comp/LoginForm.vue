<template>
  <el-form :model="ruleForm" :rules="rules" ref="validateForm" class="login-ruleForm">
    <el-form-item prop="username">
      <el-input :placeholder="t('login.username')" v-model="ruleForm.username">
        <template #prefix>
          <icon-user theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        @keyup.enter="handleLogin"
        :placeholder="t('login.password')"
        type="password"
        v-model="ruleForm.password"
      >
        <template #prefix>
          <icon-lock theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model="ruleForm.code"
        auto-complete="off"
        placeholder="验证码"
        style="width: 63%"
        @keyup.enter="handleLogin"
      >
        <template #prefix>
          <icon-protect theme="outline" size="16" fill="#999" />
        </template>
      </el-input>
      <div class="login-code">
        <img :src="codeUrl" @click="getCode" class="login-code-img" />
      </div>
    </el-form-item>
    <el-form-item>
      <div class="login-check">
        <el-checkbox v-model="ruleForm.rememberMe">{{ t('login.rememberPwd') }}</el-checkbox>
        <!-- <el-button text type="primary">{{ t('login.forgotPwd') }}</el-button> -->
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="loading" class="login-btn" round @click="handleLogin">{{
        t('login.loginBtn')
      }}</el-button>
    </el-form-item>
    <!-- <el-divider>{{ t('login.thirdparty') }}</el-divider>
    <el-form-item>
      <div class="login-methods">
        <icon-wechat theme="outline" size="24" fill="#333" />
        <icon-alipay theme="outline" size="24" fill="#333" />
        <icon-github theme="outline" size="24" fill="#333" />
        <icon-twitter theme="outline" size="24" fill="#333" />
        <icon-google theme="outline" size="24" fill="#333" />
      </div>
    </el-form-item> -->
  </el-form>
</template>

<script>
  import { reactive, toRefs, ref, unref, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { getCodeImg, login } from '@/api/login';
  import { useI18n } from 'vue-i18n';
  import Cookies from 'js-cookie';
  import { encrypt, decrypt } from '@/utils/jsencrypt';
  export default {
    setup() {
      const { t } = useI18n();
      const store = useStore();
      const router = useRouter();
      const validateForm = ref(null);
      const codeUrl = ref(null);
      const state = reactive({
        ruleForm: {
          username: '',
          password: '',
          code: '',
          uuid: '',
          rememberMe: false,
        },
        loading: false,
        redirect: undefined,
        rules: {
          username: [{ required: true, message: t('login.rules.username'), trigger: 'blur' }],
          password: [{ required: true, message: t('login.rules.password'), trigger: 'blur' }],
          code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        },
      });

      watch(
        () => router.currentRoute,
        ({ _value }) => {
          const route = _value;
          state.redirect = (route.query && route.query.redirect) || '/';
        },
        {
          immediate: true,
        }
      );

      const getCode = () => {
        getCodeImg().then((res) => {
          codeUrl.value = 'data:image/gif;base64,' + res.img;
          state.ruleForm.uuid = res.uuid;
        });
      };
      const getCookie = () => {
        const username = Cookies.get('username');
        const password = Cookies.get('password');
        const rememberMe = Cookies.get('rememberMe');
        state.ruleForm = {
          username: username === undefined ? state.ruleForm.username : username,
          password: password === undefined ? state.ruleForm.password : decrypt(password),
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        };
      };
      const handleLogin = async () => {
        const form = unref(validateForm);
        if (!form) return;
        await form.validate((valid) => {
          if (valid) {
            state.valid = true;
            state.loading = true;
            if (state.ruleForm.rememberMe) {
              Cookies.set('username', state.ruleForm.username, { expires: 30 });
              Cookies.set('password', encrypt(state.ruleForm.password), { expires: 30 });
              Cookies.set('rememberMe', state.ruleForm.rememberMe, { expires: 30 });
            } else {
              Cookies.remove('username');
              Cookies.remove('password');
              Cookies.remove('rememberMe');
            }
            store
              .dispatch('user/login', state.ruleForm)
              .then(() => {
                const routerPath =
                  state.redirect === '/404' || state.redirect === '/401' ? '/' : state.redirect;
                router.push(routerPath).catch(() => {});
                state.loading = false;
              })
              .catch(() => {
                state.loading = false;
                getCode();
              });
          }
        });
      };

      onMounted(() => {
        getCode();
        getCookie();
      });
      return {
        ...toRefs(state),
        validateForm,
        handleLogin,
        getCode,
        codeUrl,
        t,
      };
    },
  };
</script>
<style lang="scss" scoped>
  .login-ruleForm {
    margin-top: 1rem;
    :deep(.el-input__inner) {
      color: #000;
    }
    :deep(.el-input__prefix) {
      top: 2px;
      padding: 0 4px;
    }
    .login-methods {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
    .login-btn {
      width: 100%;
    }
    .login-check {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-between;
    }
    .login-code {
      width: 34%;
      height: 38px;
      float: right;
      img {
        cursor: pointer;
        vertical-align: middle;
        height: 38px;
        margin-left: 30px;
      }
    }
  }
</style>
