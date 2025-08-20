

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
// Variable globale pour mémoriser la méthode recommandée
let methodeRecommandee = "";

/**
 * Met à jour le champ clé en fonction de l'algo choisi
 */
function updateKeyField(algo, mode) {
  if (mode === "encrypt") {
    const rsaOptions = document.getElementById("rsaEncryptionOptions");
    const customKeySection = document.querySelector(".custom-key-section");

    // Masquer tout par défaut
    rsaOptions.classList.add("d-none");
    customKeySection.classList.add("d-none");

    if (algo === "AES") {
      customKeySection.classList.remove("d-none");
    } else if (algo === "RSA") {
      rsaOptions.classList.remove("d-none");
    }
  }

  if (mode === "decrypt") {
    const container = document.getElementById("decryptKeyContainer");

    if (algo === "AES") {
      container.innerHTML = `
        <input type="text" id="decryptSecretKey" placeholder="Enter AES secret key" disabled />
      `;
    } else if (algo === "RSA") {
      container.innerHTML = `
        <textarea id="decryptSecretKey" placeholder="Paste RSA private key here" rows="8" disabled></textarea>
      `;
    }
  }
}
document.getElementById("decryptAlgorithm").addEventListener("change", function () {
  updateKeyField(this.value, "decrypt");
});


/**
 * Analyse du texte
 */
async function analyzeText(mode) {
  const inputId = mode === "encrypt" ? "encryptInputText" : "decryptInputText";
  const text = document.getElementById(inputId).value.trim();

  if (!text) return alert("Please enter some text.");

  try {
    const res = await fetch("http://127.0.0.1:5000/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    methodeRecommandee = data.recommended || "";

    // Affichage résultats
    document.getElementById("scoreValue").textContent = data.score || "No sensitive content detected";
    document.getElementById("methodValue").textContent = methodeRecommandee || "No specific method needed — you can use any method";
    document.getElementById("encryptionDetails").classList.remove("d-none");

    // Met à jour automatiquement le champ clé selon l'algo recommandé
    updateKeyField(methodeRecommandee, "encrypt");

  } catch (err) {
    alert("Error during analysis: " + err.message);
  }
}

// Surveille les changements de score pour changer la couleur
const observer = new MutationObserver(() => {
  const resultDiv = document.getElementById("analysisResult");
  const scoreText = document.getElementById("scoreValue").textContent.trim();

  resultDiv.classList.remove("alert-success", "alert-danger");

  // Vérifie le score numérique
  const score = parseInt(scoreText, 10);

  if (isNaN(score) || score <= 1) {
    // Score 1 ou pas de contenu sensible → vert
    resultDiv.classList.add("alert-success");
  } else if (score >= 2 && score <= 10) {
    // Score 2,3,4 → rouge
    resultDiv.classList.add("alert-danger");
  }
});

// Observer les changements du score
const scoreNode = document.getElementById("scoreValue");
observer.observe(scoreNode, { childList: true });

document.querySelectorAll(".copy-icon").forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.getAttribute("data-target");
    const textarea = document.getElementById(targetId);
    if (!textarea) return;

    textarea.select();
    textarea.setSelectionRange(0, 99999); // pour mobile
    navigator.clipboard.writeText(textarea.value)
      .then(() => {
        // Changement de couleur temporaire pour indiquer la copie
        icon.style.color = '#198754'; // vert
        setTimeout(() => icon.style.color = '#0d6efd', 800);
      })
      .catch(err => console.error("Erreur copie : ", err));
  });
});

/**
 * Chiffrement
 */
document.querySelector(".encrypt-btn").onclick = async () => {
  const text = document.getElementById("encryptInputText").value.trim();
  if (!text) {
    alert("Please enter text to encrypt.");
    return;
  }

  const algo = document.getElementById("encryptAlgorithm").value;
  let key = document.getElementById("encryptSecretKey").value.trim();

  // RSA : clé publique obligatoire
  if ((algo === "RSA" || methodeRecommandee === "RSA") && !key) {
    key = document.getElementById("rsaPublicKeyDisplay").textContent.trim();
  }
  if ((algo === "RSA" || methodeRecommandee === "RSA") && !key) {
    alert("RSA public key is required.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        method: algo === "auto" ? methodeRecommandee : algo,
        password: (algo === "AES" || methodeRecommandee === "AES") ? (key || null) : undefined,
        public_key: (algo === "RSA" || methodeRecommandee === "RSA") ? key : undefined
      })
    });

    const data = await res.json();

    // afficher résultat chiffré
    document.getElementById("encryptOutputText").value =
      data.result || "Error: " + (data.error || "Unknown error");

    // si backend a généré une clé AES, on l’affiche
    // si backend a généré une clé AES, on l’affiche via un toast
if (data.generated_key) {
  const toastBody = document.getElementById("toastAesKeyBody");
  toastBody.textContent = "Generated AES key: " + data.generated_key;

  const toastElement = document.getElementById("toastAesKey");
  const toast = new bootstrap.Toast(toastElement);
  toast.show();

  // copier automatiquement dans le presse-papier
  navigator.clipboard.writeText(data.generated_key)
    .then(() => console.log("AES key copied to clipboard ✅"))
    .catch(err => console.error("Clipboard error:", err));
}


  } catch (err) {
    alert("Encryption failed: " + err.message);
  }
};


/**
 * Déchiffrement
 */
document.querySelector(".decrypt-btn").onclick = async () => {
  const text = document.getElementById("decryptInputText").value.trim();
  const algo = document.getElementById("decryptAlgorithm").value;
  const key = document.getElementById("decryptSecretKey") ? document.getElementById("decryptSecretKey").value.trim() : "";

  if (!text) return alert("Please enter text to decrypt.");
  if ((algo === "AES" || algo === "RSA") && !key) {
    return alert(`${algo} key is required for decryption.`);
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        method: algo,
        password: algo === "AES" ? key : undefined,
        private_key: algo === "RSA" ? key : undefined
      })
    });

    const data = await res.json();
    document.getElementById("decryptOutputText").value =
      data.error ? "Error: " + data.error : (data.result || "No output received.");

  } catch (err) {
    alert("Decryption failed: " + err.message);
  }
};

/**
 * Génération de clés RSA
 */
document.getElementById("generateRsaKeysBtn").onclick = async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/generate_rsa_keys");
    const data = await res.json();

    document.getElementById("rsaPublicKeyDisplay").textContent = data.public_key;
    alert("Private Key (save it):\n" + data.private_key);

    // Téléchargement auto
    const blob = new Blob([data.private_key], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "private_key.pem";
    link.click();

  } catch (err) {
    alert("Erreur génération RSA : " + err.message);
  }
};

/**
 * Changement manuel d'algo
 */
document.getElementById("encryptAlgorithm").addEventListener("change", function () {
  updateKeyField(this.value, "encrypt");
});

document.getElementById("decryptAlgorithm").addEventListener("change", function () {
  updateKeyField(this.value, "decrypt");
});

