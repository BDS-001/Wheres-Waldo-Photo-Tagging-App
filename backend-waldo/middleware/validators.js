const { body, validationResult } = require('express-validator');

const validateGuess = [
    body('levelId')
      .exists()
      .withMessage('levelId is required')
      .isString()
      .withMessage('levelId must be a string')
      .notEmpty()
      .withMessage('levelId cannot be empty')
      .trim(),
  
    body('characterId')
      .exists()
      .withMessage('characterId is required')
      .isString()
      .withMessage('characterId must be a string')
      .notEmpty()
      .withMessage('characterId cannot be empty')
      .trim(),
  
    body('selection')
      .exists()
      .withMessage('selection is required')
      .isObject()
      .withMessage('selection must be an object')
      .customSanitizer((value) => {
        const requiredFields = ['x', 'y', 'width', 'height'];
        
        const hasAllFields = requiredFields.every(field =>
          typeof value[field] === 'number' && 
          !isNaN(value[field]) && 
          isFinite(value[field])
        );
        
        if (!hasAllFields) {
          throw new Error('selection must contain valid x, y, width, and height values');
        }
  
        if (value['width'] <= 0 || value['height'] <= 0) {
          throw new Error('width and height must be positive numbers');
        }
  
        // Return only the required fields as a sanitized object
        return ({x, y, width, height} = value);
      }),
  ];

  const leaderboardEntryValidators = [
    body('playerName')
      .trim()
      .isLength({ min: 1, max: 20 })
      .withMessage('Player name must be between 1 and 20 characters')
      .matches(/^[A-Za-z0-9 -_]+$/)
      .withMessage('Player name can only contain letters, numbers, spaces, underscores, hyphens'),
  
    body('levelId')
      .isInt({ min: 1 })
      .withMessage('Level ID must be a positive integer'),
  
    body('timeSeconds')
      .isFloat({ min: 0 })
      .withMessage('Time must be a positive number')
  ];
  
  // Collection of all validators
  const validators = {
    guess: validateGuess,
    loaderboard: leaderboardEntryValidators,

  };
  
  function validationResults(validator) {
    if (!validators[validator]) {
      throw new Error(`Validator '${validator}' not found`);
    }
  
    return [
      ...validators[validator],
      (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
          return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(err => ({
              field: err.path,
              message: err.msg,
              value: err.value
            }))
          });
        }
        
        next();
      }
    ];
  }

  module.exports = {validationResults}