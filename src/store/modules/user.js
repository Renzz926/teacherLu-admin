import { getUserInfo, login } from '@/api/user';
import { getAccessToken, removeAccessToken, setAccessToken } from '@/utils/accessToken';

import { setting } from '@/config/setting';
const { title, tokenName } = setting;
import { resetRouter } from '@/router';

import i18n from '@/locales';
const { global } = i18n;

import { ElMessage, ElNotification } from 'element-plus';

const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
  name: '',
  roles: [],
  token: getAccessToken(),
};

const getters = {
  token: (state) => state.token,
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  roles: (state) => state.roles,
  permissions: (state) => {
    return state.permissions;
  },
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
    setAccessToken(accessToken);
  },
  setUsername(state, username) {
    state.username = username;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setPermissions(state, permissions) {
    state.permissions = permissions;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions;
  },
};
const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions);
  },
  async login({ commit }, userInfo) {
    const res = await login(userInfo);
    const accessToken = res[tokenName];
    if (accessToken) {
      commit('setAccessToken', accessToken);
      const hour = new Date().getHours();
      const thisTime =
        hour < 8
          ? global.t('sayHi.early')
          : hour <= 11
          ? global.t('sayHi.morning')
          : hour <= 13
          ? global.t('sayHi.noon')
          : hour < 18
          ? global.t('sayHi.afternoon')
          : global.t('sayHi.evening');
      ElNotification({
        title: `${thisTime}！`,
        message: `${global.t('notice.msg')}${title}!`,
        type: 'success',
      });
    } else {
      ElMessage.error(`登录接口异常，未正确返回${tokenName}...`);
    }
  },
  async getUserInfo({ commit, state }) {
    const res = await getUserInfo();
    if (res.code !== 200) {
      ElMessage.error('验证失败，请重新登录...');
      return false;
    }
    const user = res.user;
    if (res.roles && user.userName && Array.isArray(res.roles)) {
      commit('SET_ROLES', res.roles);
      commit('SET_PERMISSIONS', res.roles);
      commit('setPermissions', res.roles);
      commit('SET_NAME', user.userName);
      // commit('SET_AVATAR', avatar);
      return res.roles;
    } else {
      ElMessage.error('用户信息接口异常');
      return false;
    }
  },
  async logout({ dispatch }) {
    // await logout(state.accessToken);
    await dispatch('resetAccessToken');
    await resetRouter();
  },
  resetAccessToken({ commit }) {
    commit('setPermissions', []);
    commit('setAccessToken', '');
    removeAccessToken();
  },
};
export default { state, getters, mutations, actions };
