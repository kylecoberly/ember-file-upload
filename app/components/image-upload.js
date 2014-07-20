import Ember from 'ember';

export default Ember.Component.extend({
	file: function(key, value){
		if (arguments.length > 1){
			return value;
		}
	}.property(),
	dragEnter: function(event) {
		event.preventDefault();
	},
	dragOver: function(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	},
	drop: function(event) {
		event.preventDefault();

		var file = event.dataTransfer.files[0];
		if (!file.type.match('image.*')) {
			return false;
		}
		this.set("file", file);
	},
	uploadImage: function(){
		var self = this;
		var Reader = new FileReader();

		Reader.onload = function(event){
			Ember.$.ajax({
				url: this.get("ImageUploadEndpoint"),
				type: "POST",
				data: 	{
							imageData: Reader.result,
							imageName: value.name
						},
				dataType: "JSON",
				success: function(data) {
					self.set("errorMessage", "");
					self.set("imageUrl", data.image_url);
				},
				error: function() {
					self.set("errorMessage", "Problem uploading file");
				}
			});
		};
		Reader.readAsDataURL(value);

	}.observes("file").on("change", "init"),
	didInsertElement: function(){
		var self = this;
		this.$(".file-input-field").change(function(){
			var file = self.$(".file-input-field").prop("files")[0];
			self.set("file", file);
		});
	},

	actions: {
		removeImage: function(){
			this.set("imageUrl", "");
			this.$(".file-input-field").val("");
		}
	}
});