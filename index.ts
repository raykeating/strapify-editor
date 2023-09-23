import Styles from "./styles";
import Editor from "./editor";

// get the data-strapi-api-url attribute from the current script tag
const script = document.currentScript || null;

let apiUrl: URL;
let schemaUrl: URL;
let editModeEnabled: boolean = false;

if (script) apiUrl = new URL(script.getAttribute("data-strapi-api-url") || "");
if (script)
	schemaUrl = new URL(script.getAttribute("data-strapi-schema-url") || "");
if (window.location.search.includes("strapiEditor")) editModeEnabled = true;

if (editModeEnabled) {
	// if the user navigates away from the page, reload the page when they come back (only if they're in edit mode)
	document.addEventListener("visibilitychange", function () {
		if (document.visibilityState === "visible") {
			location.reload();
		}
	});
	Styles.addButtonStylesToDOM();
	Styles.addLabelStylesToDOM();
}

document.addEventListener("strapifyInitialized", () => {
	// if there is a ?edit query parameter, display the edit buttons
	if (editModeEnabled) {
		let debounceTimeout: any; // TODO: fix this type
		let editor = new Editor(apiUrl, schemaUrl);
		// eventually we'll allow options to enable/disable certain features
		editor.displayEditButtons();
		editor.displayCollectionLabels();

		// on resize, reinstantiate the editor after destroying the old one
		window.addEventListener("resize", () => {
			editor.destroy();
			// this (i think) prevents the editor from being instantiated multiple times.  Works for now
			clearTimeout(debounceTimeout)
			debounceTimeout = setTimeout(() => {
				editor.displayEditButtons();
				editor.displayCollectionLabels();
			}, 200);
		});

	}
});
