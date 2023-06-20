export default {
  data: function () {
    return {
      newTag: "",
      newExpectation: "",
      newIntent: "",
      headers: [],
      footers: [],
      applications: [],
    };
  },
  props: {
    expectations: Array,
    expectationsDict: Object,
    legalTemplate: Object,
    legalTemplates: Array,
    legalTemplateDescription: Object,
    newExpectationActive: Boolean,
    changed: Boolean,
    createdExpectation: Object,
  },
  watch: {
    legalTemplate: {
      handler(newT, oldT) {
        if (oldT.id && newT.id == oldT.id) {
          //real edit
          if (!newT.changed) {
            newT.changed = true;
            this.$emit("update:changed", true);
            this.$emit("update:legalTemplates", this.legalTemplates);
          }
        }
      },
      deep: true,
    },
  },

  template: `
          <div class="cell cell_tpl">
              <div class="tpl_heading">
                  <h2>
                      Шаблон {{legalTemplate.title}}<span>{{legalTemplate.type}}</span> <button class="btn_edit" title="Редагувати"><i class="fas fa-pen"></i></button>
                      <button @click="saveLegalTemplate" class="btn_save" title="Зберегти"><i class="fas fa-save"></i></button>
                  </h2>
                  <ul>
                      <li>Теги:</li>
                      <li v-for="(tag, tagIndex) in legalTemplate.tags"><button @click="searchByTag(tag)" title="Шукати за тегом" class="tpl_tag_single">{{ tag }}</button></li>
                  </ul>
              </div>
              <div class="tpl_headings_holder"><a href="#tpl_tab_pug" class="active">Редагування PUG</a> <a href="#tpl_tab_preview">Попередній перегляд</a> <a href="#tpl_tab_main" class="tpl_head_main">Основні значення</a></div>
              <div class="tpl_body_holder">
                  <div class="tpl_body" id="tpl_tab_main">
                      <span class="tpl_id">{{ legalTemplateDescription.id }}: {{ legalTemplate.id }}</span>
                      <div class="tpl_name_type">
                          <div class="field"><label>{{ legalTemplateDescription.title }}:</label> <input type="text" v-model="legalTemplate.title" /></div>
                          <div class="field"><label>{{ legalTemplateDescription.description }}:</label> <input type="text" v-model="legalTemplate.description" /></div>
                          <div class="field tpl_dd_holder">
                              <label>{{ legalTemplateDescription.type }}:</label>
                              <div class="tpl_dd_button"><i class="fas fa-chevron-down"></i></div>
                              <select v-model="legalTemplate.type">
                                  <option>full</option>
                                  <option>header</option>
                                  <option>body</option>
                                  <option>footer</option>
                                  <option>applications</option>
                              </select>
                          </div>
                          <div class="field tpl_dd_holder">
                              <label>{{ legalTemplateDescription.action_type }}:</label>
                              <div class="tpl_dd_button"><i class="fas fa-chevron-down"></i></div>
                              <select v-model="legalTemplate.action_type">
                                  <option>SendUPPDoc</option>
                                  <option>SendLastAuthorityDocument</option>
                                  <option>SendDPPDoc</option>
                                  <option>SendFirstClaim</option>
                                  <option>Another</option>
                              </select>
                          </div>
                      </div>
                      <div class="tpl_body_holder" v-if='legalTemplate.type==="body"'>
                          <div class="field tpl_dd_holder">
                              <label>{{ legalTemplateDescription.header }}:</label>
                              <div class="tpl_dd_button"><i class="fas fa-chevron-down"></i></div>
                              <select v-model="legalTemplate.header">
                                  <option v-for="header in headers" :value="header.id"> {{ header.description}} </option>
                              </select>
                          </div>
                          <div class="field tpl_dd_holder">
                              <label>{{ legalTemplateDescription.footer }}:</label>
                              <div class="tpl_dd_button"><i class="fas fa-chevron-down"></i></div>
                              <select v-model="legalTemplate.footer">
                                  <option v-for="footer in footers" :value="footer.id"> {{ footer.description}} </option>
                              </select>
                          </div>
                          <div class="field tpl_dd_holder">
                              <label>{{ legalTemplateDescription.application }}:</label>
                              <div class="tpl_dd_button"><i class="fas fa-chevron-down"></i></div>
                              <select v-model="legalTemplate.application">
                                  <option v-for="application in applications" :value="application.id"> {{ application.description}} </option>
                              </select>
                          </div>
                      </div>
                      <div class="tpl_tag_field">
                          <div class="field">
                              <label>Додати тег:</label><input type="text" v-model="newTag" /> <button @click="addTemplateTag" title="Додати тег"><i class="fas fa-plus"></i></button>
                          </div>
                      </div>
                      <div class="tpl_tags">
                          <ul>
                              <li v-for="(tag, tagIndex) in legalTemplate.tags">
                                  <button @click="searchByTag(tag)" title="Шукати за тегом" class="tpl_tag_single">{{ tag }}</button>
                                  <button @click="deleteTag(tagIndex)" title="Видалити тег" class="tpl_tag_delete"><i class="fas fa-trash-alt"></i></button>
                              </li>
                          </ul>
                      </div>
                      <div class="tpl_expectations" style="border: 2px solid black;">
                          <label>{{ legalTemplateDescription.expectations }}:</label>
                          <ul>
                              <li v-for="(expectation, expectationIndex) in legalTemplate.expectations"><span>> {{ expectationsDict[expectation] }} </span><button @click="deleteExpectation(expectationIndex)">Видалити</button></li>
                          </ul>
                          <form v-if="!newExpectationActive">
                              <label>Додати очікування:</label>
                              <select v-model="newExpectation" style="width: max-content;">
                                  <option v-for="expectation in expectations" :value="expectation.name">{{ expectation.displayName }}</option>
                                  <option value="newExpectation">Нове очікування</option>
                              </select>
                          </form>
                          <form v-else>
                              <p><label>Введіть назву очікування</label> <input required type="text" v-model="createdExpectation.name" /></p>
                              <p><label>Введіть короткий опис</label> <input required type="text" v-model="createdExpectation.displayName" /></p>
                              <p><label>Введіть повний опис</label> <input required type="text" v-model="createdExpectation.description" /></p>
                          </form>
                          <button v-if="newExpectationActive" @click="hideNewExpectation">Назад</button> <button @click="addTemplateExpectation" title="Додати очікування"><i class="fas fa-plus"></i></button>
                      </div>
                      <div class="tpl_intents" style="border: 2px solid black;">
                          <label>{{ legalTemplateDescription.intents }}:</label>
                          <ul>
                              <li v-for="(intent, intentIndex) in legalTemplate.intents"><span>> {{ expectationsDict[intent] }} </span><button @click="deleteIntent(intentIndex)">Видалити</button></li>
                          </ul>
                          <label>Додати причину:</label>
                          <select v-model="newIntent" style="width: max-content;">
                              <option v-for="expectation in expectations" :value="expectation.name">{{ expectation.displayName }}</option>
                          </select>
                          <button @click="addTemplateIntent" title="Додати причину"><i class="fas fa-plus"></i></button>
                      </div>
                  </div>
                  <div class="tpl_body active" id="tpl_tab_pug">
                      <div class="tpl_pug">
                          <div class="field">
                              <div class="tpl_extras">
                                  <button class="btn_screen_full_exit" title="Закрити весь екран"><i class="fas fa-compress-arrows-alt"></i></button> <button>Перемістити у смітник</button>
                                  <button class="btn_screen_full" title="Відкрити весь екран"><i class="fas fa-expand-arrows-alt"></i></button> <button @click="saveLegalTemplate" class="btn_save" title="Зберегти"><i class="fas fa-save"></i></button>
                              </div>
                              <label>{{ legalTemplateDescription.pug }}:</label> <textarea v-model="legalTemplate.pug"></textarea>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          `,
  methods: {
    addTemplateTag: function () {
      this.legalTemplate.tags.push(this.newTag);
      this.newTag = "";
    },
    addTemplateExpectation: function () {
      if (this.newExpectationActive) {
        if (
          this.createdExpectation.name === "" ||
          this.createdExpectation.description === "" ||
          this.createdExpectation.displayName === ""
        ) {
          alert("Будь ласка, заповніть всі поля!");
        } else {
          this.$emit("emit-post-expectation");
          this.legalTemplate.expectations.push(this.createdExpectation.name);
          this.$emit("emit-create-expectation");
        }
      } else {
        if (this.newExpectation == "newExpectation") {
          this.$emit("emit-create-expectation");
        } else {
          if (!this.legalTemplate.expectations) {
            this.legalTemplate.expectations = [];
          }
          this.legalTemplate.expectations.push(this.newExpectation);
        }
        this.newExpectation = "";
      }
    },
    hideNewExpectation: function () {
      this.$emit("emit-create-expectation");
    },
    addTemplateIntent: function () {
      if (!this.legalTemplate.intents) {
        this.legalTemplate.intents = [];
      }
      this.legalTemplate.intents.push(this.newIntent);
      this.newIntent = "";
    },
    searchByTag: function (tag) {
      this.$emit("emit-search-by-tag", tag);
    },
    deleteTag: function (tagIndex) {
      this.legalTemplate.tags.splice(tagIndex, 1);
    },
    saveLegalTemplate: function (index) {
      this.$emit("emit-save-legal-template");
    },
    deleteExpectation: function (expectationIndex) {
      this.legalTemplate.expectations.splice(expectationIndex, 1);
    },
    deleteIntent: function (intentIndex) {
      this.legalTemplate.intents.splice(intentIndex, 1);
    },
  },
  mounted: function () {
    // tabs
    $(".tpl_headings_holder a").on("click", function (e) {
      e.preventDefault();
      var tab = $(this).attr("href");
      $(".tpl_headings_holder a").removeClass("active");
      $(".tpl_body_holder .tpl_body").removeClass("active");
      $(this).addClass("active");
      $(".tpl_body_holder " + tab).addClass("active");
    });
    $(".cell_tpl h2 .btn_edit").on("click", function (e) {
      e.preventDefault();
      $(".tpl_headings_holder a").removeClass("active");
      $(".tpl_body_holder .tpl_body").removeClass("active");
      $(".tpl_head_main").addClass("active");
      $("#tpl_tab_main").addClass("active");
    });
    // full screen
    $(".btn_screen_full ").click(function () {
      $("#tpl_tab_pug").fullscreen();
      return false;
    });

    $(".btn_screen_full_exit").click(function () {
      $.fullscreen.exit();
      return false;
    });
    $(document).bind("fscreenchange", function (e, state, elem) {
      if ($.fullscreen.isFullScreen()) {
        $("#tpl_tab_pug").addClass("tpl_fullscreen");
      } else {
        $("#tpl_tab_pug").removeClass("tpl_fullscreen");
      }
    });
    this.headers = this.legalTemplates.filter(
      (template) => template.type === "header"
    );
    this.footers = this.legalTemplates.filter(
      (template) => template.type === "footer"
    );
    this.applications = this.legalTemplates.filter(
      (template) => template.type === "applications"
    );
  },
};
