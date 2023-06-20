export default {
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
};
