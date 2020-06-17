const removeSpace = (str, type) => {
  if (type === 'trailing') {
    return str.replace(/\s+$/g, '');
  }
  if (type === 'leading') {
    return str.replace(/^\s+/g, '');
  }
  if (type === 'all') {
    return str.replace(/\s/g, '');
  }
}

module.exports = removeSpace;