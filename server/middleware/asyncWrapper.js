// server/middleware/asyncWrapper.js

/**
 * @desc    A middleware to wrap async functions and catch errors.
 *          This avoids writing try-catch blocks in every async controller.
 * @param   {Function} fn The async function to wrap.
 */
const asyncWrapper = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncWrapper;