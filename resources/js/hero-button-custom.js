document.addEventListener("DOMContentLoaded", function () {
  // Hero button hover effects
  const heroButtons = document.querySelectorAll(".hero-btn");

  heroButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.classList.add("animate__animated", "animate__pulse");
    });

    button.addEventListener("mouseleave", function () {
      this.classList.remove("animate__animated", "animate__pulse");
    });

    button.addEventListener("click", function (e) {
      // Add click animation
      this.classList.add("animate__animated", "animate__rubberBand");

      // Remove animation class after it completes
      setTimeout(() => {
        this.classList.remove("animate__animated", "animate__rubberBand");
      }, 1000);
    });
  });
});
