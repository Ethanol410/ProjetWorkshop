document.addEventListener("DOMContentLoaded", () => {
  // --- VARIABLES ---
  const noiraudeImg = document.getElementById("noiraude-img");
  const scoreDisplay = document.getElementById("score");
  const starsContainer = document.getElementById("stars-container");

  let score = 0;
  let isState1 = true; // Pour savoir si on est sur l'image 1 ou 2

  // --- SONS (Optionnel, réutilise ceux de ton calendrier si tu veux) ---
  // const sound = new Audio('assets/sounds/pop.mp3');

  // --- FONCTION CLIC ---
  noiraudeImg.addEventListener("click", (e) => {
    // 1. Incrémenter le score
    score++;
    scoreDisplay.innerText = score;

    // 2. Changer l'image (Noiraude 1 <-> Noiraude 2)
    if (isState1) {
      noiraudeImg.src = "assets/utils/noiraude2.png";
    } else {
      noiraudeImg.src = "assets/utils/noiraude1.png";
    }
    isState1 = !isState1; // On inverse l'état

    // 3. Créer une étoile visuelle à l'endroit du clic
    createStar(e.clientX, e.clientY);

    // (Optionnel) Jouer un son
    // sound.currentTime = 0;
    // sound.play();
  });

  // --- FONCTION POUR CRÉER L'ÉTOILE ---
  function createStar(x, y) {
    const star = document.createElement("div");
    star.classList.add("floating-star");
    star.innerText = "⭐"; // Ou "+1"

    // Positionner l'étoile là où on a cliqué (avec un petit décalage aléatoire)
    const randomX = (Math.random() - 0.5) * 40; // Décalage de -20px à +20px
    star.style.left = x + randomX + "px";
    star.style.top = y - 50 + "px"; // Un peu au dessus du doigt

    // Ajouter au HTML
    starsContainer.appendChild(star);

    // Supprimer l'élément après l'animation (1 seconde) pour ne pas surcharger la page
    setTimeout(() => {
      star.remove();
    }, 1000);
  }
});
