import express from 'express'
import {DB} from '../utils/db.js'

const router = express.Router()
router.post('/add_categories', (req, res)=>{
    const sql = "INSERT INTO category (`name`) VALUES(?)"
    DB.query(sql, [req.body.category], (err, result)=>{
        if(err) return res.json({Status: false, Error: "Query error"})
        return res.json({Status: true})
    })
})
router.get('/categories', (req, res)=>{
    const sql = "SELECT * FROM category"
    DB.query(sql, (err, result)=>{
        if(err) return res.json({Status: false, Error: "Query error"})
        return res.json({Status: true, Result: result})
    })
})
router.delete('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const sql = 'DELETE FROM category WHERE id = ?';
  
    DB.query(sql, [categoryId], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Query error' });
  
      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: 'Category deleted successfully' });
      } else {
        return res.json({ Status: false, Error: 'Category not found or already deleted' });
      }
    });
  });
  router.put('/categories/:id', (req, res) => {
    const categoryId = req.params.id;
    const newCategoryName = req.body.newCategoryName;
  
    const sql = 'UPDATE category SET name = ? WHERE id = ?';
  
    DB.query(sql, [newCategoryName, categoryId], (err, result) => {
      if (err) return res.json({ Status: false, Error: 'Query error' });
  
      if (result.affectedRows > 0) {
        return res.json({ Status: true, Message: 'Category updated successfully' });
      } else {
        return res.json({ Status: false, Error: 'Category not found or not updated' });
      }
    });
  }); 
export {router as CategoryRouter}