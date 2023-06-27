import formedDocumentComponent from "./vue-components/formed-document.js";
import legalTemplatesListComponent from "./vue-components/legal-templates-list.js";
import legalTemplateComponent from "./vue-components/legal-template.js";
import legalTemplateVariablesComponent from "./vue-components/legal-template-variables.js";

Vue.component("formed-document-component", formedDocumentComponent);
Vue.component("legal-templates-list-component", legalTemplatesListComponent);
Vue.component("legal-template-component", legalTemplateComponent);
Vue.component(
  "legal-template-variables-component",
  legalTemplateVariablesComponent
);

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
    this.rootReadNotBodies();
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
    rootReadNotBodies: function () {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        prefix + "api/templates?type=footer&type=header&type=applications"
      );
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.status != 200) {
          alert(xhr.status + ": " + xhr.statusText);
        } else {
          this.legalTemplates = Object.assign(
            {},
            this.legalTemplates,
            JSON.parse(xhr.responseText)
          );
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
      variables.forEach((e) => {
        let sp = e.name.split("."); // Розбиття рядка `name` на підрядки, використовуючи крапку як роздільник
        sp.reduce((p, prop, i, arr) => {
          if (i === arr.length - 1) {
            p[prop] = e.testValue; // Присвоєння значення `testValue` властивості `prop` об'єкту `p`
          } else {
            if (!p[prop]) {
              p[prop] = {}; // Створення порожнього об'єкту, якщо властивість `prop` ще не існує
            }
            return p[prop]; // Повернення наступного вкладеного об'єкту для наступної ітерації
          }
        }, variables4fsm); // Початковий об'єкт `variables4fsm`, в якому зберігаються значення змінних
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
