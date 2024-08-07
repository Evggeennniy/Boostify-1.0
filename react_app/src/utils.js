const numFilter = /^[0-9]+/;
const originFilter =
  /^(https:\/\/)(www\.|vm\.)?(instagram|tiktok|t)(\.com|\.me)?/;
const instagramFilter = /^\/(p|reel|[A-Za-z0-9._]+)(\/[A-Za-z0-9_.]+)?/;
const instagramObjects = {
  p: "post",
  reel: "reel",
};
const tiktokFilter = /^\/([@])?[A-Za-z0-9._]+\/?(video)?/;
const tiktokObjects = {
  "@": "profile",
  "@video": "video",
};

const telegramFilter = /^\/([A-Za-z0-9._+]+)\/?([A-Za-z0-9._]+)?/;

const identifyTelegramObject = (urlParams) => {
  const paramsMatch = telegramFilter.exec(urlParams);
  if (!paramsMatch) return;

  const firstMatch = paramsMatch[1];
  const secondMatch = paramsMatch[2];
  let objectName = undefined;

  if (firstMatch && !secondMatch) {
    objectName = "group";
  } else if (firstMatch && secondMatch) {
    objectName = "post";
  }

  return objectName;
};

const identifyTiktokObject = (urlParams) => {
  const paramsMatch = tiktokFilter.exec(urlParams);
  if (!paramsMatch) return;

  const firstMatch = paramsMatch[1];
  const secondMatch = paramsMatch[2];
  let objectName = tiktokObjects[`${firstMatch}${secondMatch || ""}`];

  if (!objectName && secondMatch) {
    objectName = undefined;
  } else if (!objectName && !secondMatch) {
    objectName = "video";
  }

  return objectName;
};

const identifyInstagramObject = (urlParams) => {
  const paramsMatch = instagramFilter.exec(urlParams);
  if (!paramsMatch) return;

  const firstMatch = paramsMatch[1];
  const secondMatch = paramsMatch[2];
  let objectName = instagramObjects[firstMatch];

  if (objectName && !secondMatch) {
    objectName = undefined;
  } else if (!objectName && !secondMatch) {
    objectName = "profile";
  }

  return objectName;
};

const identifyFuncs = {
  instagram: identifyInstagramObject,
  tiktok: identifyTiktokObject,
  t: identifyTelegramObject,
};

const identifyUrl = (url) => {
  const originMatch = originFilter.exec(url);
  if (!originMatch) return;
  const fullMatch = originMatch[0];
  const originName = originMatch[3];
  const urlParams = url.replace(fullMatch, "");
  const identifyFunc = identifyFuncs[originName];
  const objectName = identifyFunc(urlParams);
  if (!objectName) return;
  return `${originName}:${objectName}`;
};

const currentDataTime = () => {
  const now = new Date();

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("ru-RU", options);

  return formatter.format(now);
};

export {
  numFilter,
  originFilter,
  instagramFilter,
  instagramObjects,
  identifyInstagramObject,
  identifyFuncs,
  identifyUrl,
  currentDataTime,
};
