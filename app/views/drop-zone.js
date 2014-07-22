import Ember from 'ember';

export default Ember.View.extend({
	tagName: "div",
	classNames: ["drop-zone"],

	click: function(){
		this.get("controller").send("openFileDialog");		
	},
	dragEnter: function(dragEnterEvent) {
		dragEnterEvent.preventDefault();
	},
	dragOver: function(dragOverEvent) {
		dragOverEvent.preventDefault();
		dragOverEvent.dataTransfer.dropEffect = "copy";
	},
	drop: function(dropEvent) {
		dropEvent.preventDefault();
		this.get("controller").send("processDroppedFile", event);
	}
});