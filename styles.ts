class Styles {
	editorColors: {
		buttonPrimary: string;
		labelPrimary: string;
		textPrimary: string;
		borderColor: string;
		// borderColorHover: string;
		// templateBorderOffset: string;
		// collectionBorderOffset: string;
	} = {
		buttonPrimary: "rgba(255, 255, 255, 1)",
		labelPrimary: "rgba(255, 255, 255, 1)",
		textPrimary: "rgba(0,0,0,1)",
		borderColor: "rgba(0,0,0,0.08)",
		// borderColorHover: "rgba(0,0,0, 0.2)",
		// templateBorderOffset: "0px",
		// collectionBorderOffset: "5px",
	};

	addButtonStylesToDOM() {
		// Create a style tag to hold the button styling
		const style = document.createElement("style");
		document.head.appendChild(style);
		// Add the button styling to the style tag
		style.innerHTML = `
    .strapify-editor-button {
      transform: translateX(-14px) translateY(-14px);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${this.editorColors.buttonPrimary};
      color: #000;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 14px;
      text-align: center;
      box-shadow: 0.5px 0.5px 4px rgba(0, 0, 0, 0.13);
      cursor: pointer;
      z-index: 9999;
      transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
    }
    .strapify-editor-button:hover {
      transform: translateX(-15px) translateY(-15px) scale(1.05);
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.18);
    }
  `;
	}

	addLabelStylesToDOM() {
		// Create a style tag to hold the label styling
		const style = document.createElement("style");
		document.head.appendChild(style);
		// Add the label styling to the style tag
		style.innerHTML = `
    .strapi-collection-label {
      transform: translateX(-10px) translateY(-10px);
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: ${this.editorColors.labelPrimary};
      color: #000;
      padding: 6px 12px;
      font-size: 14px;
      box-shadow: 0.5px 0.5px 4px rgba(0, 0, 0, 0.13);
      z-index: 9999;
      transition: background-color 0.2s ease-in-out;
      cursor: pointer;
      border-radius: 100px;
      transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
    }

    .strapi-collection-label:hover {
      transform: translateX(-11.5px) translateY(-11.5px);
      box-shadow: 0.5px 0.5px 5px rgba(0, 0, 0, 0.18);
    }
  
    .strapi-collection-label .label-text {
      font-size: 14px;
      font-weight: 600;
      margin-left: 4px;
    }
  
  `;
	}

	addBorderFromRect(rect: DOMRect) {
    const offset = 16;
		const border = document.createElement("div");
		border.style.position = "absolute";
		border.style.top = `${rect.top - offset/2}px`;
		border.style.left = `${rect.left - offset/2}px`;
		border.style.width = `${rect.width + offset}px`;
		border.style.height = `${rect.height + offset}px`;
		border.style.border = `2px dashed ${this.editorColors.borderColor}`;
		border.style.borderRadius = "4px";
		border.style.pointerEvents = "none";
		border.style.zIndex = "9998";
    border.style.transition = "opacity 0.1s ease-in-out";
    border.style.opacity = "0";
    setTimeout(() => {
      border.style.opacity = "1";
    }, 0);
		document.body.appendChild(border);
    return border;
	}

  removeBorder(border: Element | null) {
    if (border) border.remove();
  }

}

export default new Styles();
