const express = require('express')
const fs = require('fs')
const multer = require('multer')
require('dotenv').config()
const database = require("./database.js");
const cors = require('cors');


const upload = multer({ dest: 'images/' })

const app = express()

app.use(cors());
app.use('/images', express.static('images'))
// Before the other routes
app.use(express.static("build"))

app.post('/api/images', upload.single('image'), async(req, res) => {
  const file_name = req.file.path
  const description = req.body.description
  // Save this data to a database probably
  const data = req.body
  console.log(data);
  await database.addImage(file_name,description)
  res.send({description, file_name})
})

// Get a list of all the images from the database
app.get("/api/images", async(req, res) => {
  const images = await database.getImages();
  // console.log(images)
  res.send({images})
})

// Get the single image file, given the file path
// app.get('/api/images/images/:imageName', (req, res) => {
  app.get('/api/image/*', (req, res) => {
    // do a bunch of if statements to make sure the user is 
    // authorized to view this image, then
  
    const file_name = req.params[0]
    const readStream = fs.createReadStream(file_name)
    readStream.pipe(res)
  })
  
// After all other routes
app.get('*', (req, res) => {
  res.sendFile('build/index.html')})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))