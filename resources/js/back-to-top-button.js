const btnScrollToTop = document.getElementById('scrollToTopBtn');
const docEl = document.documentElement

document.addEventListener('scroll', () => {
    const scrollToTal = docEl.scrollHeight - docEl.clientHeight

    if((docEl.scrollTop/ scrollToTal) >= 0.4) {
        btnScrollToTop.hidden = false
    } else {
        btnScrollToTop.hidden = true
    }
})

btnScrollToTop.addEventListener('click', () => {
    docEl.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})
