document.addEventListener("DOMContentLoaded", function () {
  // Initialize Accordion
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");

    header.addEventListener("click", () => {
      // Close all other accordion items
      accordionItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".accordion-content").style.maxHeight = 0;
        }
      });

      // Toggle current item
      item.classList.toggle("active");
      const content = item.querySelector(".accordion-content");

      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = 0;
      }
    });
  });

  // Open first accordion item by default
  if (accordionItems.length > 0) {
    accordionItems[0].classList.add("active");
    accordionItems[0].querySelector(".accordion-content").style.maxHeight = accordionItems[0].querySelector(".accordion-content").scrollHeight + "px";
  }

  // Add animation to contact buttons
  const contactButtons = document.querySelectorAll(".contact-btn");
  contactButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.classList.add("animate__animated", "animate__pulse");
    });

    button.addEventListener("animationend", function () {
      this.classList.remove("animate__animated", "animate__pulse");
    });
  });
});
