document.addEventListener("DOMContentLoaded", () => {
  // --- ÉLÉMENTS DOM ---
  const introLayer = document.getElementById("intro-layer");
  const uiLayer = document.getElementById("ui-layer");
  const characterImg = document.getElementById("character-img");
  const characterLayer = document.getElementById("character-layer"); // Pour le cacher
  const magicLayer = document.getElementById("magic-layer");
  const magicGif = document.getElementById("magic-gif");
  const contractContainer = document.getElementById("contract-container");
  const signatureCanvas = document.getElementById("signature-canvas");
  const ctx = signatureCanvas.getContext("2d");
  const penCursor = document.getElementById("pen-cursor");

  // NOUVEAU LAYER ITEM
  const itemLayer = document.getElementById("item-layer");

  const dialogueBox = document.getElementById("dialogue-box");
  const nameTag = document.getElementById("name-tag");
  const textContent = document.getElementById("text-content");
  const nextBtn = document.getElementById("next-btn");

  // --- SONS ---
  const audioTyping = document.getElementById("typing-sound");
  const audioBrush = document.getElementById("brush-sound");

  // --- ETAT DU JEU ---
  let currentStep = 0;
  let isTyping = false;
  let isSigning = false;

  // --- ASSETS ---
  const imgYubaba = "assets/utils/yubaba.png";
  const imgYubabaReading = "assets/utils/yubabaReading.png";
  const imgZeniba = "assets/utils/yubaba.png"; // Assure-toi d'avoir cette image ou remets yubaba si pas dispo

  const gifMagicSteal = "assets/gif/debutContrat.gif";
  const gifMagicEnd = "assets/gif/finContrat.gif";

  // =========================================================
  // 1. MOTEUR DE SCÉNARIO
  // =========================================================

  function nextStep() {
    if (isTyping) return;
    currentStep++;
    console.log("Étape : " + currentStep);

    switch (currentStep) {
      case 1: // Intro GIF
        playIntroGif();
        break;
      case 2: // Yubaba parle (Bienvenue)
        showYubabaIntro();
        break;
      case 3: // NOUVEAU : Yubaba donne le stylo
        offerPen();
        break;
      case 4: // Le Contrat (Signature)
        showContract();
        break;
      case 5: // Yubaba lit
        yubabaReadsContract();
        break;
      case 6: // Vol du nom (GIF)
        stealNameSequence();
        break;
      case 7: // "Tu m'appartiens"
        yubabaClaim();
        break;
      case 8: // Zeniba arrive
        zenibaAppears();
        break;
      case 9: // Yubaba revient
        yubabaReturns();
        break;
      case 10: // Fin
        textContent.innerHTML = "<i>Fin de l'introduction.</i>";
        nextBtn.style.display = "none";
        break;
    }
  }

  nextBtn.addEventListener("click", () => {
    // Bloque le bouton si on doit faire une action spéciale
    if (currentStep === 3) return; // Faut prendre le stylo
    if (currentStep === 4) return; // Faut signer
    if (currentStep === 6) return; // Séquence auto

    nextStep();
  });

  // =========================================================
  // 2. DÉTAIL DES ÉTAPES
  // =========================================================

  function playIntroGif() {
    setTimeout(() => {
      introLayer.classList.add("hidden");
      uiLayer.classList.remove("hidden");
      nextStep();
    }, 3000);
  }

  function showYubabaIntro() {
    setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
    typeWriter(
      "Bienvenue aux Bains. Tu veux travailler ici ? Très bien... Mais il y a des règles.",
      "typing-sound"
    );
  }

  // --- NOUVELLE FONCTION : OFFRIR LE STYLO ---
  function offerPen() {
    typeWriter(
      "Tiens, prends ce stylo. Tu en auras besoin pour signer ton engagement.",
      "typing-sound"
    );

    // On affiche le stylo après un court délai ou direct
    setTimeout(() => {
      itemLayer.classList.remove("hidden");
    }, 500);

    // Interaction : Cliquer sur le stylo pour le prendre
    itemLayer.onclick = () => {
      itemLayer.classList.add("hidden"); // On cache le stylo
      nextStep(); // On passe à la signature
    };
  }

  function showContract() {
    textContent.innerHTML = "<i>Signez le contrat avec le stylo...</i>";
    nextBtn.style.display = "none";

    // 1. On cache le personnage pour ne voir que le contrat
    characterLayer.style.opacity = "0";

    // 2. On affiche le contrat
    contractContainer.classList.remove("hidden");
    initSignatureCanvas();
  }

  function yubabaReadsContract() {
    // 1. On range le contrat
    contractContainer.classList.add("hidden");

    // 2. On fait réapparaître Yubaba (qui lit)
    characterImg.src = imgYubabaReading;
    characterLayer.style.opacity = "1";

    nextBtn.style.display = "block";
    setSpeaker("YUBABA", "style-yubaba", null, "left"); // Réinitialise le tag si besoin
    typeWriter("Hmm... Voyons voir ce nom...", "typing-sound");
  }

  function stealNameSequence() {
    uiLayer.classList.add("hidden");

    magicLayer.classList.remove("hidden");
    magicGif.src = gifMagicSteal;
    characterImg.src = imgYubaba;

    setTimeout(() => {
      magicGif.src = gifMagicEnd;
      setTimeout(() => {
        magicLayer.classList.add("hidden");
        uiLayer.classList.remove("hidden");
        nextStep();
      }, 2000);
    }, 3000);
  }

  function yubabaClaim() {
    setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
    typeWriter(
      "Ah ah ah ! C'est un nom trop luxueux pour toi. Désormais tu t'appelleras Sen. Tu m'appartiens !",
      "typing-sound"
    );
  }

  function zenibaAppears() {
    characterImg.style.opacity = 0;
    setTimeout(() => {
      setSpeaker("ZENIBA", "style-zeniba", imgZeniba, "right"); //imgZeniba ou imgYubaba si pas d'image
      characterImg.style.opacity = 1;
      typeWriter(
        "N'oublie jamais qui tu es vraiment. Note ton vrai nom quelque part avant qu'il ne s'efface.",
        "brush-sound"
      );
    }, 500);
  }

  function yubabaReturns() {
    characterImg.style.opacity = 0;
    setTimeout(() => {
      setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
      characterImg.style.opacity = 1;
      typeWriter(
        "Allez, assez bavardé ! Au travail maintenant !",
        "typing-sound"
      );
    }, 500);
  }

  // =========================================================
  // 3. LOGIQUE SIGNATURE
  // =========================================================

  function initSignatureCanvas() {
    signatureCanvas.width = signatureCanvas.offsetWidth;
    signatureCanvas.height = signatureCanvas.offsetHeight;
    ctx.strokeStyle = "#2f2f2f"; // Encre noire/gris foncé
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
  }

  function startSigning(e) {
    if (currentStep !== 4) return;
    isSigning = true;
    penCursor.style.display = "block";
    draw(e);
  }

  function stopSigning() {
    isSigning = false;
    penCursor.style.display = "none";
    ctx.beginPath();
    checkSignatureCompletion();
  }

  function draw(e) {
    if (!isSigning) return;
    e.preventDefault();

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = signatureCanvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    penCursor.style.left = x + rect.left + "px";
    penCursor.style.top = y + rect.top + "px";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    signaturePixels++;
  }

  let signaturePixels = 0;
  function checkSignatureCompletion() {
    if (signaturePixels > 50) {
      // Seuil réduit pour test rapide
      signaturePixels = 0;
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  }

  // Events
  signatureCanvas.addEventListener("mousedown", startSigning);
  signatureCanvas.addEventListener("touchstart", startSigning);
  window.addEventListener("mouseup", stopSigning);
  window.addEventListener("touchend", stopSigning);
  signatureCanvas.addEventListener("mousemove", draw);
  signatureCanvas.addEventListener("touchmove", draw);

  // =========================================================
  // 4. UTILITAIRES
  // =========================================================

  function setSpeaker(name, styleClass, imgSrc, side) {
    nameTag.innerText = name;
    dialogueBox.className = "dialogue-box " + styleClass;
    if (imgSrc) characterImg.src = imgSrc;

    const charLayer = document.getElementById("character-layer");
    charLayer.classList.remove("position-left", "position-right");

    if (side === "left") charLayer.classList.add("position-left");
    else if (side === "right") charLayer.classList.add("position-right");

    const nameTagElement = document.getElementById("name-tag");
    if (side === "left") nameTagElement.classList.add("name-tag-right");
    else nameTagElement.classList.remove("name-tag-right");
  }

  function typeWriter(text, soundId) {
    isTyping = true;
    textContent.innerHTML = "";
    let i = 0;
    const audio = document.getElementById(soundId);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }

    function type() {
      if (i < text.length) {
        textContent.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 40);
      } else {
        isTyping = false;
        if (audio) audio.pause();
      }
    }
    type();
  }

  currentStep = 0;
  nextStep();
});
