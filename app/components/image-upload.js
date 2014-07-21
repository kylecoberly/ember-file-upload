import Ember from 'ember';

export default Ember.Component.extend({
	file: function(key, value){
		if (arguments.length > 1){
			return value;
		}
	}.property(),
	progress: function(key, value){
		if (arguments.length > 1){
			if (value === 100){
				return 0;
			} else {
				return value;
			}
		}
	}.property(),

	uploadFile: function(){
		var self = this;
		var Base64FileReader = new FileReader();

		Base64FileReader.onload = function(){
			self.set("errorMessage", "");
			self.set("imageThumbnail", Base64FileReader.result);

			Ember.$.ajax({
				url: self.get("uploadEndpoint") + "?fileName=" + self.get("file").name,
				type: "POST",
				data: self.get("file"),
				dataType: "JSON",
				processData: false,
				success: function(data) {
					self.set("errorMessage", "");
					self.set("fileUrl", data.file_url);
				},
				error: function() {
					self.set("imageThumbnail", "");
					self.set("errorMessage", "Problem uploading file");
				}
			});
		};
		Base64FileReader.onprogress = function(data) {
			if (data.lengthComputable) {                                            
				var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
				self.set("progress", progress);
			}
		}

		Base64FileReader.readAsDataURL(this.get("file"));
	}.observes("file").on("change"),	

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


	didInsertElement: function(){
		var self = this;
		this.$(".file-input-field").change(function(){
			var file = self.$(".file-input-field").prop("files")[0];
			self.set("file", file);
		});
		this.$(".image-outline").click(function(){
			self.$(".file-input-field").click();
		});
	},

	actions: {
		removeImage: function(){
			var self = this;

			this.set("file", "");
			this.set("imageThumbnail", "");
			this.set("fileUrl", "");
			this.set("errorMessage", "");
			this.$(".file-input-field").val("");

			this.$(".image-outline").click(function(){
				self.$(".file-input-field").click();
			});
		}
	}
});