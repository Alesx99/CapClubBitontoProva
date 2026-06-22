const validateMenuItem = (req, res, next) => {
  const errors = [];
  let { section, title, description, price, available, position, is_event } = req.body;

  // Validate section
  if (section === undefined || section === null) {
    errors.push('Section is required.');
  } else if (typeof section !== 'string' || section.trim().length === 0 || section.trim().length > 60) {
    errors.push('Section must be a string between 1 and 60 characters.');
  } else {
    section = section.trim();
  }

  // Validate title
  if (title === undefined || title === null) {
    errors.push('Title is required.');
  } else if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 120) {
    errors.push('Title must be a string between 1 and 120 characters.');
  } else {
    title = title.trim();
  }

  // Validate description
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string' || description.length > 500) {
      errors.push('Description must be a string under 500 characters.');
    } else {
      description = description.trim();
    }
  } else {
    description = '';
  }

  // Validate price
  const parsedPrice = parseFloat(price);
  if (price === undefined || price === null || isNaN(parsedPrice)) {
    errors.push('Price is required and must be a valid number.');
  } else if (parsedPrice < 0 || parsedPrice > 9999) {
    errors.push('Price must be a number between 0 and 9999.');
  }

  // Normalize inputs and write to req.body
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation Error', details: errors });
  }

  req.body = {
    section,
    title,
    description,
    price: parsedPrice,
    available: available !== undefined ? !!available : true,
    position: position !== undefined ? parseInt(position, 10) : 0,
    is_event: is_event !== undefined ? !!is_event : false
  };

  next();
};

module.exports = {
  validateMenuItem
};
