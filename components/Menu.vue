<template>
  <transition name="animate">
    <div
      v-if="menu_is_visible"
      class="outer"
    >
      <div
        class="outline"
        @click="close"
      />
      <div class="content">
        <ul class="site-navigation">
          <MenuItem
            v-for="item of menu"
            :id="item.id"
            :key="item.id"
            :name="item.name"
            :slug="item.slug"
            parent-path="/"
            :submenu="item.submenu"
          />
        </ul>

        <button
          class="close-btn"
          type="button"
          @click="close"
        >
          <IconClose />
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import MenuItem from '~/components/MenuItem.vue';
import IconClose from '~/components/icons/IconClose.vue';

export default {
  name: 'Menu',
  components: {
    MenuItem,
    IconClose,
  },
  computed: {
    ...mapState('the_menu', {
      menu: (state) => state.menu,
      menu_is_visible: (state) => state.menu_is_visible,
    }),
  },
  watch: {
    menu_is_visible() {
      this.initEventListener();
    },
  },
  methods: {
    eventPressEsc(event) {
      if (event.keyCode === 27) {
        this.$store.commit('the_menu/TOGGLE_MENU', false);
      }
    },
    initEventListener() {
      if (this.menu_is_visible) {
        document.addEventListener('keydown', this.eventPressEsc);
        document.body.classList.add('_no-scroll');
      } else {
        document.removeEventListener('keydown', this.eventPressEsc);
        document.body.classList.remove('_no-scroll');
      }
    },
    close() {
      this.$store.commit('the_menu/TOGGLE_MENU', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.animate-enter-active {
  transition: all 0.3s;
}
.animate-leave-active {
  transition: all 1.5s;
}
.animate-enter, .animate-leave-to {
  opacity: 0;
}

.outer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
}

.outline {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,0.3);
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: calc(100% - 48px);
  max-width: 480px;
}

.close-btn {
  position: absolute;
  top: 0;
  left: 100%;
  background: transparent;
  outline: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;

  .animate-enter &, .animate-leave-to & {
    transform: translateX(100%);
    opacity: 0;
  }

  &:hover {
    transform: scale(1.15);
  }

  svg {
    width: 32px;
    height: 32px;
    fill: #fff;
  }
}

.site-navigation {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  list-style-type: none;
  padding-left: 0;
  background: rgb(255, 255, 255);


  .animate-enter-active &, .animate-leave-active & {
    transition: all 0.3s;
  }
  .animate-enter &, .animate-leave-to & {
    transform: translateX(-100%);
  }
}
</style>
