export function getTime(datetime, locale = null, options = null) {
  locale = locale ?? "vi-VN";
  options = options ?? {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    // second: "numeric",
    hour12: false,
  };

  const date = new Date(datetime).toLocaleString(locale, options);

  return date;
}

export function getPage(value, urlParams) {
  const url = "/motivation";
  urlParams.set("page", value);

  return `${url}?${urlParams.toString()}`;
}
