function unescape(string) {
  const characters = [
    ["&lt;", "<"],
    ["&gt;", ">"],
    ["&amp;", "&"],
    ["&#x27;", "'"],
    ["&quot;", '"'],
    ["&#x2F;", "/"],
  ];

  return characters.reduce(
    (acc, [key, value]) => acc.replaceAll(key, value),
    string,
  );
}

module.exports = unescape;
