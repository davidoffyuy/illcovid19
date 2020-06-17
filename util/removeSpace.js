const removeSpace = (str, type) => {
  if (type === 'trailing') {
    return str.replace(/\s+$/g, '');
  }
  else if (type === 'leading') {
    return str.replace(/^\s+/g, '');
  }
  else {
    return str.replace(/\s/g, '');
  }
}

module.exports = removeSpace;