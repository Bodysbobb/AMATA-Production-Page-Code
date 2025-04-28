document.addEventListener("DOMContentLoaded", function () {
  const rootStyles = getComputedStyle(document.documentElement);

  var elements = document.querySelectorAll(".animate-by-letter");

  Array.prototype.forEach.call(elements, function (el) {
    // Get element-specific delay or fall back to global CSS variable
    const letterDelay = parseFloat(el.dataset.letterDelay) || parseFloat(rootStyles.getPropertyValue('--letter-delay')) || 0.05;
    const initialDelay = parseFloat(el.dataset.initialDelay) || parseFloat(rootStyles.getPropertyValue('--initial-delay')) * 1000 || 0;

    var text = el.textContent.trim();
    el.classList.remove("init-hidden");
    el.style.visibility = "visible";
    el.style.height = "auto";
    el.style.overflow = "visible";
    el.textContent = "";

    var finalClass = el.dataset.finalClass || "animation-complete";
    var words = text.split(/(\s+)/);
    var index = 0;

    setTimeout(function () {
      words.forEach(function (word) {
        if (/^\s+$/.test(word)) {
          var space = document.createElement("span");
          space.innerHTML = "&nbsp;";
          space.style.display = "inline-block";
          el.appendChild(space);
          return;
        }

        var wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.style.display = "inline-block";

        for (var i = 0; i < word.length; i++) {
          var span = document.createElement("span");
          span.textContent = word[i];
          span.style.opacity = "0";
          span.style.display = "inline-block";
          span.style.animation = "fadeInLetters 0.3s ease-in-out forwards";
          span.style.animationDelay = (index * letterDelay) + "s";
          wordSpan.appendChild(span);
          index++;
        }

        el.appendChild(wordSpan);
      });

      setTimeout(function () {
        el.classList.add(finalClass);
      }, index * (letterDelay * 1000) + 400);
    }, initialDelay); 
  }); 
});

document.addEventListener("DOMContentLoaded", function () {
  const rootStyles = getComputedStyle(document.documentElement);
  var elements = document.querySelectorAll(".animate-thai");

  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    var segmenter = new Intl.Segmenter("th", { granularity: "grapheme" });

    Array.prototype.forEach.call(elements, function (el) {
      // Get element-specific delay settings
      const letterDelay = parseFloat(el.dataset.letterDelay) || parseFloat(rootStyles.getPropertyValue('--letter-delay')) || 0.07;
      const initialDelay = parseFloat(el.dataset.initialDelay) || parseFloat(rootStyles.getPropertyValue('--initial-delay')) * 1000 || 0;
      const finalClass = el.dataset.finalClass || "animation-complete";

      var text = el.textContent.trim();
      el.classList.remove("init-hidden");
      el.style.visibility = "visible";
      el.style.height = "auto";
      el.style.overflow = "visible";
      el.textContent = "";

      var words = text.split(" ");
      var index = 0;

      setTimeout(function () {
        words.forEach(function (word, w) {
          var wordSpan = document.createElement("span");
          wordSpan.className = "word";
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";

          var segments = Array.from(segmenter.segment(word), s => s.segment);
          for (var i = 0; i < segments.length; i++) {
            var span = document.createElement("span");
            span.textContent = segments[i];
            span.style.opacity = "0";
            span.style.display = "inline-block";
            span.style.animation = "fadeInLetters 0.8s ease-in-out both";
            span.style.animationDelay = (index * letterDelay) + "s";
            wordSpan.appendChild(span);
            index++;
          }

          el.appendChild(wordSpan);

          if (w < words.length - 1) {
            var space = document.createElement("span");
            space.textContent = "\u00A0"; // Non-breaking space
            space.style.display = "inline-block";
            space.style.opacity = "0";
            space.style.animation = "fadeInLetters 0.8s ease-in-out both";
            space.style.animationDelay = (index * letterDelay) + "s";
            el.appendChild(space);
            index++;
          }
        });

        setTimeout(function () {
          el.classList.add(finalClass);
        }, index * (letterDelay * 1000) + 400);
      }, initialDelay);
    });
  } else {
    console.warn("Intl.Segmenter not available for Thai text animation");
  }
});