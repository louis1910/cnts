
let menufull = document.getElementById('menu-full-screen');

menufx = (state)=>{
    state.classList.toggle('change');
    menufull.classList.toggle('active-menu');
}

$(document).ready(()=>{
    $('#banner-slider').slick({
        prevArrow: "<button class='prev'><img src=\"../img/icons/left.png\" alt=\"\" class=\"iconArrow\"></button>",
        nextArrow: "<button class='next'><img src=\"../img/icons/right.png\" alt=\"\" class=\"iconArrow\"></button>"
    });
})

window.addEventListener("scroll", (event)=>{
    let header = document.getElementById("header");

    if(window.pageYOffset > 0){
        header.classList.add('sticky');
        header.classList.remove('deactiveHeader');
    } else {
        header.classList.add('deactiveHeader');
        header.classList.remove('sticky');
    }
})

