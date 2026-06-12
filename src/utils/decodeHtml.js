export const decodeHtml = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;

  return textarea.value;
};