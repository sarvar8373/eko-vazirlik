import express from 'express'
import {DB} from '../utils/db.js'



const router = express.Router()

router.get('/', async (req, res) => {
    try {
      const usersCount = await getCount('users');
      const categoriesCount = await getCount('category');
      const postsCount = await getCount('posts');
      const pagesCount = await getCount('pages');
      return res.json({ Status: true, Result: { users: usersCount, categories: categoriesCount, posts: postsCount, pages: pagesCount } });
    } catch (error) {
      console.error(error);
      return res.json({ Status: false, Error: 'Query error' });
    }
  });
  
  async function getCount(tableName) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) AS count FROM ${tableName}`;
      DB.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].count);
        }
      });
    });
  }

  export {router as Statistics}