
## What is Cloudinary ?

* Cloudinary is a cloud-based image and video management platform that provides a comprehensive set of tools for storing optimizing and delivering media content.

* Now image data can be quite large and storing & retrieving the image data from the Mongodb and then displaying it in the UI can affect the performance of our application.

* So we will not store the image to the Mongodb database directly, instead we will save the image to the Cloudinary which will give us a url for that image and then we will save that url in the Mongodb database.

* We have done all the configurations in './cloudinary.js' file.