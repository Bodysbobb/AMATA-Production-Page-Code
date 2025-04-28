document.addEventListener("DOMContentLoaded", function () {
  const quoteLines = Array.from(document.querySelectorAll(".quote-line"));
  const signatureElem = document.getElementById("quote-signature");
  const signatureText = document.querySelector(".signature-text");
  const leftQuoteElem = document.getElementById("left-quote");
  const rightQuoteElem = document.getElementById("right-quote");
  const toggleBtn = document.getElementById("quote-toggle-btn");

  let isFinished = false;
  let allTimeouts = [];

  function clearAllTimeouts() {
    allTimeouts.forEach(clearTimeout);
    allTimeouts = [];
  }

  function setSafeTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    allTimeouts.push(id);
  }

  function animateText(element, text, startDelay, letterDelay) {
    let i = 0;
    element.innerHTML = '';
    [...text].forEach((char) => {
      const span = document.createElement("span");
      span.innerHTML = char === " " ? "&nbsp;" : char;
      span.style.opacity = "0";
      span.style.display = "inline-block";
      element.appendChild(span);
    });
    const letters = element.querySelectorAll("span");
    function revealNext() {
      if (i < letters.length) {
        letters[i].style.opacity = "1";
        i++;
        setSafeTimeout(revealNext, letterDelay);
      }
    }
    setSafeTimeout(revealNext, startDelay);
  }

  function runQuoteAnimation() {
    clearAllTimeouts();
    isFinished = false;
    leftQuoteElem.style.opacity = "0";
    rightQuoteElem.style.opacity = "0";
    signatureElem.style.opacity = "0";
    signatureText.classList.remove("animate-line");
    
    // Remove animation-complete class to reset colors
    quoteLines.forEach(line => {
      line.classList.remove("animation-complete");
    });

    let delay = 500;
    quoteLines.forEach(elem => {
      const text = elem.innerText;
      animateText(elem, text, delay, 80);
      delay += text.length * 80 + 600;
    });

    setSafeTimeout(() => rightQuoteElem.style.opacity = "1", delay + 400);
    setSafeTimeout(() => {
      signatureElem.style.opacity = "1";
      setTimeout(() => {
        void signatureText.offsetWidth;
        signatureText.classList.add("animate-line");
        
        // Add animation-complete class to change colors via CSS
        setTimeout(() => {
          quoteLines.forEach(line => {
            line.classList.add("animation-complete");
          });
        }, 500);
      }, 500);
      isFinished = true;
    }, delay + 800);
    setSafeTimeout(() => leftQuoteElem.style.opacity = "1", 300);
  }

  function finishImmediately() {
    clearAllTimeouts();
    leftQuoteElem.style.opacity = "1";
    rightQuoteElem.style.opacity = "1";
    signatureElem.style.opacity = "1";
    signatureText.classList.remove("animate-line");
    void signatureText.offsetWidth;
    signatureText.classList.add("animate-line");

    quoteLines.forEach(elem => {
      const text = elem.innerText;
      elem.innerHTML = text
        .split("")
        .map(char => `<span style="opacity: 1;">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
      elem.classList.add("animation-complete");
    });

    isFinished = true;
  }

  toggleBtn?.addEventListener("click", () => {
    isFinished ? runQuoteAnimation() : finishImmediately();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        runQuoteAnimation();
      }
    });
  }, { threshold: 0.3 });

  const quoteElement = document.getElementById("quote");
  if (quoteElement) observer.observe(quoteElement);
});