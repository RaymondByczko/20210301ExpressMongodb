// customElements('multiple-timerange', MultipleTimeRange);
// alert("inside file: multipletimerange.js");
class MultipleTimeRange extends HTMLElement {
	constructor() {
		super();
		this.self = this;
		let sampleReturn = {startTime: {hour:6,minute:31, second:33}, endTime: {hour:6,minute:32, second:44}};
		this.calcReturn = {
			startTime: {
				'hour':0,
				'minute':0,
				'second':0
			},
			endTime: {
				'hour':0,
				'minute':0,
				'second':0
			}
		};
		
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
		this.hiddenElement = y;
  	y.setAttribute("type", "hidden");
		y.setAttribute("name",name);
  	// y.setAttribute("value",JSON.stringify(sampleReturn));
		y.setAttribute("value", JSON.stringify(this.calcReturn));
  	eIdf.appendChild(y);
		
		let shadowRoot = this.attachShadow({mode: 'open'});
		const wrapper = document.createElement('div');
		const time1 = document.createElement('input');
		const time2 = document.createElement('input');
		time1.setAttribute('type', 'time');
		time2.setAttribute('type', 'time');
		// time1.addEventListener('input', this.time1Changed);
		time1.addEventListener('input', (e)=>{this.time1Changed(e);});
		time2.addEventListener('input', (e)=>{this.time2Changed(e);});

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
		// alert('MultipleTimeRange::constructor::end');
	}
	get value() {
		alert('getting value');
		alert('this.time1='+this.time1.value);
		// @todo may put in check for time1 and time2
		// return {timeStart: this.time1.value, timeEnd: this.time2.value};
		return {timeStart: {hour:11,minute:23, second:33}, timeEnd: {hour:11,minute:34, second:55}};
	}
	time1Changed(e){
		console.log('time1Changed:'+e.target.value);
		let hhmm1 = e.target.value.split(':');
		let hour = hhmm1[0];
		let minute = hhmm1[1];
		let second = "00";
		// let this.time2.value;
		this.calcReturn.startTime = {
				'hour': hour,
				'minute': minute,
				'second': second
		}
	
		console.log('calcReturn='+this.calcReturn);
		console.log('calcReturn(str)='+JSON.stringify(this.calcReturn));
		this.hiddenElement.setAttribute("value", JSON.stringify(this.calcReturn));
	}
	time2Changed(e){
		console.log('time2Changed:'+e.target.value);
		let hhmm2 = e.target.value.split(':');
		let hour = hhmm2[0];
		let minute = hhmm2[1];
		let second = "00";
		// let this.time2.value;
		this.calcReturn.endTime = {
				'hour': hour,
				'minute': minute,
				'second': second
		}
		console.log('calcReturn='+this.calcReturn);
		console.log('calcReturn(str)='+JSON.stringify(this.calcReturn));
		this.hiddenElement.setAttribute("value", JSON.stringify(this.calcReturn));
	}
	// calcReturn = null;
	calcReturn = {
			startTime: {
				'hour':0,
				'minute':0,
				'second':0
			},
			endTime: {
				'hour':0,
				'minute':0,
				'second':0
			}
		};
}

customElements.define('multiple-timerange', MultipleTimeRange);