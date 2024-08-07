import express from 'express'
import {DB} from '../utils/db.js'

const router = express.Router()

router.post('/add_pages', (req, res) => {
    const sql = `INSERT INTO pages (title, content) VALUES(?,?)`
    const values = [
        req.body.title,
        req.body.content,
    ];

    DB.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ Status: false, Error: "Query error" });
        }

        return res.json({ Status: true });
    });
})
router.get('/all_pages', (req, res)=>{
    const sql = "SELECT * FROM pages"
    DB.query(sql, (err, result)=>{
        if(err) return res.json({Status: false, Error: "Query error"})
        return res.json({Status: true, Result: result})
    })
});
router.delete('/page/:id', (req, res) => {
    const pagesID = req.params.id;
    const sql = 'DELETE FROM pages WHERE id = ?';
  
    DB.query(sql, [pagesID], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Query error' });
  
      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: 'Post deleted successfully' });
      } else {
        return res.json({ Status: false, Error: 'Post not found or already deleted' });
      }
    });
  });

  
  router.put('/page/:id', (req, res) => {
    const pageID = req.params.id;
    const newPageTitle = req.body.title; // Update field name
    const newPageContent = req.body.content; // Update field name
  
    const sql = 'UPDATE pages SET title=?, content=? WHERE id=?';
  
    DB.query(sql, [newPageTitle, newPageContent, pageID], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Query error' });
  
      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: 'Page updated successfully' });
      } else {
        return res.json({ Status: false, Error: 'Page not found or not updated' });
      }
    });
  });
  
  router.get('/page/:id', (req, res) => {
    const postId = req.params.id;
    const sql = "SELECT * FROM pages WHERE id = ?";
    
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
export {router as PagesRouter}