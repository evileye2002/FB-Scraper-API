function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function convertToDate(dateString) {
  const regex = /(\d{1,2}) tháng (\d{1,2})(?:, (\d{4}))? lúc (\d{1,2}):(\d{2})/;
  const match = dateString.match(regex);

  if (match) {
    let [, day, month, year, hours, minutes] = match;

    if (!year) {
      const currentYear = new Date().getFullYear();
      year = currentYear.toString();
    }

    const dateObject = new Date(year, month - 1, day, hours, minutes);

    return dateObject;
  } else {
    return "";
  }
}

function removeDuplicate(array, mode = "") {
  let res = null;
  if (mode === "id") {
    res = array.filter((item1, index) => {
      return (
        index ===
        array.findIndex((item2) => {
          return item1.id === item2.id;
        })
      );
    });
  } else {
    res = array.filter((item1, index) => {
      return (
        index ===
        array.findIndex((item2) => {
          return item1 === item2;
        })
      );
    });
  }

  return res;
}

module.exports = {
  sleep,
  convertToDate,
  removeDuplicate,
};
