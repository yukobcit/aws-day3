// const mysql = require("mysql2")
import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql
  .createPool({
    // host: process.env.MYSQL_HOST,
    // user: process.env.MYSQL_USER,
    // password: process.env.MYSQL_PASSWORD,
    // database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,

  })
  .promise()

export async function getImages() {
  let query = `
  SELECT * 
  FROM images
  ORDER BY created DESC
  `

  const [rows] = await pool.query(query);
  return rows
}
// exports.getImages = getImages

export async function getImage(id) {
  let query = `
  SELECT * 
  FROM images
  WHERE id = ?
  `

  const [rows] = await pool.query(query, [id]);
  const result = rows[0];
  return result
}
// exports.getImage = getImage

export async function addImage(filename, description) {
  let query = `
  INSERT INTO images (file_name, description)
  VALUES(?, ?)
  `

  const [result] = await pool.query(query, [filename, description]);
  const id = result.insertId

  return await getImage(id)
}

export async function deleteImage(filename) {
  let query = `
  DELETE FROM images WHERE file_name = ? 
  `

  const [result] = await pool.query(query, [filename]);
  const id = result.insertId

  return 
}

// exports.addImage = addImage
