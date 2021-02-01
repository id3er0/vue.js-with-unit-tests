import Vue from 'vue';

export default {
  namespaced: true,
  state() {
    return {
      menu: [],
      menu_is_visible: false,
      expanded_item: null,
      expanded_items: [],
    };
  },
  mutations: {
    SET_MENU(state, menu) {
      Vue.set(state, 'menu', menu);
    },
    TOGGLE_MENU(state, value) {
      if (typeof value === 'undefined') {
        value = !state.menu_is_visible;
      }
      Vue.set(state, 'menu_is_visible', value);
      if (value === false) {
        Vue.set(state, 'expanded_item', null);
        Vue.set(state, 'expanded_items', []);
      }
    },
    SET_EXPANDED_ITEM(state, value) {
      if (typeof value === 'undefined') {
        value = null;
      }
      Vue.set(state, 'expanded_item', value);
    },
    SET_EXPANDED_ITEMS(state, value) {
      if (!Array.isArray(value)) {
        value = [];
      }
      Vue.set(state, 'expanded_items', value);
    },
  },
};
