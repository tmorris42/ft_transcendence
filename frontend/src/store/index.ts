import Vue from 'vue';
import Vuex from 'vuex';

import { fetchAvatar } from '@/utils/avatar';

Vue.use(Vuex);

interface State {
  isAuthenticated: boolean;
  username: string | undefined;
  avatar: string | undefined;
  id: string | undefined;
  token: string | undefined;
}

const state: State = {
  isAuthenticated: false,
  username: undefined,
  avatar: undefined,
  id: undefined,
  token: undefined,
};

export default new Vuex.Store({
  state: state,
  getters: {
    username: (state) => state.username,
    isAuthenticated: (state) => state.isAuthenticated,
    avatar: (state) => state.avatar,
    id: (state) => state.id,
    token: (state) => state.token,
  },
  mutations: {
    login(state, payload) {
      state.username = payload.username;
      state.id = payload.id;
      state.isAuthenticated = true;
      state.token = payload.token;
    },
  },
  actions: {
    async getAvatar(context) {
      if (context?.state?.id) {
        context.state.avatar = await fetchAvatar(context.state.id);
      }
    },
  },
  modules: {},
});
