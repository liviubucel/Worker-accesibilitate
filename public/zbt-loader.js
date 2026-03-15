(function () {
  var currentScript = document.currentScript;
  var baseUrl = new URL(currentScript && currentScript.src ? currentScript.src : window.location.href);
  var bundleUrl = new URL("/assets/zbt-accessibility.umd.js", baseUrl.origin).toString();
  var widgetScript = document.createElement("script");

  widgetScript.src = bundleUrl;
  widgetScript.defer = true;
  widgetScript.crossOrigin = "anonymous";

  ["position", "offset", "size", "statement-url", "feedback-url"].forEach(function (key) {
    var attr = "data-asw-" + key;
    var value = currentScript && currentScript.getAttribute(attr);
    if (value) {
      widgetScript.setAttribute(attr, value);
    }
  });

  document.head.appendChild(widgetScript);
})();
