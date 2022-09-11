import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from "@/router";
import router from "@/router";
const getDefaultState = () => {
  return {
    token: getToken(),
    //存储用户名
    name: "",
    //存储用户头像
    avatar: "",
    //存储用户菜单权限
    routes: [],
    //存储用户按钮权限
    buttons: [],
    //存储用户角色
    roles: [],
    //对比之后【项目中有异步路由，和服务器返回的信息做对比来确认展示那些路由】
    resultAsyncRoutes: [],
    resultAllRoutes: [],
    flag: true,
  };
};
const state = getDefaultState();
//对吧
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter((e) => {
    if (routes.indexOf(e.name) != -1) {
      if (e.children && e.children.length) {
        e.children = computedAsyncRoutes(e.children, routes);
      }
      return true;
    }
  });
};

const mutations = {
  RESET_STATE: (state) => {
    //重置state
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  //存储用户全部信息
  SET_USERINFO: (state, userInfo) => {
    //存储用户名
    state.name = userInfo.name;
    //存储用户头像
    state.avatar = userInfo.avatar;
    //存储用户菜单权限
    state.routes = userInfo.routes;
    //存储用户按钮权限
    state.buttons = userInfo.buttons;
    //存用户角色
    state.roles = userInfo.roles;
  },
  SET_RESULTASYNCROUTES(state, asyncRoutes) {
    //保存用户当前的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    //计算出（合并）当前用户需要显示的所有路由
    state.resultAllRoutes = constantRoutes.concat(asyncRoutes, anyRoutes);
    //给路由器添加新的路由
    resetRouter();
    router.addRoutes(state.resultAllRoutes);
    state.flag = false;
  },
};

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    console.log(result);
    if ((result.code = 20000 || result.code == 200)) {
      //存储token
      commit("SET_TOKEN", result.data.token);
      setToken(result.data.token);
      return "20000";
    } else {
      return Promise.reject(new Error("faile"));
    }
  },
  // 刷新时重新添加新路由
  getInfo1({ commit, state }, flag1) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(async (response) => {
          //获取用户信息，返回数据包含用户名name，用户头像avatar，routes（返回的标志，不同用户展示不同的菜单）roles用户角色信息
          //buttons按钮权限
          const { data } = response;
          //vuex存储用户全部信息
          commit("SET_USERINFO", data);
          await commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, data.routes)
          );
          if (!data) {
            return reject("Verification failed, please Login again.");
          }
          resolve(data);
          return flag1;
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          //获取用户信息，返回数据包含用户名name，用户头像avatar，routes（返回的标志，不同用户展示不同的菜单）roles用户角色信息
          //buttons按钮权限
          const { data } = response;
          //vuex存储用户全部信息
          commit("SET_USERINFO", data);
          commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, data.routes)
          );
          if (!data) {
            return reject("Verification failed, please Login again.");
          }
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
