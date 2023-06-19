<script>
export default {
  props: {
    legalTemplates: Array,
    legalTemplate: Object,
    tags: Array,
    displayClearFilters: Boolean,
  },

  data: function () {
    return {
      curIndex: 0,
      bntStyleNormal: { "background-color": "red" },
      bntStyleChanged: { "background-color": "red" },
      userTag: "",
    };
  },

  methods: {
    readAll: function () {
      this.$emit("emit-read-all");
    },
    openLegalTemplate: function (index) {
      this.$emit("emit-get-template", this.legalTemplates[index].id);
      this.$emit("update:legalTemplate", this.legalTemplates[index]);
      this.curIndex = index;
      this.$emit("emit-get-expectations");
    },
    createLegalTemplate: function () {
      this.$emit("emit-create-legal-template");
    },
    saveLegalTemplates: function () {
      this.$emit("emit-save-legal-template");
    },
    saveLegalTemplate: function (index) {
      this.$emit("emit-save-legal-template");
    },
    searchByUserTag: function (userTag) {
      this.$emit("emit-search-by-user-tag", this.userTag);
    },
    searchByTag: function (tag) {
      this.$emit("emit-search-by-tag", tag);
    },
    rootLogoutRequest: function () {
      this.$emit("emit-root-logout-request");
    },
  },
  watch: {
    userTag: {
      handler(newUserTag) {
        this.tags = this.tags.find(function (tagInTags) {
          return tagInTags.includes(newUserTag);
        });
      },
    },
  },
  mounted: function () {
    // collapse sidebar
    $(".btn_collapse").on("click", function () {
      $("#app").toggleClass("app_collapsed");
    });
  },
};
</script>
<template>
  <div class="cell cell_tpls">
    <button class="btn_collapse" title="Згорнути">
      <i class="fas fa-angle-double-left"></i>
    </button>
    <h2>
      Перелік шаблонів<button
        @click="createLegalTemplate()"
        class="btn_create"
        title="Створити новий шаблон"
      >
        <i class="fas fa-plus"></i>
      </button>
      <button
        @click="saveLegalTemplates()"
        class="btn_save_all"
        title="Зберегти всі шаблони"
      >
        <i class="fas fa-save"></i>
      </button>
    </h2>
    <ul class="list_tpl">
      <li v-for="(oneTemplate, index) in legalTemplates">
        <button
          @click="openLegalTemplate(index)"
          class="btn_tpl_name"
          title="Редагувати шаблон"
        >
          {{ oneTemplate.title }}</button
        ><button @click="saveLegalTemplate" class="btn_save" title="Зберегти">
          <i class="fas fa-save"></i>
        </button>
      </li>
    </ul>
    <div class="tpl_tags_wrap">
      <div class="field">
        <input type="text" v-model="userTag" placeholder="Шукати тег" />
      </div>
      <div class="tpl_tags_list">
        <button
          v-for="(tag, index) in tags"
          @click="searchByTag(tag)"
          class="tpl_tag_single"
        >
          {{ tag }}
        </button>
        <button
          type="button"
          class="btn btn-danger"
          v-if="displayClearFilters"
          @click="readAll"
        >
          Скинути всі фільтри
        </button>
      </div>
    </div>
    <button type="button" class="btn btn-danger" @click="rootLogoutRequest">
      Logout
    </button>
  </div>
</template>
