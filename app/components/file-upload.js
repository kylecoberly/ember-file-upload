import Ember from 'ember';

export default Ember.Component.extend({
	validateFileType: function(){
		if (!this.get("file")){
			return false;
		}

		if (!this.get("isValidFileType")){
			this.set("file", null);
			this.set("errorMessage", "Please upload a valid file type");
		} else {
			this.send("uploadFile", this.get("file"));
		}
	}.observes("file").on("change"),

	updateImageThumbnail: function(){
		var file = this.get("file");
		if (file && file.type.match("image.*")){
			var self = this;

			var imageFileReader = new FileReader();
			imageFileReader.onload = function(){
				self.set("imageThumbnail", imageFileReader.result);
			};
			imageFileReader.readAsDataURL(this.get("file"));
		} else if (this.get("fileUrl")) {
			this.set("imageThumbnail", this.get("fileUrl"));
		} else {
			this.set("imageThumbnail", null);
		}
	}.observes("file", "fileUrl").on("change", "init"),

	isValidFileType: function(){
		var self = this;
		var isFileTypeMatch = false;

		Ember.$.each(this.get("allowedMimeTypes"), function(index, mimeType){
			if (self.get("file").type.match(mimeType)){
				isFileTypeMatch = true;
				return false;
			}
		});

		return isFileTypeMatch;
	}.property("file"),
	uploadPercentComplete: function(key, value){
		if (arguments.length > 1){
			if (value === 1){
				return null;
			} else {
				return value;
			}
		}
	}.property(),

	actions: {
		uploadFile: function(file){
			if (file){
				var self = this;

				Ember.$.ajax({
					url: this.get("uploadEndpoint") + "?fileName=" + file.name,
					xhr: function(){
						var XHR = new window.XMLHttpRequest();
						XHR.upload.addEventListener("progress", function(uploadEvent){
							console.log("triggered");
							if (uploadEvent.lengthComputable) {
								var uploadPercentComplete = uploadEvent.loaded / uploadEvent.total;
								self.set("uploadPercentComplete", uploadPercentComplete);
								console.log("upc", self.get("uploadPercentComplete"));
								console.log("upca", uploadPercentComplete);
							}
						}, false);
						return XHR;
					},
					type: "POST",
					data: file,
					dataType: "JSON",
					processData: false,
					success: function(data) {
						self.set("errorMessage", null);
						self.set("fileUrl", data.file_url);
						self.set("successMessage", "File uploaded!");
					},
					error: function() {
						self.set("imageThumbnail", "");
						self.set("errorMessage", "Problem uploading file");
					}
				});
			}
		},
		removeFile: function(){
			this.set("file", null);
			this.set("fileUrl", null);
			this.set("errorMessage", null);
			this.set("successMessage", null);
			this.set("urlVisible", false);
		},
		openFileDialog: function(){
			this.$(".file-input-field").click();
		},
		updateFile: function(){
			var file = this.$(".file-input-field").prop("files")[0];
			this.set("file", file);
		},
		toggleUrlVisible: function(){
			if (this.get("urlVisible")){
				this.set("urlVisible", false);
			} else {
				this.set("urlVisible", true);
			}
		},
		processDroppedFile: function(dropEvent){
			var file = dropEvent.dataTransfer.files[0];
			this.get("controller").set("file", file);
		}
	}
});