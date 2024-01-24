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

function removeDup(array) {
  let res = null;
  array.sort((a, b) => b.likes - a.likes);

  res = array.filter((item1, index) => {
    return (
      index ===
      array.findIndex((item2) => {
        return (
          item1.creatorID === item2.creatorID &&
          item1.dateTime === item2.dateTime
        );
      })
    );
  });

  return res;
}

function rating(likes, cmts, caption) {
  let score = 0;
  const rate = cmts / likes;

  const keys = [
    "health",
    "success",
    "mind",
    "inspiration",
    "body",
    "love",
    "challenge",
    "fitness",
    "quote",
    "workout",
  ];

  switch (true) {
    case likes >= 1000000:
      score = 3;
      break;
    case likes >= 100000:
      score = 2.5;
      break;
    case likes >= 10000:
      score = 2;
      break;
    case likes >= 1000:
      score = 1.5;
      break;
    case likes >= 100:
      score = 1;
      break;
    case likes > 0:
      score = 0.5;
      break;
    default:
      score = 0;
  }

  switch (true) {
    case rate >= 1:
      score += 2.5;
      break;
    case rate >= 0.75:
      score += 2;
      break;
    case rate >= 0.5:
      score += 1.5;
      break;
    case rate >= 0.25:
      score += 1;
      break;
    case rate > 0:
      score += 0.5;
      break;
    default:
      score += 0;
  }

  keys.forEach((key) => {
    if (caption.includes(key)) {
      score += 0.5;
    }
  });

  return score;
}

module.exports = {
  sleep,
  convertToDate,
  removeDup,
  rating,
};
