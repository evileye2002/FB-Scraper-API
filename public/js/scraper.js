import { getTime, getPage } from "./helpers.js";

//fields
const url = "/motivation";
const keyValues = window.location.search;
const urlParams = new URLSearchParams(keyValues);

let page = 1;
let sortBy = "likes";
let topics = "";
if (urlParams.has("page")) page = urlParams.get("page");
if (urlParams.has("sortBy")) sortBy = urlParams.get("sortBy");
if (urlParams.has("topics")) topics = urlParams.get("topics");

const dateTimes = $(".card-body p.text-black-50");
const previous = $("nav a.previous");
const next = $("nav a.next");
const formSearch = $("#formSearch");
const searchImput = $("#searchImput");
const sortInputs = $("#sortBy input");
const topicInputs = $("#topicInputs input");

//events
dateTimes.each((i, element) => {
  $(element).text(getTime($(element).text()));
});

previous.each((i, element) => {
  $(element).attr("href", getPage(Number(page) - 1, urlParams));
});

next.each((i, element) => {
  $(element).attr("href", getPage(Number(page) + 1, urlParams));
});

formSearch.submit((e) => {
  e.preventDefault();
  if (searchImput.val() == "") return;

  urlParams.set("search", searchImput.val());
  urlParams.set("page", "1");

  window.location.href = `${url}?${urlParams.toString()}`;
});

sortInputs.change((e) => {
  urlParams.set("page", "1");
  urlParams.set("sortBy", e.target.value);

  window.location.href = `${url}?${urlParams.toString()}`;
});

topicInputs.click((e) => {
  const cb = $(`#${e.target.value}`);
  if (cb.hasClass("checked")) cb.removeClass("checked");
  else cb.addClass("checked");
});

$("#topics").click(() => {
  topics = "";
  topicInputs.each((i, element) => {
    if ($(element).hasClass("checked")) topics += $(element).val() + ",";
  });

  if (topics == "") {
    window.location.href = "http://localhost:4602" + url;
    return;
  }
  const urlParams = new URLSearchParams(
    new URL("http://localhost:4602" + url).search
  );
  urlParams.set("page", "1");
  urlParams.set("topics", topics);

  window.location.href = `${url}?${urlParams.toString()}`;
});
