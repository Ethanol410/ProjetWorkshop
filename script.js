document.addEventListener("DOMContentLoaded", () => {
  // --- ÉLÉMENTS DOM ---
  const loadingLayer = document.getElementById("loading-layer");
  const sceneIntroLayer = document.getElementById("scene-intro-layer");
  const enterBtn = document.getElementById("enter-btn");
  const endLayer = document.getElementById("end-layer");
  const endBtn = document.getElementById("end-btn");
  const endLayerImg = endLayer.querySelector(".full-screen-bg");
  const endLayerText = endLayer.querySelector(".end-text");

  const backgroundLayer = document.getElementById("background-layer");

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
  const itemName = itemLayer.querySelector(".nomObjet");
  const itemDesc = itemLayer.querySelector(".explicationObjet");
  const itemHint = itemLayer.querySelector(".item-hint");
  const itemImg = document.getElementById("item-img");

  const dialogueBox = document.getElementById("dialogue-box");
  const nameTag = document.getElementById("name-tag");
  const textContent = document.getElementById("text-content");
  const nextBtn = document.getElementById("next-btn");

  const cleaningLayer = document.getElementById("cleaning-layer");
  const dishDirty = document.getElementById("dish-dirty");
  const dishClean = document.getElementById("dish-clean");
  const cleaningMessage = document.getElementById("cleaning-message");
  const finishBtn = document.getElementById("finish-btn");
  const cleaningHint = document.getElementById("cleaning-hint");
  const cleanCursor = document.getElementById("custom-cursor");
  const cleaningProgressBar = document.getElementById("cleaning-progress-bar");

  // --- ASSETS CONFIG ---
  const imgYubaba = "assets/utils/yubaba.png";
  const imgYubabaReading = "assets/utils/yubabaReading.png";
  const imgYubabaAngry = "assets/utils/yubabaAngry.png";
  const imgZeniba = "assets/utils/yubaba.png";
  const imgKamaji = "assets/utils/kamaji.png"; // À remplacer si tu as l'image de Kamaji

  const gifMagicSteal = "assets/gif/debutContrat.gif";
  const gifMagicEnd = "assets/gif/finContrat.gif";
  const gifFondTrain = "assets/gif/fondTrain.gif";

  const imgContract1 = "assets/utils/contratEcrit.png";
  const imgContract2 = "assets/utils/contratCasse.png";
  const imgContract3 = "assets/utils/contractCasseRelie.png";
  const imgContract4 = "assets/utils/contratDetruit.png"; // Contrat complètement cassé

  // --- ETAT DU JEU ---
  let currentStep = -1; // -1 = Chargement
  let isTyping = false;
  let isSigning = false;

  let isDay4 = false;
  let day4Step = -1;
  let cleaningProgress = 0;
  let cleaningActive = false;
  let lastCleaningX = 0;
  let lastCleaningY = 0;

  let isDay24 = false;
  let day24Step = -1;
  let contractBreakProgress = 0;

  // =========================================================
  // 1. PRELOADER (CHARGEMENT)
  // =========================================================
  // Liste des images clés à charger avant de lancer
  const assetsToLoad = [
    "assets/gif/sceneIntro.gif",
    "assets/gif/ouverturePorte.gif",
    "assets/gif/debutContrat.gif",
    "assets/gif/finContrat.gif",
    "assets/background/bureauYubaba.jpg",
    "assets/background/fondHallMenage.png",
    "assets/utils/",
    gifMagicSteal,
    gifMagicEnd,
    imgYubaba,
    imgYubabaReading,
    imgYubabaAngry,
    imgZeniba,
    imgKamaji,
    "assets/utils/Chiffon2.png",
    "assets/utils/AssietteSale.png",
    "assets/utils/AssiettePropre.png",
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
    // Initialiser le calendrier pour le jour 1
    setDayIndicator(1);
    // Audio de fond
    const bgMusic = document.getElementById("soundDesignHome");
    if (bgMusic) {
      bgMusic.volume = 0.5; // Volume à 50%
      bgMusic.play().catch((e) => console.log("Autoplay bloqué:", e));
    }
  }

  // Clic sur "RENTRE VITE"
  enterBtn.addEventListener("click", () => {
    sceneIntroLayer.classList.add("hidden");
    nextStep(); // Lance l'étape 1 (Porte)
  });

  endBtn.addEventListener("click", () => {
    if (!isDay4) {
      startDay4();
    } else {
      startDay24();
    }
  });

  // =========================================================
  // 2. MOTEUR DE SCÉNARIO
  // =========================================================

  // DANS script.js : Remplacez la fonction nextStep par celle-ci

  function nextStep() {
    if (isTyping) return;
    currentStep++;
    console.log("Jour 1, Étape : " + currentStep);

    switch (currentStep) {
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
      case 5: // Contrat (Action de signer)
        showContract();
        break;

      // --- NOUVELLE SÉQUENCE ---
      case 6: // Yubaba lit le contrat
        yubabaReads();
        break;
      case 7: // Yubaba valide ("Parfait !") AVANT la magie
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left"); // On remet l'image normale
        typeWriter(
          "PARFAIT ! Tu m’appartiens à présent ! Et maintenant... AU TRAVAIL !",
          "typing-sound"
        );
        break;
      case 8: // La Magie (GIFs) APRÈS le dialogue
        stealNameSequence();
        break;
      // --------------------------

      case 9: // Zeniba 1 : Bonjour (Décalé de 8 à 9)
        zenibaAppears();
        break;
      case 10: // Zeniba 2 : Aide
        typeWriter(
          "Ne t’inquiète pas, je serai la pour t’aider à voir ce qu’elle cherche à te cacher.",
          "brush-sound"
        );
        break;
      case 11: // Zeniba 3 : Le contrat
        typeWriter(
          "Par exemple, ce contrat que tu as signé. Il a pour but de te faire oublier ton nom.",
          "brush-sound"
        );
        break;
      case 12: // Zeniba 4 : Conseil
        typeWriter(
          "Mon conseil : N'oublie jamais qui tu es vraiment. Note ton vrai nom quelque part.",
          "brush-sound"
        );
        break;
      case 13: // Yubaba 5 : Fin journée
        yubabaReturns();
        break;
      case 14: // GIF FIN
        playEndScene();
        break;
    }
  }

  // Modifiez cette partie vers la ligne 130 de script.js

  // Fonction pour gérer le passage au dialogue suivant
  function handleNextDialogue() {
    if (isDay24) {
      if (day24Step === 2) return; // Attente récupération ticket
      if (day24Step === 4) return; // Contrat en cours de destruction
      if (day24Step >= 7) return; // Fin
      nextStepDay24();
      return;
    }

    if (isDay4) {
      if (day4Step === 2) return; // Attente récupération chiffon
      if (day4Step === 4) return; // Nettoyage en cours
      if (day4Step >= 5) return; // Fin journée 4
      nextStepDay4();
      return;
    }

    // Bloque le bouton lors des actions spéciales
    if (currentStep === 3) return; // Pinceau
    if (currentStep === 5) return; // Signature
    if (currentStep === 8) return; // Magie auto (C'était 6 avant, c'est 8 maintenant)
    if (currentStep === 14) return; // Fin

    nextStep();
  }

  // Clic sur la flèche
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Empêche la propagation pour éviter de déclencher deux fois
    handleNextDialogue();
  });

  // Clic n'importe où sur la boîte de dialogue
  dialogueBox.addEventListener("click", () => {
    handleNextDialogue();
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

  function showItem(name, desc, imgSrc, onCollected) {
    itemName.textContent = name;
    itemDesc.textContent = desc;
    itemImg.src = imgSrc;

    uiLayer.classList.add("hidden");
    characterImg.style.opacity = "0";
    itemLayer.classList.remove("hidden");

    itemHint.onclick = () => {
      itemLayer.classList.add("hidden");
      uiLayer.classList.remove("hidden");
      characterImg.style.opacity = "1";
      if (typeof onCollected === "function") onCollected();
    };
  }

  function offerPen() {
    showItem(
      "Pinceau",
      "Un vulgaire pinceau servant à écrire toute sorte de choses...",
      "assets/utils/Pinceau2.png",
      () => nextStep()
    );
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

  function yubabaReads() {
    // 1. Cacher le contrat signé
    contractContainer.classList.add("hidden");

    // 2. Réafficher l'interface (UI + Personnage)
    uiLayer.classList.remove("hidden");
    characterLayer.style.opacity = "1"; // On fait réapparaître Yubaba

    // 3. Mettre l'image de lecture et le texte
    setSpeaker("YUBABA", "style-yubaba", imgYubabaReading, "left");
    typeWriter("Hmm... Voyons voir si ce nom est correct...", "typing-sound");
  }

  function playEndScene(day = 1) {
    uiLayer.classList.add("hidden");

    // Changer le gif et le texte en fonction du jour
    if (day === 4) {
      endLayerImg.src = "assets/gif/sceneCuisine.gif";
      endLayerText.innerHTML =
        "Tu as brillamment accompli ta tâche de nettoyage.<br>Zeniba serait fière de toi...";
    } else {
      endLayerImg.src = "assets/gif/sceneFinJourne.gif";
      endLayerText.innerHTML =
        "Tu as signé le contrat de Yubaba.<br>Ton aventure dans le monde des esprits ne fait que commencer...";
    }

    endLayer.classList.remove("hidden");
    // Boucle infinie, pas de nextStep
  }

  // =========================================================
  // JOUR 4 : SÉQUENCE ASSIETTES
  // =========================================================

  function setDayIndicator(dayNumber) {
    const topDayImg = document.querySelector(
      ".menu-layer-top .calendrier img:last-child"
    );
    const bottomCalendar = document.querySelector(
      ".menu-layer-bottom .calendrier"
    );
    const bottomDays = Array.from(
      document.querySelectorAll(".menu-layer-bottom .day")
    );

    if (topDayImg) topDayImg.src = `assets/utils/Jour${dayNumber}.png`;

    // Apply centered layout for days > 1, start layout for day 24
    if (bottomCalendar) {
      bottomCalendar.classList.remove("centered-layout", "start-layout");
      if (dayNumber === 24) {
        bottomCalendar.classList.add("start-layout");
      } else if (dayNumber > 1) {
        bottomCalendar.classList.add("centered-layout");
      }
    }

    bottomDays.forEach((day) => {
      day.classList.remove("active-day", "locked-next", "locked", "past-day");
      const img = day.querySelector(".day-img");
      if (img) img.style.opacity = "0.6";
      day.style.order = 0;
    });

    bottomDays.forEach((day) => {
      const num = Number(day.dataset.day);
      if (Number.isNaN(num)) return;

      // Au jour 24, afficher uniquement les jours 21-24
      if (dayNumber === 24) {
        if (num >= 21 && num <= 24) {
          day.style.display = "flex";
        } else {
          day.style.display = "none";
          return;
        }
      }
      // Masquer les jours 5+ si on est avant le jour 4
      else if (num >= 5 && dayNumber < 4) {
        day.style.display = "none";
        return;
      }
      // Masquer les jours 8+ si on est entre le jour 4 et 23
      else if (num >= 8) {
        day.style.display = "none";
        return;
      } else {
        day.style.display = "flex";
      }

      if (num === dayNumber) {
        day.classList.add("active-day");
        const img = day.querySelector(".day-img");
        if (img) img.style.opacity = "1";
        day.style.order = 100; // Centre (ordre élevé pour être après les passés)
      } else if (num < dayNumber) {
        day.classList.add("past-day");
        day.style.order = num; // Ordre naturel 1, 2, 3... -> à gauche
      } else {
        day.classList.add("locked-next");
        day.style.order = num + 100; // Ordre élevé -> à droite
      }
    });
  }

  function startDay4() {
    isDay4 = true;
    day4Step = -1;
    endLayer.classList.add("hidden");
    uiLayer.classList.remove("hidden");
    backgroundLayer.style.backgroundImage =
      "url('./assets/background/fondHallMenage.png')";
    setDayIndicator(4);
    nextStepDay4();
  }

  function nextStepDay4() {
    if (isTyping) return;
    day4Step++;
    console.log("Jour 4, Étape : " + day4Step);

    switch (day4Step) {
      case 0:
        showUi();
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter(
          "Bienvenue à nouveau ! Prêt à accomplir ta tâche du jour ? Aujourd'hui, je veux voir les assiettes briller !",
          "typing-sound"
        );
        break;
      case 1:
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter(
          "Voici ton cadeau ! Allez, un peu de nerf : les clients attendent !",
          "typing-sound"
        );
        break;
      case 2:
        offerCloth();
        break;
      case 3:
        setSpeaker("ZENIBA", "style-zeniba", imgZeniba, "right");
        typeWriter(
          "Prends ton temps. Le Sans-Visage attendra. Rien ne sert de se précipiter.",
          "brush-sound"
        );
        break;
      case 4:
        startCleaningTask();
        break;
      case 5:
        cleaningLayer.classList.add("hidden");
        uiLayer.classList.remove("hidden");
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter(
          "Tu as terminé ta journée, reviens demain j’ai des trucs à te donner...",
          "typing-sound",
          () => setTimeout(() => playEndScene(4), 1500)
        );
        break;
      default:
        break;
    }
  }

  function offerCloth() {
    showItem(
      "Chiffon",
      "Un chiffon bien propre pour faire briller les assiettes.",
      "assets/utils/Chiffon2.png",
      () => nextStepDay4()
    );
  }

  function startCleaningTask() {
    cleaningProgress = 0;
    cleaningActive = false;
    uiLayer.classList.add("hidden");
    cleaningLayer.classList.remove("hidden");
    dishDirty.classList.remove("hidden");
    dishClean.classList.add("hidden");
    cleaningMessage.classList.add("hidden");
    finishBtn.classList.add("hidden");
    if (cleaningHint) cleaningHint.classList.remove("hidden");
    updateCleaningBar(0);
  }

  function startScrub(e) {
    cleaningActive = true;
    lastCleaningX = e.clientX;
    lastCleaningY = e.clientY;
    moveCursor(e);
    const audio = document.getElementById("brush-sound");
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.35;
      audio.play().catch(() => {});
    }
  }

  function stopScrub() {
    cleaningActive = false;
    cleanCursor.style.display = "none";
    const audio = document.getElementById("brush-sound");
    if (audio) audio.pause();
  }

  function moveCursor(e) {
    if (!cleanCursor) return;
    cleanCursor.style.display = "block";
    cleanCursor.style.left = `${e.clientX}px`;
    cleanCursor.style.top = `${e.clientY}px`;
  }

  function handleScrub(e) {
    if (!cleaningActive) return;

    // Calculer la distance parcourue depuis la dernière position
    const deltaX = e.clientX - lastCleaningX;
    const deltaY = e.clientY - lastCleaningY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Ne compter que si on bouge vraiment (distance > 5 pixels)
    if (distance > 5) {
      cleaningProgress += Math.floor(distance / 5); // Chaque 5 pixels de mouvement = 1 point
      updateCleaningBar(cleaningProgress);

      // Mettre à jour la dernière position
      lastCleaningX = e.clientX;
      lastCleaningY = e.clientY;

      if (cleaningProgress >= 250) revealCleanDish();
    }

    moveCursor(e);
  }

  function revealCleanDish() {
    cleaningActive = false;
    dishDirty.classList.add("hidden");
    dishClean.classList.remove("hidden");
    cleaningMessage.classList.remove("hidden");
    finishBtn.classList.remove("hidden");
    if (cleaningHint) cleaningHint.classList.add("hidden");
    updateCleaningBar(250);
    stopScrub();
  }

  function updateCleaningBar(value) {
    if (!cleaningProgressBar) return;
    const target = 250;
    const pct = Math.min(value / target, 1) * 100;
    cleaningProgressBar.style.width = `${pct}%`;
  }

  if (cleaningLayer) {
    cleaningLayer.addEventListener("pointerdown", (e) => {
      startScrub(e);
    });
    cleaningLayer.addEventListener("pointermove", (e) => {
      if (cleaningActive) e.preventDefault();
      handleScrub(e);
    });
    cleaningLayer.addEventListener("pointerleave", stopScrub);
  }
  window.addEventListener("pointerup", stopScrub);
  if (finishBtn) finishBtn.addEventListener("click", () => nextStepDay4());

  // =========================================================
  // JOUR 24 : FINAL
  // =========================================================

  function startDay24() {
    isDay24 = true;
    isDay4 = false;
    day24Step = -1;
    endLayer.classList.add("hidden");
    uiLayer.classList.remove("hidden");
    backgroundLayer.style.backgroundImage =
      "url('./assets/background/fondHallMenage.png')";
    setDayIndicator(24);
    nextStepDay24();
  }

  function nextStepDay24() {
    if (isTyping) return;
    day24Step++;
    console.log("Jour 24, Étape : " + day24Step);

    switch (day24Step) {
      case 0:
        // Yubaba alerte
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter("ALERTE SÉCURITÉ !  EMPLOYÉ MANQUANT !!!", "typing-sound");
        break;

      case 1:
        // Kamaji apparaît
        backgroundLayer.style.backgroundImage =
          "url('./assets/background/fondKamaji.png')";
        characterImg.style.opacity = "0";
        setTimeout(() => {
          characterImg.src = imgKamaji;
          characterLayer.classList.add("position-right");
          characterLayer.classList.remove("position-left");
          characterImg.style.opacity = "1";
          setSpeaker("KAMAJI", "style-zeniba", imgKamaji, "right");
          typeWriter(
            "Personne ne mérite d'être traité de cette manière. Tenez ! Et partez vite !",
            "typing-sound"
          );
        }, 500);
        break;

      case 2:
        // Offrir le ticket de train
        offerTrainTicket();
        break;

      case 3:
        // Yubaba revient en colère
        backgroundLayer.style.backgroundImage =
          "url('./assets/background/fondHallMenage.png')";
        characterImg.style.opacity = "0";
        setTimeout(() => {
          characterImg.src = imgYubaba;
          characterLayer.classList.add("position-left");
          characterLayer.classList.remove("position-right");
          characterImg.style.opacity = "1";
          setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
          typeWriter(
            "Reviens ! Tu as signé un contrat ! Je vais te transformer en...",
            "typing-sound"
          );
        }, 500);
        break;

      case 4:
        // Montrer le contrat à briser
        showBreakableContract();
        break;

      case 5:
        // Yubaba défaite
        setSpeaker("YUBABA", "style-yubaba", imgYubaba, "left");
        typeWriter("Nonnnnnnn !!!", "typing-sound");
        break;

      case 6:
        // Zeniba apparaît
        characterImg.style.opacity = "0";
        setTimeout(() => {
          characterImg.src = imgZeniba;
          characterLayer.classList.add("position-right");
          characterLayer.classList.remove("position-left");
          characterImg.style.opacity = "1";
          setSpeaker("ZENIBA", "style-zeniba", imgZeniba, "right");
          typeWriter("Ton nom est à toi. Bon voyage.", "typing-sound");
        }, 500);
        break;

      case 7:
        // Scène finale avec le train
        playFinalScene();
        break;

      default:
        console.log("Fin du Jour 24");
    }
  }

  function offerTrainTicket() {
    showItem(
      "Ticket de Train",
      "Un précieux ticket pour voyager vers la liberté.",
      "assets/utils/ticketDeTrain.png",
      () => nextStepDay24()
    );
  }

  function showBreakableContract() {
    uiLayer.classList.add("hidden");
    characterLayer.style.opacity = "0";
    contractBreakProgress = 0;

    // Créer un layer pour le contrat cassable s'il n'existe pas
    let breakableContractLayer = document.getElementById(
      "breakable-contract-layer"
    );
    if (!breakableContractLayer) {
      breakableContractLayer = document.createElement("div");
      breakableContractLayer.id = "breakable-contract-layer";
      breakableContractLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 85;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      `;
      document
        .getElementById("game-container")
        .appendChild(breakableContractLayer);
    }

    const contractImg = document.createElement("img");
    contractImg.id = "breakable-contract-img";
    contractImg.src = imgContract1;
    contractImg.style.cssText = `
      max-width: 80%;
      max-height: 80%;
      object-fit: contain;
      transition: transform 0.1s;
    `;

    const hint = document.createElement("p");
    hint.textContent = "Clique pour briser le contrat !";
    hint.style.cssText = `
      color: #fff;
      font-family: 'Courier Prime', monospace;
      margin-top: 20px;
      text-shadow: 2px 2px 4px #000;
      animation: pulse 2s infinite;
    `;

    breakableContractLayer.innerHTML = "";
    breakableContractLayer.appendChild(contractImg);
    breakableContractLayer.appendChild(hint);
    breakableContractLayer.classList.remove("hidden");

    breakableContractLayer.onclick = () => {
      contractBreakProgress++;

      // Animation de shake
      contractImg.style.transform = `rotate(${
        Math.random() * 10 - 5
      }deg) scale(${0.95 + Math.random() * 0.1})`;
      setTimeout(() => {
        contractImg.style.transform = "rotate(0deg) scale(1)";
      }, 100);

      // Changer l'image selon la progression
      if (contractBreakProgress >= 3 && contractBreakProgress < 6) {
        contractImg.src = imgContract2;
      } else if (contractBreakProgress >= 6 && contractBreakProgress < 9) {
        contractImg.src = imgContract3;
      } else if (contractBreakProgress >= 9) {
        contractImg.src = imgContract4;
        hint.textContent = "Le contrat est brisé !";

        // Attendre 1 seconde puis continuer
        setTimeout(() => {
          breakableContractLayer.classList.add("hidden");
          uiLayer.classList.remove("hidden");
          characterLayer.style.opacity = "1";
          nextStepDay24();
        }, 1500);

        // Désactiver les clics
        breakableContractLayer.onclick = null;
      }
    };
  }

  function playFinalScene() {
    uiLayer.classList.add("hidden");
    characterLayer.style.opacity = "0";

    // Créer un layer pour la scène finale
    let finalSceneLayer = document.getElementById("final-scene-layer");
    if (!finalSceneLayer) {
      finalSceneLayer = document.createElement("div");
      finalSceneLayer.id = "final-scene-layer";
      finalSceneLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 200;
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
      `;
      document.getElementById("game-container").appendChild(finalSceneLayer);
    }

    const finalGif = document.createElement("img");
    finalGif.src = gifFondTrain;
    finalGif.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;

    finalSceneLayer.innerHTML = "";
    finalSceneLayer.appendChild(finalGif);
    finalSceneLayer.classList.remove("hidden");

    // Message de fin après quelques secondes
    setTimeout(() => {
      const endMessage = document.createElement("div");
      endMessage.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: white;
        font-family: 'Courier Prime', monospace;
        font-size: 32px;
        text-shadow: 2px 2px 8px black;
        background: rgba(0, 0, 0, 0.7);
        padding: 40px;
        border-radius: 15px;
      `;
      endMessage.innerHTML = "Félicitations !<br>Tu as terminé ton aventure.";
      finalSceneLayer.appendChild(endMessage);
    }, 3000);
  }

  // =========================================================
  // 4. SIGNATURE (CANVAS) - VERSION CORRIGÉE
  // =========================================================

  function initSignatureCanvas() {
    signatureCanvas.width = signatureCanvas.offsetWidth;
    signatureCanvas.height = signatureCanvas.offsetHeight;
    ctx.strokeStyle = "#2f2f2f";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round"; // Rend les angles plus doux
  }

  // Nouvelle fonction utilitaire pour récupérer la bonne position
  function getEventPos(e) {
    e.preventDefault();
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = signatureCanvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function startSigning(e) {
    if (currentStep !== 5) return; // CORRECTION : Etape 5 et pas 6
    isSigning = true;
    penCursor.style.display = "block";

    // On commence le tracé proprement
    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    // On force un premier point
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    updateCursor(pos.x, pos.y);
  }

  function stopSigning() {
    if (!isSigning) return;
    isSigning = false;
    penCursor.style.display = "none";
    ctx.beginPath(); // On ferme le chemin
    checkSignatureCompletion();
  }

  function draw(e) {
    if (!isSigning) return;

    const pos = getEventPos(e);

    // Dessin
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Mise à jour du curseur
    updateCursor(pos.x, pos.y);

    signaturePixels++;
  }

  // Fonction pour placer le stylo au bon endroit
  function updateCursor(x, y) {
    // Le stylo est dans #contract-container, comme le canvas.
    // Il faut ajouter la position "left/top" du canvas à la position x/y du dessin
    penCursor.style.left = signatureCanvas.offsetLeft + x + "px";
    penCursor.style.top = signatureCanvas.offsetTop + y + "px";
  }

  let signaturePixels = 0;
  function checkSignatureCompletion() {
    // On réduit un peu le seuil pour que ce soit plus facile sur mobile
    if (signaturePixels > 30) {
      signaturePixels = 0;
      setTimeout(() => {
        nextStep();
      }, 500);
    }
  }

  // Events Signature
  signatureCanvas.addEventListener("mousedown", startSigning);
  signatureCanvas.addEventListener("touchstart", startSigning, {
    passive: false,
  }); // passive: false est important pour preventDefault
  window.addEventListener("mouseup", stopSigning);
  window.addEventListener("touchend", stopSigning);
  signatureCanvas.addEventListener("mousemove", draw);
  signatureCanvas.addEventListener("touchmove", draw, { passive: false });

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

  function typeWriter(text, soundId, onDone) {
    isTyping = true;
    textContent.innerHTML = "";
    let i = 0;
    const audio = document.getElementById(soundId);
    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.3;
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
        if (typeof onDone === "function") onDone();
      }
    }
    type();
  }

  // LANCEMENT
  preloadAssets(); // Commence par charger les images
});
