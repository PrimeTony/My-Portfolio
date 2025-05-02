

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
