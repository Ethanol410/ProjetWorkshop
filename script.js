document.addEventListener("DOMContentLoaded", () => {
  // --- ÉLÉMENTS DOM ---
  const loadingLayer = document.getElementById("loading-layer");
  const sceneIntroLayer = document.getElementById("scene-intro-layer");
  const enterBtn = document.getElementById("enter-btn");
  const endLayer = document.getElementById("end-layer");

  const introLayer = document.getElementById("intro-layer"); // Porte
  const uiLayer = document.getElementById("ui-layer");
  const characterImg = document.getElementById("character-img");
  const characterLayer = document.getElementById("character-layer");
  const magicLayer = document.getElementById("magic-layer");
  const magicGif = document.getElementById("magic-gif");
  const contractContainer = document.getElementById("contract-container");
  const signatureCanvas = document.getElementById("signature-canvas");
  const ctx = signatureCanvas.getContext("2d");
  const penCursor = document.getElementById("pen-cursor");
  const itemLayer = document.getElementById("item-layer");

  const dialogueBox = document.getElementById("dialogue-box");
  const nameTag = document.getElementById("name-tag");
  const textContent = document.getElementById("text-content");
  const nextBtn = document.getElementById("next-btn");

  // --- ASSETS CONFIG ---
  const imgYubaba = "assets/utils/yubaba.png";
  const imgYubabaReading = "assets/utils/yubabaReading.png";
  const imgZeniba = "assets/utils/yubaba.png"; // Assure-toi d'avoir zeniba.png !

  const gifMagicSteal = "assets/gif/debutContrat.gif";
  const gifMagicEnd = "assets/gif/finContrat.gif";

  // --- ETAT DU JEU ---
  let currentStep = -1; // -1 = Chargement
  let isTyping = false;
  let isSigning = false;

  // =========================================================
  // 1. PRELOADER (CHARGEMENT)
  // =========================================================
  // Liste des images clés à charger avant de lancer
  const assetsToLoad = [
    "assets/gif/sceneIntro.gif",
    "assets/gif/ouverturePorte.gif",
    "assets/background/bureauYubaba.jpg",
    "assets/utils/",
    gifMagicSteal,
    gifMagicEnd,
    imgYubaba,
    imgZeniba,
  ];

  let assetsLoaded = 0;

  // Fonction simple pour précharger
  function preloadAssets() {
    assetsToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        assetsLoaded++;
        if (assetsLoaded === assetsToLoad.length) {
          // Tout est chargé, on lance l'intro après un petit délai
          setTimeout(startIntroScene, 1500);
        }
      };
      img.onerror = () => {
        // Même si erreur, on continue pour pas bloquer
        assetsLoaded++;
        if (assetsLoaded === assetsToLoad.length)
          setTimeout(startIntroScene, 1500);
      };
    });
  }

  function startIntroScene() {
    // Cacher le chargement
    loadingLayer.classList.add("hidden");
    // Afficher la scène de pluie
    sceneIntroLayer.classList.remove("hidden");
    // Audio pluie si tu en as un, sinon rien
  }

  // Clic sur "RENTRE VITE"
  enterBtn.addEventListener("click", () => {
    sceneIntroLayer.classList.add("hidden");
    nextStep(); // Lance l'étape 1 (Porte)
  });

  // =========================================================
  // 2. MOTEUR DE SCÉNARIO
  // =========================================================

  function nextStep() {
    if (isTyping) return;
    currentStep++;
    console.log("Étape : " + currentStep);

    switch (currentStep) {
      // case 0: // Initialisation (ne rien faire)
      //   break;
      case 0: // Porte s'ouvre
        playDoorGif();
        break;
      case 1: // Yubaba 1 : Présentation
        showUi();
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter(
          "Hey, toi ! Mon nom est Yubaba. Je suis la gérante de cet établissement thermal. Habituellement je ne fais pas ça mais...",
          "typing-sound"
        );
        break;
      case 2: // Yubaba 2 : Offre
        typeWriter(
          "Je t’offre l’opportunité unique de travailler pour moi. Quelle aubaine, pas vrai ? C’est un peu un cadeau de noël en avance.",
          "typing-sound"
        );
        break;
      case 3: // Le Pinceau (Item)
        offerPen();
        break;
      case 4: // Yubaba 3 : Signe ici
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter("Maintenant... SIGNE ICI !", "typing-sound");
        break;
      case 5: // Contrat (Action)
        showContract();
        break;
      case 6: // Magie (GIFs)
        stealNameSequence();
        break;
      case 7: // Yubaba 4 : Tu m'appartiens
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter(
          "PARFAIT ! Tu m’appartiens à présent ! Et maintenant... AU TRAVAIL !",
          "typing-sound"
        );
        break;
      case 8: // Zeniba 1 : Bonjour
        zenibaAppears(); // Gère la transition et le premier texte
        break;
      case 9: // Zeniba 2 : Aide
        typeWriter(
          "Ne t’inquiète pas, je serai la pour t’aider à voir ce qu’elle cherche à te cacher.",
          "brush-sound"
        );
        break;
      case 10: // Zeniba 3 : Le contrat
        typeWriter(
          "Par exemple, ce contrat que tu as signé. Il a pour but de te faire oublier ton nom.",
          "brush-sound"
        );
        break;
      case 11: // Zeniba 4 : Conseil
        typeWriter(
          "Mon conseil : N'oublie jamais qui tu es vraiment. Note ton vrai nom quelque part.",
          "brush-sound"
        );
        break;
      case 12: // Yubaba 5 : Fin journée
        yubabaReturns(); // Gère le retour et le texte
        break;
      case 13: // GIF FIN
        playEndScene();
        break;
    }
  }

  nextBtn.addEventListener("click", () => {
    // Bloque le bouton lors des actions spéciales
    if (currentStep === 3) return; // Pinceau
    if (currentStep === 5) return; // Signature
    if (currentStep === 6) return; // Magie auto
    if (currentStep === 13) return; // Fin

    nextStep();
  });

  // =========================================================
  // 3. FONCTIONS DÉTAILLÉES
  // =========================================================

  function playDoorGif() {
    introLayer.classList.remove("hidden");
    setTimeout(() => {
      introLayer.classList.add("hidden");
      nextStep(); // Passe à Yubaba
    }, 3000); // Durée du gif porte
  }

  function showUi() {
    uiLayer.classList.remove("hidden");
  }

  function offerPen() {
    uiLayer.classList.add("hidden"); // On cache le dialogue
    itemLayer.classList.remove("hidden"); // On affiche le pinceau

    // Clic sur "Récupérer le présent" (le bouton dans l'item-layer)
    const btnRecup = itemLayer.querySelector(".item-hint"); // Assure toi que c'est bien la classe du bouton
    btnRecup.onclick = () => {
      itemLayer.classList.add("hidden");
      uiLayer.classList.remove("hidden");
      nextStep(); // Retour à Yubaba "Signe ici"
    };
  }

  function showContract() {
    uiLayer.classList.add("hidden"); // Cache dialogue
    characterLayer.style.opacity = "0"; // Cache Yubaba
    contractContainer.classList.remove("hidden");
    initSignatureCanvas();
  }

  function stealNameSequence() {
    contractContainer.classList.add("hidden"); // Cache contrat
    magicLayer.classList.remove("hidden");
    magicGif.src = gifMagicSteal;

    // Sequence Magie
    setTimeout(() => {
      magicGif.src = gifMagicEnd;
      setTimeout(() => {
        magicLayer.classList.add("hidden");
        uiLayer.classList.remove("hidden"); // Retour UI
        characterImg.src = imgYubaba;
        characterLayer.style.opacity = "1"; // Retour Yubaba
        nextStep(); // Yubaba parle
      }, 2000);
    }, 3000);
  }

  function zenibaAppears() {
    characterImg.style.opacity = "0";
    setTimeout(() => {
      setSpeaker("ZENIBA", "style-zeniba", imgZeniba, "right");
      characterImg.style.opacity = "1";
      typeWriter(
        "Bonjour, mon nom est ZENIBA. Alors comme ça ma soeur t’a piégé(e) ?",
        "brush-sound"
      );
    }, 500);
  }

  function yubabaReturns() {
    characterImg.style.opacity = "0";
    setTimeout(() => {
      setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
      characterImg.style.opacity = "1";
      typeWriter(
        "Tu as terminé ta journée, reviens demain j’ai des trucs à te donner...",
        "typing-sound"
      );
    }, 500);
  }

  function playEndScene() {
    uiLayer.classList.add("hidden");
    endLayer.classList.remove("hidden");
    // Boucle infinie, pas de nextStep
  }

  // =========================================================
  // 4. SIGNATURE (CANVAS)
  // =========================================================

  function initSignatureCanvas() {
    signatureCanvas.width = signatureCanvas.offsetWidth;
    signatureCanvas.height = signatureCanvas.offsetHeight;
    ctx.strokeStyle = "#2f2f2f";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
  }

  function startSigning(e) {
    if (currentStep !== 5) return;
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
      signaturePixels = 0;
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  }

  // Events Signature
  signatureCanvas.addEventListener("mousedown", startSigning);
  signatureCanvas.addEventListener("touchstart", startSigning);
  window.addEventListener("mouseup", stopSigning);
  window.addEventListener("touchend", stopSigning);
  signatureCanvas.addEventListener("mousemove", draw);
  signatureCanvas.addEventListener("touchmove", draw);

  // =========================================================
  // 5. UTILITAIRES
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

  // LANCEMENT
  preloadAssets(); // Commence par charger les images
});
