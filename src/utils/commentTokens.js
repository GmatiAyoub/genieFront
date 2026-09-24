const KEY = "commentTokens";

export function saveToken(commentId, token) {
  const tokens = JSON.parse(localStorage.getItem(KEY) || "{}");
  tokens[commentId] = token;
  localStorage.setItem(KEY, JSON.stringify(tokens));
}

export function getToken(commentId) {
  const tokens = JSON.parse(localStorage.getItem(KEY) || "{}");
  return tokens[commentId] || null;
}