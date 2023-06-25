export default {
  data: function () {
    return {
      isActive: null,
      formedDocument: String,
      formedDocumentActive: Boolean,
      varsWithAssociated: Array,
      pug: String,
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
                <button @click="updateVariables">Підтягнути змінні</button>\
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
      let pug = this.legalTemplate.pug;
      let parsedVariables = pug.match(/(?:!{([^}]+)}|#{([^}]+)})/g);
      let unique = new Set(parsedVariables);
      let varsWithAssociated = this.legalTemplate.variables;

      parsedVariables = Array.from(unique);
      unique = undefined;

      parsedVariables = parsedVariables.map((item, i) => {
        return item.slice(2, -1);
      });

      function changes(old, actual) {
        varsWithAssociated = old.map((obj) => {
          return obj.name;
        });

        return [
          varsWithAssociated.filter((e) => {
            return !actual.includes(e);
          }),
          actual.filter((e) => {
            return !varsWithAssociated.includes(e);
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
          disappeared.push(varsWithAssociated.indexOf(e));
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
};
