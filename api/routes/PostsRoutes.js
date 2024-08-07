import express from 'express'
import {DB} from '../utils/db.js'
import multer from 'multer'
import path from 'path'



const router = express.Router()
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
      cb(null, 'uploads/')
    },
    filename: (req, file, cb)=>{
      cb(null, file.fieldname + "_" +Date.now() + path.extname(file.originalname))
    }
  })
const upload = multer({ storage: storage})

router.post('/add_posts', upload.single('image'), (req, res) => {
    console.log(req.body);

    const sql = `INSERT INTO posts (title, text, image, category_id, author_id) VALUES (?, ?, ?, ?, ?)`;

    const values = [
        req.body.title,
        req.body.text,
        req.file.filename,
        req.body.category_id,
        req.body.author_id,
    ];

    DB.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ Status: false, Error: "Query error" });
        }

        return res.json({ Status: true });
    });
});
router.delete('/post/:id', (req, res) => {
    const categoryId = req.params.id;
    const sql = 'DELETE FROM posts WHERE id = ?';
  
    DB.query(sql, [categoryId], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Query error' });
  
      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: 'Category deleted successfully' });
      } else {
        return res.json({ Status: false, Error: 'Category not found or already deleted' });
      }
    });
  });
  router.put('/post/:id', upload.single('image'), (req, res) => {
    const postID = req.params.id;
    const newPostTitle = req.body.title; // Update field name
    const newPostText = req.body.text; // Update field name
    const newPostImage = req.file ? req.file.filename : '';
    const newPostCategoryID = req.body.category_id; // Update field name
    const newPostAuthorID = req.body.author_id; // Update field name
  
    const sql = 'UPDATE posts SET title=?, text=?, image=?, category_id=?, author_id=? WHERE id=?';
  
    DB.query(sql, [newPostTitle, newPostText, newPostImage, newPostCategoryID, newPostAuthorID, postID], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Query error' });
  
      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: 'Post updated successfully' });
      } else {
        return res.json({ Status: false, Error: 'Post not found or not updated' });
      }
    });
  });
  
  router.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const sql = "SELECT * FROM posts WHERE id = ?";
    
    DB.query(sql, [postId], (err, result) => {
      if (err) {
        return res.json({ Status: false, Error: "Query error" });
      }
  
      // Check if a post with the specified ID was found
      if (result.length > 0) {
        return res.json({ Status: true, Result: result[0] }); // Return the first (and only) result
      } else {
        return res.json({ Status: false, Error: "Post not found" });
      }
    });
  });
  
router.get('/posts', (req, res)=>{
  const sql = "SELECT * FROM posts"
  DB.query(sql, (err, result)=>{
      if(err) return res.json({Status: false, Error: "Query error"})
      return res.json({Status: true, Result: result})
  })
})
export {router as PostsRouter}