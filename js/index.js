

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero animations
gsap.from("#user-name", { duration: 1, y: 50, opacity: 0, ease: "power2.out" });
gsap.from("#bio", { duration: 1, y: 50, opacity: 0, delay: 0.5, ease: "power2.out" });
gsap.from(".stats", { duration: 1, y: 50, opacity: 0, delay: 1, ease: "power2.out" });
gsap.from("#profile-pic", { duration: 1, scale: 0.8, opacity: 0, delay: 1.5, ease: "back.out(1.7)" });

// Section animations
gsap.utils.toArray('.section--page').forEach(section => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });
});

// Profile pic avoidance
const profilePic = document.getElementById('profile-pic');
const hero = document.getElementById('wrapper--hero');

hero.addEventListener('mousemove', (e) => {
  const rect = profilePic.getBoundingClientRect();
  const picCenterX = rect.left + rect.width / 2;
  const picCenterY = rect.top + rect.height / 2;
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const deltaX = mouseX - picCenterX;
  const deltaY = mouseY - picCenterY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance < 150) { // Adjust sensitivity
    const moveX = (deltaX / distance) * -50;
    const moveY = (deltaY / distance) * -50;
    gsap.to(profilePic, { x: moveX, y: moveY, duration: 0.3, ease: "power2.out" });
  } else {
    gsap.to(profilePic, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
  }
});

// Certificate modal logic
const modal = document.getElementById("certificate-modal");
const modalImg = document.getElementById("modal-image");
const thumbnails = document.querySelectorAll(".certificate-thumbnail");
const closeModal = document.getElementsByClassName("close")[0];

thumbnails.forEach(img => {
  img.onclick = function () {
    modal.style.display = "flex";
    modalImg.src = this.src;
  };
});

closeModal.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};
