const getDateFileText = () => {
  const today = new Date();

  let dateText = "";
  let monthText = "";

  if (today.getDate() < 10) {
    dateText = "0" + today.getDate().toString();
  }
  else {
    dateText = today.getDate().toString();
  }

  if (today.getMonth() + 1 < 10) {
    monthText = "0" + (today.getMonth() + 1).toString();
  }
  else {
    monthText = (today.getMonth() + 1).toString();
  }

  let yearText = today.getFullYear().toString();

  return dateText + monthText + yearText;
}

module.exports = getDateFileText;