// customElements('multiple-timerange', MultipleTimeRange);
alert("inside file: multipletimerange.js");
class MultipleTimeRange extends HTMLElement {
	constructor() {
		super();
		let shadowRoot = this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'wrapper_class');
		wrapper.textContent = this.textContent;
		// wrapper.textContent = "somewrap";
		const slot = document.createElement('slot');
		let nodes = slot.assignedNodes();
		// alert("nodes[0]="+nodes[0].nodeValue);
		// debugger;
		alert("textContent="+this.textContent);
		// alert("text="+this.text);
		const style = document.createElement('style');
		style.textContent = `.wrapper_class { border: solid red 2px; width: 10em; height: 5em;
		}`;

		shadowRoot.append(style);
		shadowRoot.append(wrapper);
		alert('MultipleTimeRange::constructor::end');
	}
}

customElements.define('multiple-timerange', MultipleTimeRange);