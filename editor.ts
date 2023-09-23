import Styles from "./styles";

class Editor {
	private apiUrl: URL;
	private schemaUrl: URL;
	private collectionElms: NodeListOf<Element>;
	private activeBorder: Element | null = null;
	private static instance: Editor;

	constructor(apiUrl: URL, schemaUrl: URL) {
		if (!Editor.instance) {
			Editor.instance = this;
		}
		this.apiUrl = apiUrl;
		this.schemaUrl = schemaUrl;
		this.collectionElms = document.querySelectorAll("[strapi-collection]");
		this.activeBorder = null;

		return Editor.instance;
	}

	async displayEditButtons(): Promise<void> {
		const editButton = (
			singularApiId_: string,
			templateId_: string,
			templateRect: DOMRect
		): HTMLAnchorElement => {
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
				console.log(templateEl.querySelector("h3")?.textContent);
				// Create the button element
				const singularApiId = await this.getSingularApiId(pluralApiId);
				if (!singularApiId) {
					console.error(
						"Could not find collection with the plural name of " + pluralApiId
					);
				}
				const templateId = templateEl.getAttribute("strapi-template-id") || "";
				const templateRect = templateEl.getBoundingClientRect();

				const button = editButton(singularApiId, templateId, templateRect);

				// Add the button to the element
				document.body.appendChild(button);

				// on hover, call Styles.addBorderToRect
				button.addEventListener("mouseenter", () => {
					this.activeBorder = Styles.addBorderFromRect(templateRect);
				});
				// on mouseleave, call Styles.removeBorderFromRect
				button.addEventListener("mouseleave", () => {
					Styles.removeBorder(this.activeBorder);
				});
			}
		}
	}

	async getSingularApiId(pluralApiId: string | null) {
		if (!pluralApiId) return null;
		// Fetch the schema
		const response = await fetch(this.schemaUrl);
		const data = await response.json();
		for (const schema of data) {
			// If the schema name matches the pluralApiId
			if (schema.info.pluralName === pluralApiId) {
				return schema.info.singularName;
			}
		}
		// If no matching schema was found, return null or throw an error
		return null; // or throw new Error("No matching schema found")
	}

	async getDisplayName(pluralApiId: string | null) {
		if (!pluralApiId) return null;
		// Fetch the schema
		const response = await fetch(this.schemaUrl);
		const data = await response.json();
		for (const schema of data) {
			// If the schema name matches the pluralApiId
			if (schema.info.pluralName === pluralApiId) {
				return schema.info.displayName;
			}
		}
		// If no matching schema was found, return null or throw an error
		return null; // or throw new Error("No matching schema found")
	}

	async displayCollectionLabels() {
		// Loop through each element and add a label
		for (const collectionEl of this.collectionElms) {
			// Create the label element
			const pluralApiId = collectionEl.getAttribute("strapi-collection");
			const singularApiId = await this.getSingularApiId(pluralApiId);
			const displayName = await this.getDisplayName(pluralApiId);

			if (!singularApiId) {
				return console.error(
					"Could not find collection with the plural name of " + pluralApiId
				);
			}

			const label_ = label(displayName, singularApiId, collectionEl);

			// on hover, call Styles.addBorderToRect
			label_.addEventListener("mouseenter", () => {
				this.activeBorder = Styles.addBorderFromRect(
					collectionEl.getBoundingClientRect()
				);
			});
			// on mouseleave, call Styles.removeBorderFromRect
			label_.addEventListener("mouseleave", () => {
				Styles.removeBorder(this.activeBorder);
			});

			// Add the label to the end of the body (so it's not affected by the element's position)
			document.body.appendChild(label_);
		}

		function label(
			displayName_: string,
			singularApiId_: string,
			collectionEl_: Element
		): HTMLAnchorElement {
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
	}

	destroy() {
		// remove all edit buttons and labels using parentElement.removeChild
		const editButtons = document.querySelectorAll(".strapify-editor-button");
		for (const editButton of editButtons) {
			editButton.parentElement?.removeChild(editButton);
		}
		const labels = document.querySelectorAll(".strapi-collection-label");
		for (const label of labels) {
			label.parentElement?.removeChild(label);
		}

		// remove the border
		Styles.removeBorder(this.activeBorder);
	}
}

export default Editor;
