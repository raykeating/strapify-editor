"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = __importDefault(require("./styles"));
class Editor {
    constructor(apiUrl, schemaUrl) {
        this.activeBorder = null;
        if (!Editor.instance) {
            Editor.instance = this;
        }
        this.apiUrl = apiUrl;
        this.schemaUrl = schemaUrl;
        this.collectionElms = document.querySelectorAll("[strapi-collection]");
        this.activeBorder = null;
        return Editor.instance;
    }
    displayEditButtons() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const editButton = (singularApiId_, templateId_, templateRect) => {
                // Create the button element
                const button = document.createElement("a");
                button.classList.add("strapify-editor-button");
                const editIcon = document.createElement("span");
                editIcon.textContent = "✏️";
                button.appendChild(editIcon);
                button.href = `${this.apiUrl}admin/content-manager/collectionType/api::${singularApiId_}.${singularApiId_}/${templateId_}`;
                button.target = "_blank";
                button.rel = "noopener noreferrer";
                // Set the button position to the top-right of the element
                button.style.position = "absolute";
                button.style.top = templateRect.y + "px";
                button.style.left = templateRect.right + "px";
                return button;
            };
            for (const collectionEl of this.collectionElms) {
                const pluralApiId = collectionEl.getAttribute("strapi-collection");
                const templateElms = collectionEl.querySelectorAll("[strapi-template-id]");
                // Loop through each element and add a circular button
                for (const templateEl of templateElms) {
                    console.log((_a = templateEl.querySelector("h3")) === null || _a === void 0 ? void 0 : _a.textContent);
                    // Create the button element
                    const singularApiId = yield this.getSingularApiId(pluralApiId);
                    if (!singularApiId) {
                        console.error("Could not find collection with the plural name of " + pluralApiId);
                    }
                    const templateId = templateEl.getAttribute("strapi-template-id") || "";
                    const templateRect = templateEl.getBoundingClientRect();
                    const button = editButton(singularApiId, templateId, templateRect);
                    // Add the button to the element
                    document.body.appendChild(button);
                    // on hover, call Styles.addBorderToRect
                    button.addEventListener("mouseenter", () => {
                        this.activeBorder = styles_1.default.addBorderFromRect(templateRect);
                    });
                    // on mouseleave, call Styles.removeBorderFromRect
                    button.addEventListener("mouseleave", () => {
                        styles_1.default.removeBorder(this.activeBorder);
                    });
                }
            }
        });
    }
    getSingularApiId(pluralApiId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!pluralApiId)
                return null;
            // Fetch the schema
            const response = yield fetch(this.schemaUrl);
            const data = yield response.json();
            for (const schema of data) {
                // If the schema name matches the pluralApiId
                if (schema.info.pluralName === pluralApiId) {
                    return schema.info.singularName;
                }
            }
            // If no matching schema was found, return null or throw an error
            return null; // or throw new Error("No matching schema found")
        });
    }
    getDisplayName(pluralApiId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!pluralApiId)
                return null;
            // Fetch the schema
            const response = yield fetch(this.schemaUrl);
            const data = yield response.json();
            for (const schema of data) {
                // If the schema name matches the pluralApiId
                if (schema.info.pluralName === pluralApiId) {
                    return schema.info.displayName;
                }
            }
            // If no matching schema was found, return null or throw an error
            return null; // or throw new Error("No matching schema found")
        });
    }
    displayCollectionLabels() {
        return __awaiter(this, void 0, void 0, function* () {
            // Loop through each element and add a label
            for (const collectionEl of this.collectionElms) {
                // Create the label element
                const pluralApiId = collectionEl.getAttribute("strapi-collection");
                const singularApiId = yield this.getSingularApiId(pluralApiId);
                const displayName = yield this.getDisplayName(pluralApiId);
                if (!singularApiId) {
                    return console.error("Could not find collection with the plural name of " + pluralApiId);
                }
                const label_ = label(displayName, singularApiId, collectionEl);
                // on hover, call Styles.addBorderToRect
                label_.addEventListener("mouseenter", () => {
                    this.activeBorder = styles_1.default.addBorderFromRect(collectionEl.getBoundingClientRect());
                });
                // on mouseleave, call Styles.removeBorderFromRect
                label_.addEventListener("mouseleave", () => {
                    styles_1.default.removeBorder(this.activeBorder);
                });
                // Add the label to the end of the body (so it's not affected by the element's position)
                document.body.appendChild(label_);
            }
            function label(displayName_, singularApiId_, collectionEl_) {
                // Create the label element
                const label = document.createElement("a");
                label.classList.add("strapi-collection-label");
                label.innerHTML = `<span>📝</span> <span class="label-text">${displayName_}</span>`;
                label.href = `${Editor.instance.apiUrl}admin/content-manager/collectionType/api::${singularApiId_}.${singularApiId_}`;
                label.target = "_blank";
                label.rel = "noopener noreferrer";
                // Get the position of the collection element
                const elementPosition = collectionEl_.getBoundingClientRect();
                // Set the label position to the top-left of the element
                label.style.position = "absolute";
                label.style.top = elementPosition.y + "px";
                label.style.left = elementPosition.x + "px";
                return label;
            }
        });
    }
    destroy() {
        var _a, _b;
        // remove all edit buttons and labels using parentElement.removeChild
        const editButtons = document.querySelectorAll(".strapify-editor-button");
        for (const editButton of editButtons) {
            (_a = editButton.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(editButton);
        }
        const labels = document.querySelectorAll(".strapi-collection-label");
        for (const label of labels) {
            (_b = label.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(label);
        }
        // remove the border
        styles_1.default.removeBorder(this.activeBorder);
    }
}
exports.default = Editor;
//# sourceMappingURL=editor.js.map