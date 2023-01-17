const express = require('express')
const fs = require('fs')
const multer = require('multer')

const upload = multer({ dest: 'images/' })

const app = express()

// app.use('/images', express.static('images'))
app.get('/images/:imageName', (req, res) => {
  // do a bunch of if statements to make sure the user is 
  // authorized to view this image, then

  const imageName = req.params.imageName
  const readStream = fs.createReadStream(`images/${imageName}`)
  readStream.pipe(res)
})

app.post('/api/images', upload.single('image'), (req, res) => {
  const imagePath = req.file.path
  const description = req.body.description

  // Save this data to a database probably

  console.log(description, imagePath)
  res.send({description, imagePath})
})

const port = process.env.PORT || 8080
app.listen(8080, () => console.log("listening on port 8080"))