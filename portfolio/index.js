document.addEventListener("DOMContentLoaded", function () {
  let educationHandler = document.getElementById("education__handler");
  let education = document.getElementById("education");

  educationHandler.onclick = function () {
    education.classList.toggle("expanded");
  };

  new Swiper('.swiper-container', {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    }
  });

  let carouselItemSwitcherBtn_OnClick = function () {
    let project = this.closest(".project");
    project.classList.toggle("description-mode");
  };

  let carouselItemSwitcherBtns = document.querySelectorAll(".carousel__item-switcher-btn");
  for (let btn of carouselItemSwitcherBtns) {
    btn.onclick = carouselItemSwitcherBtn_OnClick;
  }
});
