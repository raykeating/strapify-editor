"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = __importDefault(require("./styles"));
const editor_1 = __importDefault(require("./editor"));
// get the data-strapi-api-url attribute from the current script tag
const script = document.currentScript || null;
let apiUrl;
let schemaUrl;
let editModeEnabled = false;
if (script)
    apiUrl = new URL(script.getAttribute("data-strapi-api-url") || "");
if (script)
    schemaUrl = new URL(script.getAttribute("data-strapi-schema-url") || "");
if (window.location.search.includes("strapiEditor"))
    editModeEnabled = true;
if (editModeEnabled) {
    // if the user navigates away from the page, reload the page when they come back (only if they're in edit mode)
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
            location.reload();
        }
    });
    styles_1.default.addButtonStylesToDOM();
    styles_1.default.addLabelStylesToDOM();
}
document.addEventListener("strapifyInitialized", () => {
    // if there is a ?edit query parameter, display the edit buttons
    if (editModeEnabled) {
        let debounceTimeout; // TODO: fix this type
        let editor = new editor_1.default(apiUrl, schemaUrl);
        // eventually we'll allow options to enable/disable certain features
        editor.displayEditButtons();
        editor.displayCollectionLabels();
        // on resize, reinstantiate the editor after destroying the old one
        window.addEventListener("resize", () => {
            editor.destroy();
            // this (i think) prevents the editor from being instantiated multiple times.  Works for now
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                editor.displayEditButtons();
                editor.displayCollectionLabels();
            }, 200);
        });
    }
});
//# sourceMappingURL=index.js.map