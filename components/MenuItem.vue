<template>
  <li
    class="site-navigation__item"
    :class="menu_class"
  >
    <a
      class="site-navigation__link"
      :class="menu_class"
      :href="path"
      @click="expand"
    >
      <span class="site-navigation__text">{{ name }}</span>
      <span
        v-if="show_submenu"
        class="icon-close"
      ><IconClose /></span>
    </a>

    <transition name="animate">
      <ul
        v-if="show_submenu"
        class="site-navigation__submenu"
        :class="menu_class"
      >
        <MenuItem
          class="_alternative"
          :id="id"
          name="Перейти в раздел"
          :parent-path="path"
        />
        <MenuItem
          v-for="item of submenu"
          :id="item.id"
          :key="item.id"
          :name="item.name"
          :slug="item.slug"
          :submenu="item.submenu"
          :parent-path="path"
          :level="level + 1"
          :parents-ids="thread_ids"
        />
      </ul>
    </transition>
  </li>
</template>

<script>
import { mapState } from 'vuex';
import IconClose from '~/components/icons/IconClose.vue';

const DEPTH = 2; // From 0.

export default {
  name: 'MenuItem',
  components: {
    IconClose,
  },
  props: {
    id: {
      type: [String, Number],
      default() {
        return null;
      },
    },
    name: {
      type: String,
      default() {
        return '[No name]';
      },
    },
    slug: {
      type: String,
      default() {
        return '';
      },
    },
    submenu: {
      type: Array,
      default() {
        return null;
      },
    },
    parentPath: {
      type: String,
      default() {
        return '';
      },
    },
    level: {
      type: Number,
      default() {
        return 0;
      },
    },
    parentsIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapState('the_menu', {
      menu_is_visible: (state) => state.menu_is_visible,
      expanded_item: (state) => state.expanded_item,
      expanded_items: (state) => state.expanded_items,
    }),
    path() {
      return this.slug
        ? `${this.parentPath}${this.slug}/`
        : this.parentPath;
    },
    thread_ids() {
      return [...this.parentsIds, this.id];
    },
    has_submenu() {
      return this.level < DEPTH
        && Array.isArray(this.submenu) && this.submenu.length > 0;
    },
    is_expanded() {
      return this.expanded_items.includes(this.id)
        || this.expanded_item === this.id;
    },
    show_submenu() {
      return this.has_submenu && this.is_expanded;
    },
    menu_class() {
      return {
        _collapsed: this.has_submenu && !this.is_expanded,
        _expanded: this.show_submenu,
      };
    },
  },
  methods: {
    expand(event) {
      if (!this.has_submenu) {
        return false;
      }
      event.preventDefault();

      let item;
      let items;

      if (!this.is_expanded) {
        // Expand.
        item = this.id;
        items = this.thread_ids;
      } else if (Array.isArray(this.parentsIds) && this.parentsIds.length > 0) {
        // Collapse parent.
        item = this.parentsIds[this.parentsIds.length - 1];
        items = this.parentsIds;
      } else {
        // Collapse all.
        item = null;
        items = [];
      }

      this.$store.commit('the_menu/SET_EXPANDED_ITEM', item);
      this.$store.commit('the_menu/SET_EXPANDED_ITEMS', items);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.site-navigation {
  &__item {
    display: block;
    width: 100%;
    position: relative;
    color: #333;
    overflow: hidden;

    &._alternative {
      font-style: italic;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    width: 100%;
    color: inherit;
    padding: .75rem 1rem;
    z-index: 2;
    transition: all 0.3s;

    &:hover,
    &:active {
      background-color: rgb(130, 0, 255);
      color: rgb(255, 255, 255);
    }

    &._expanded {
      color: $color_expanded_text;

      &:hover,
      &:active {
        background-color: transparent;

        .icon-close {
          transform: scale(1.15);

          svg {
            fill: rgb(130, 0, 255);
          }
        }
      }
    }
  }

  &__text {
    flex: 1 1 auto;
  }

  .icon-close {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: all 0.3s;

    svg {
      fill: rgb(102, 102, 102);
    }
  }

  &__submenu {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 0 0 1rem;
    padding: 0;
    background: $color_expanded_bg;
    border-top: solid 2px $color_expanded_border;
    border-bottom: solid 1px $color_expanded_border;
    box-shadow: inset 7px 0 9px -7px rgba(0,0,0,0.2);
    z-index: 1;
  }
}

.animate-enter-active {
  transition: transform 0.3s ease,
              opacity 0.15s ease 0.15s;
}
.animate-leave-active {
  transition: transform 0.3s ease 0.1s,
              opacity 0.2s ease;
}
.animate-enter, .animate-leave-to {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}
</style>
