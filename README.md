# Image-upload-component

This README outlines the details of collaborating on this Ember application.

## Component "Installation"
In the absence of a good way to package components, these are the files that make up the component:
* app/components/file-upload.js
* app/templates/components/file-upload.js
* app/styles/file-upload.css
* app/views/drop-zone.js

Put those wherever it makes sense to for your application. Use it like this:
> {{file-upload
>	label="This will display at the top of the component"
>	uploadEndpoint="http://www.where-are-files/going/to/be/sent"
>	allowedMimeTypes=variableThatHoldsAnArrayOfMIMETypes
>	fileUrlBinding="variableYouWantTheFileLocationToBindTo"
> }}

* MIME-types are in this format: "images.*", "application.pdf", etc.
* The component expects that your upload endpoint will return something like this:
> {
> 	"file_url" : "heres/my/file.jpg"
> }

## Demo Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://iamstef.net/ember-cli/](http://iamstef.net/ember-cli/).
