// customElements('multiple-timerange', MultipleTimeRange);
alert("inside file: multipletimerange.js");
class MultipleTimeRange extends HTMLElement {
	constructor() {
		super();
		let sampleReturn = {timeStart: {hour:11,minute:23, second:33}, timeEnd: {hour:11,minute:34, second:55}};
		
		if (this.attachInternals) {
			console.log('ATTACHINTERNALS EXISTS');
		}
		else {
			console.log('ATTACHINTERNALS DOESNT EXIST');
		}
		let idf=this.getAttribute('id_form');
		console.log('idf='+idf);
		let name=this.getAttribute('name');
		let eIdf = document.getElementById(idf);
		var y = document.createElement("INPUT");
  	y.setAttribute("type", "hidden");
		y.setAttribute("name",name);
  	y.setAttribute("value",JSON.stringify(sampleReturn));
  	eIdf.appendChild(y);
		
		let shadowRoot = this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('div');
		const time1 = document.createElement('input');
		const time2 = document.createElement('input');
		time1.setAttribute('type', 'time');
		time2.setAttribute('type', 'time');

		wrapper.appendChild(time1);
		wrapper.appendChild(time2);
		this.time1 = time1;
		this.time2 = time2;
		wrapper.setAttribute('class', 'wrapper_class');
		// wrapper.textContent = this.textContent;
		// wrapper.textContent = "somewrap";
		const slot = document.createElement('slot');
		let nodes = slot.assignedNodes();
		// alert("nodes[0]="+nodes[0].nodeValue);
		// debugger;
		// alert("textContent="+this.textContent);
		
		const style = document.createElement('style');
		style.textContent = `.wrapper_class { border: solid red 2px; width: 10em; height: 5em;
		}`;
		let id_attr = this.hasAttribute('id')?this.getAttribute('id'):"idisnone";
		alert('id_attr='+id_attr);
		shadowRoot.append(style);
		shadowRoot.append(wrapper);
		alert('MultipleTimeRange::constructor::end');
	}
	get value() {
		alert('getting value');
		alert('this.time1='+this.time1.value);
		// @todo may put in check for time1 and time2
		// return {timeStart: this.time1.value, timeEnd: this.time2.value};
		return {timeStart: {hour:11,minute:23, second:33}, timeEnd: {hour:11,minute:34, second:55}};
;	}
}

customElements.define('multiple-timerange', MultipleTimeRange);