const express = require('express');
const router = express.Router();
const {
  submitContactQuery,
  getContactQueries,
  updateContactQueryStatus
} = require('../controllers/contact.controller');
const { protect, allowRoles } = require('../middleware/auth.middleware');

router.post('/', submitContactQuery);
router.get('/', protect, allowRoles('superadmin', 'manager'), getContactQueries);
router.put('/:id', protect, allowRoles('superadmin', 'manager'), updateContactQueryStatus);

module.exports = router;