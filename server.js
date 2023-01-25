// const express = require('express')
import express from 'express'
import sharp from 'sharp'

// const fs = require('fs')
import fs from 'fs'

// const multer = require('multer')
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

// const database = require("./database.js");
import * as database from './database.js'

// // const cors = require('cors');
import cors from 'cors'
import * as s3 from './s3.js'

import crypto from 'crypto'
import { PutBucketVersioningCommand } from '@aws-sdk/client-s3'

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// const upload = multer({ dest: 'images/' })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const app = express()

app.use(cors());
app.use('/images', express.static('images'))
// Before the other routes
app.use(express.static("build"))


// app.post('/api/images', upload.single('image'), async(req, res) => {
//   const file_name = req.file.path
//   const description = req.body.description
//   // Save this data to a database probably
//   const data = req.body
//   console.log(data);
//   await database.addImage(file_name,description)
//   res.send({description, file_name})
// })

app.post("/api/images", upload.single('image'), async (req, res) => {
  console.log("test");
  // Get the data from the post request
  const description = req.body.description
  const fileBuffer = req.file.buffer
  const mimetype = req.file.mimetype
  const fileName = generateFileName() //"a_file_name" //

  // process image here!
  const fileBufferSharp = await sharp(fileBuffer)
  .resize({ height: 100, width: 100, fit: "contain" })
  .toBuffer()

  // Store the image in s3
  const s3Result = await s3.uploadImage(fileBufferSharp, fileName, mimetype)

  // Store the image in the database
  const databaseResult = await database.addImage(fileName, description)

  console.log(databaseResult);
  res.status(201).send(databaseResult)
})

// this one
app.get("/api/images", async (req, res) => {
  const images = await database.getImages();

  // Add the signed url to each image
  for (const image of images) {
    console.log(image.file_name)
    image.imageURL = await s3.getSignedUrl(image.file_name)

  }
  console.log(images)
  res.send(images)
})

app.delete("/api/images/:id", async (req, res) => {
  const name = req.params.id
  const post = await s3.deleteImage(id)

    // Store the image in the database
  const databaseResult = await database.deleteImage(fileName, description)

  console.log(post);
})


// // Get a list of all the images from the database
// app.get("/api/images", async(req, res) => {
//   const images = await database.getImages();
//   // console.log(images)
//   res.send({images})
// })

// Get the single image file, given the file path
// app.get('/api/images/images/:imageName', (req, res) => {

  // app.get('/api/image/*', (req, res) => {
  //   // do a bunch of if statements to make sure the user is 
  //   // authorized to view this image, then
  
  //   const file_name = req.params[0]
  //   const readStream = fs.createReadStream(file_name)
  //   readStream.pipe(res)
  // })
  
// After all other routes
app.get('*', (req, res) => {
  res.sendFile('build/index.html')})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))