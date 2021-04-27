customElements('multiple-timerange', MultipleTimeRange);

class MultipleTimeRange extends HTMLElement {
	constructor() {
		this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'wrapper_class')
		const style = document.createElement('style');
		style.textContent = 'div .wrapper_class {
				border: solid red 2px;
				width: 100px;
				height: 30px;
			';

		this.shadowRoot.append(style);
		this.shadowRoot.append(wrapper)
	}
}