

const express = require('express');
const router = express.Router();

const { checkJwt, checkRole } = require('../controllers/auth')
const {
  getBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  getBlogsByUser,
  deleteBlog } = require('../controllers/blogs');


router.get('', getBlogs);
router.get('/me', checkJwt, checkRole('admin'), getBlogsByUser);
router.get('/:id', getBlogById);
router.get('/s/:slug', getBlogBySlug);    // 🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶

router.post('', checkJwt, checkRole('admin'), createBlog);
router.patch('/:id', checkJwt, checkRole('admin'), updateBlog);

router.delete('/:id', checkJwt, checkRole('admin'), deleteBlog);  // 🔴🔴🔴🔴🔴

module.exports = router;
