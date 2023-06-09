import legalTemplatesListComponent from "./vue-components/legal-templates-list.vue";
Vue.component("formed-document-component", {
  data: function () {
    return {
      formedDocumentActive: Boolean,
    };
  },
  props: {
    formedDocument: String,
  },
  template: `
          <div class="formedDocumentContainer">
              <div v-html="this.formedDocument"></div>
              <button @click="showHideDocument">Close</button>
          </div>
          `,
  methods: {
    showHideDocument: function () {
      this.$emit("emit-show-hide-document");
    },
  },
});
Vue.component("legal-templates-list-component", legal - templates - list);

Vue.component("legal-template-component", {
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
});

Vue.component("legal-template-variables-component", {
  data: function () {
    return {
      isActive: null,
      formedDocument: String,
      formedDocumentActive: Boolean,
    };
  },
  props: {
    legalTemplate: Object,
    legalTemplateDescription: Object,
    displayJSON: Boolean,
    stringifiedVariablesJSON: String,
    renderedVariables: Object,
  },
  template: `<div class="cell">\
                <h2>Задавання змінних\
                    <button @click="createLegalTemplateVariable" class="btn_create" title="Додати змінну"><i class="fas fa-plus"></i></button> \
                </h2>\
                <button @click="updateVariables">Оновити змінні</button>\
                <ul class="tpl_chan">\
                    <li v-for="(variable, index) in legalTemplate.variables" v-bind:class="{ active: index == isActive }" >\
                        <div class="tpl_chan_heading" @click="showAdvanced(index)"> \
                            <h4>{{ variable.name }}<button class="tpl_chan_heading_collapse"><i class="fas fa-chevron-down"></i></button>\
                            </h4>\
                            <h6>\
                                <i class="fas fa-align-left"></i><span>{{ variable.description }}</span>\
                            </h6>\
                            <h6>\
                                <i class="fas fa-code"></i>\
                                <span>{{ variable.testValue }}</span>\
                            </h6>\
                        </div>\
                        <div class="tpl_chan_body">\
                            <div class="field" v-for="(value, name) in variable">\
                                <label>{{ legalTemplateDescription.variables[name] }}</label>\
                                <div v-if="name===&quot;required&quot;" class="field_radiobuttons">\
                                    <input type="radio" v-bind:id="&quot;required_&quot; + legalTemplateDescription.radioTrue + variable.id" value=true v-model="legalTemplate.variables[index][name]">\
                                    <label v-bind:for="&quot;required_&quot; + legalTemplateDescription.radioTrue + variable.id">Так</label>\
                                    <input type="radio" v-bind:id="&quot;required_&quot; + legalTemplateDescription.radioFalse + variable.id" value=false v-model="legalTemplate.variables[index][name]">\
                                    <label v-bind:for="&quot;required_&quot; + legalTemplateDescription.radioFalse + variable.id">Ні</label>\
                                </div>\
                                <div v-else-if="name===&quot;enabled&quot;" class="field_radiobuttons">\
                                    <input type="radio" v-bind:id="&quot;enabled_&quot; + legalTemplateDescription.radioTrue + variable.id" value=true v-model="legalTemplate.variables[index][name]">\
                                    <label v-bind:for="&quot;enabled_&quot; + legalTemplateDescription.radioTrue + variable.id">Так</label>\
                                    <input type="radio" v-bind:id="&quot;enabled_&quot; + legalTemplateDescription.radioFalse + variable.id" value=false v-model="legalTemplate.variables[index][name]">\
                                    <label v-bind:for="&quot;enabled_&quot; + legalTemplateDescription.radioFalse + variable.id">Ні</label>\
                                </div>\
                                <div v-else>\
                                    <input type="text" v-model="legalTemplate.variables[index][name]">\
                                </div>\
                            </div>\
                        </div>\
                    </li>\
                </ul>\
                <button @click="formDocument">Сформувати документ</button>\
                <button @click="displayVariablesJSON">Сформувати JSON зі змінними</button>\
                <div v-if="displayJSON"> {{  JSON.stringify(renderedVariables, null, 2)  }} </div>\
            </div>
        `,
  methods: {
    showAdvanced: function (index) {
      this.isActive = this.isActive === index ? null : index;
    },
    createLegalTemplateVariable: function () {
      this.legalTemplate.variables.push({
        id: uuid(),
        name: prompt("Введіть назву змінної", ""),
        description: "",
        type: "string",
        testValue: "",
        currentValue: "",
        required: true,
        enabled: false,
      });
    },

    formDocument: function () {
      this.$emit(
        "emit-form-document",
        this.legalTemplate.variables,
        this.legalTemplate.pug,
        this.legalTemplate.header,
        this.legalTemplate.footer,
        this.legalTemplate.application
      );
    },

    displayVariablesJSON: function () {
      this.$emit("emit-display-variables-json");
      this.$emit("root-render-variables", this.legalTemplate.variables);
    },

    updateVariables: function () {
      var parsedVariables = this.legalTemplate.pug.match(/#{\\S+}/g);
      let unique = new Set(parsedVariables);
      parsedVariables = Array.from(unique);
      delete unique;

      parsedVariables = parsedVariables.map((item, i) => {
        return item.slice(2, -1);
      });

      function changes(old, n) {
        oldArray = old.map((obj) => {
          return obj.name;
        });

        return [
          oldArray.filter((e) => {
            return !n.includes(e);
          }),
          n.filter((e) => {
            return !oldArray.includes(e);
          }),
        ];
      }

      result = changes(this.legalTemplate.variables, parsedVariables);
      if (
        confirm(
          "Зникли: " +
            result[0] +
            "\\n\\nЗ'явились:" +
            result[1] +
            "\\nОновити змінні?"
        )
      ) {
        var disappeared = [];

        result[0].forEach((e) => {
          disappeared.push(oldArray.indexOf(e));
        });
        this.legalTemplate.variables.forEach((item, i) => {
          if (disappeared.includes(i)) {
            item.enabled = false;
          } else {
            item.enabled = true;
          }
        });

        result[1] = result[1].map((elem) => {
          return {
            id: uuid(),
            name: elem,
            description: "",
            type: "string",
            testValue: "",
            currentValue: "",
            required: true,
            enabled: true,
          };
        });

        this.legalTemplate.variables = this.legalTemplate.variables.concat(
          result[1]
        );
      }
    },

    saveLegalTemplate: function (index) {
      this.$emit("emit-save-legal-template");
    },
  },
});

var vmMain = new Vue({
  el: "#app",
  data: {
    prefix: "",
    legalTemplate: {},
    legalTemplateDescription: {
      id: "ID",
      title: "Назва шаблону",
      type: "Тип шаблону",
      action_type: "Тип дії",
      pug: "PUG код шаблону",
      radioTrue: "radioTrue",
      radioFalse: "radioFalse",
      variables: {
        id: "Унікальний ідентифікатор змінної",
        name: "Ім'я змінної",
        description: "Опис змінної",
        type: "Тип змінної",
        testValue: "Значення для тестування",
        currentValue: "Значення в даний момент",
        required: "Обов'язкова змінна? Без неї ніяк...",
        enabled: "Чи активна зараз змінна? Використовується в шаблоні",
      },
      expectations: "Можливі реакції",
      description: "Опис шаблону",
      intents: "Причини застосування",
      header: "Шаблон шапки",
      footer: "Шаблон дати й підпису",
      application: "Шаблон додатків",
    },
    // currentIndex:null,
    legalTemplates: [],
    expectations: [],
    expectationsDict: {},
    tags: [],
    isActive: null,
    formedDocument: "",
    formedDocumentActive: false,
    newExpectationActive: false,
    displayClearFilters: false,
    displayJSON: false,
    renderedVariables: {},
    stringifiedVariablesJSON: "",
    createdExpectation: { name: "", displayName: "", description: "" },
  },

  mounted: function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", prefix + "api/templates");
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4) return;
      if (xhr.status != 200) {
        alert(xhr.status + ": " + xhr.statusText);
      } else {
        this.legalTemplates = JSON.parse(xhr.responseText);
        this.legalTemplates.forEach((template) => {
          if (template.tags) {
            template.tags.forEach((tag) => {
              this.tags.push(tag);
            });
          }
        });
        this.tags = [...new Set(this.tags)];
      }
    }.bind(this);
  },

  methods: {
    rootReadAll: function () {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", prefix + "api/templates");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          this.legalTemplates = JSON.parse(xhr.responseText);
          this.legalTemplates.forEach((template) => {
            if (template.tags) {
              template.tags.forEach((tag) => {
                this.tags.push(tag);
              });
            }
          });
          this.tags = [...new Set(this.tags)];
          this.displayClearFilters = false;
        }
      }.bind(this);
    },
    showAdvanced: function (index) {
      this.isActive = this.isActive === index ? null : index;
    },
    rootDisplayVariablesJSON: function () {
      this.displayJSON = !this.displayJSON;
    },
    rootRenderVariables: function (variables) {
      f = function (o, a, VAL) {
        a.reduce((p, e, i) => {
          if (i == a.length - 1) {
            p[e] = VAL;
          } else {
            if (!p[e]) {
              p[e] = {};
            }
            return p[e];
          }
        }, o);
      };
      variables.forEach((e) => {
        let sp = e.name.split(".");
        f(this.renderedVariables, sp, e.testValue);
      });
    },

    rootShowHideDocument: function () {
      this.formedDocumentActive = !this.formedDocumentActive;
    },

    rootFormDocument: function (variables, pug, header, footer, application) {
      var variables4fsm = {};
      f = function (o, a, VAL) {
        a.reduce((p, e, i) => {
          if (i == a.length - 1) {
            p[e] = VAL;
          } else {
            if (!p[e]) {
              p[e] = {};
            }
            return p[e];
          }
        }, o);
      };
      variables.forEach((e) => {
        let sp = e.name.split(".");
        f(variables4fsm, sp, e.testValue);
      });

      var requestObj = {
        pug: pug,
        variables: variables4fsm,
        header: header,
        footer: footer,
        application: application,
      };

      var xhr = new XMLHttpRequest();
      xhr.open("PUT", prefix + "api/form");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(requestObj));
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          if (JSON.parse(xhr.responseText).status === "fail") {
            alert(
              "Не вдалось сформувати документ. Переконайтесь, що для нього задані всі необхідні змінні."
            );
          } else {
            this.formedDocument = JSON.parse(xhr.responseText).html;

            this.formedDocumentActive = !this.formedDocumentActive;
          }
        }
      }.bind(this);
    },
    rootGetExpectations: function () {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", prefix + "api/expectations");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          this.expectations = JSON.parse(xhr.responseText);
          this.expectationsDict = {};
          this.expectations.forEach((obj) => {
            this.expectationsDict[obj.name] = obj.displayName;
          });
        }
      }.bind(this);
    },
    rootCreateLegalTemplate: function () {
      this.legalTemplates.push({
        id: uuid(),
        description: "",
        title: "",
        type: "",
        pug: "",
        radioTrue: "",
        radioFalse: "",
        variables: [],
        tags: [],
        expectations: [],
        intents: [],
      });
      this.legalTemplate = this.legalTemplates[this.legalTemplates.length - 1];
    },
    rootCreateExpectation: function () {
      this.newExpectationActive = !this.newExpectationActive;
    },
    rootPostExpectation: function () {
      this.expectationsDict[this.createdExpectation.name] =
        this.createdExpectation.displayName;
      var xhr = new XMLHttpRequest();
      xhr.open("POST", prefix + "api/expectations");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(this.createdExpectation));
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200) {
          alert(
            "posting failed. " +
              xhr.status +
              " " +
              xhr.statusText +
              " " +
              xhr.responseText
          );
          return;
        }
      };
    },
    rootSaveLegalTemplate: function (index) {
      if (this.legalTemplate.title === "") {
        this.legalTemplate.title = prompt(
          "Будь ласка, введіть назву шаблону",
          ""
        );
        if (this.legalTemplate.title === "") {
          alert("Шаблон не було збережено через відсутність назви.");
          return;
        }
      }
      delete this.legalTemplate.changed;
      delete this.legalTemplate.radioTrue;
      delete this.legalTemplate.radioFalse;
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", prefix + "api/templates");
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send("[" + JSON.stringify(this.legalTemplate) + "]");
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200) {
          alert(
            "saved failed. " +
              xhr.status +
              " " +
              xhr.statusText +
              " " +
              xhr.responseText
          );
          return;
        }
      };
    },
    rootSaveLegalTemplates: function () {
      let toSave = [];
      this.legalTemplates.forEach(function (lTemplate) {
        if (lTemplate.title === "") {
          lTemplate.title = prompt(
            "Будь ласка, введіть назву шаблону з кодом \\n" + lTemplate.pug,
            ""
          );
          if (lTemplate.title === "") {
            alert(
              "Шаблони не було збережено через відсутність назви в одного з шаблонів."
            );
            return;
          }
        }
        if (lTemplate.changed) {
          delete lTemplate.changed;
          toSave.push(lTemplate);
        }
      });
      while (toSave.length) {
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", prefix + "api/templates");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(toSave.splice(0, 5)));
        xhr.onreadystatechange = function () {
          if (xhr.readyState == XMLHttpRequest.DONE && xhr.status != 200) {
            alert(
              "saved failed. " +
                xhr.status +
                " " +
                xhr.statusText +
                " " +
                xhr.responseText
            );
            return;
          }
        };
      }
    },
    rootSearchByTag: function (tag) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", prefix + "api/templates?tag=" + tag);
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          this.legalTemplates = JSON.parse(xhr.responseText);
          this.displayClearFilters = true;
        }
      }.bind(this);
    },
    rootGetTemplate: function (id) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", prefix + "api/templates?id=" + id);
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          console.log(xhr.responseText);
          this.legalTemplate = this.legalTemplates[
            this.legalTemplates.findIndex((template) => template.id === id)
          ] = JSON.parse(xhr.responseText)[0];
          this.displayClearFilters = true;
        }
      }.bind(this);
    },
    rootLogoutRequest: function () {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://tala.cloudi.es/routes/00d3928bf3/api/logout");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          window.location.reload();
        }
      }.bind(this);
    },
  },
  computed: {},
});