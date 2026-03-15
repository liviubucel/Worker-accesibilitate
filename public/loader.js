(function () {
  var currentScript = document.currentScript;
  var baseUrl = new URL(currentScript && currentScript.src ? currentScript.src : window.location.href);
  var bundleCandidates = [
    new URL("/assets/zbt-accessibility.umd.js", baseUrl.origin).toString(),
    new URL("/dist/zbt.min.js", baseUrl.origin).toString()
  ];
  var loaded = false;

  function emit(name, detail) {
    if (typeof window.CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent(name, { detail: detail }));
    }
  }

  function loadBundle(index) {
    if (loaded || index >= bundleCandidates.length) {
      if (!loaded) {
        emit("zbt-widget-load-error", { attempted: bundleCandidates.slice() });
      }
      return;
    }

    var widgetScript = document.createElement("script");
    widgetScript.src = bundleCandidates[index];
    widgetScript.defer = true;
    widgetScript.crossOrigin = "anonymous";

    ["position", "offset", "size", "statement-url", "feedback-url"].forEach(function (key) {
      var attr = "data-asw-" + key;
      var value = currentScript && currentScript.getAttribute(attr);
      if (value) {
        widgetScript.setAttribute(attr, value);
      }
    });

    widgetScript.onload = function () {
      loaded = true;
      emit("zbt-widget-loaded", { src: widgetScript.src });
    };

    widgetScript.onerror = function () {
      widgetScript.remove();
      loadBundle(index + 1);
    };

    document.head.appendChild(widgetScript);
  }

  loadBundle(0);
})();
