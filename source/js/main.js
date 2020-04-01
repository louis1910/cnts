
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

$('.sel').each(function() {
    $(this).children('select').css('display', 'none');

    var $current = $(this);

    $(this).find('option').each(function(i) {
        if (i == 0) {
            $current.prepend($('<div>', {
                class: $current.attr('class').replace(/sel/g, 'sel__box')
            }));

            var placeholder = $(this).text();
            $current.prepend($('<span>', {
                class: $current.attr('class').replace(/sel/g, 'sel__placeholder'),
                text: placeholder,
                'data-placeholder': placeholder
            }));

            return;
        }

        $current.children('div').append($('<span>', {
            class: $current.attr('class').replace(/sel/g, 'sel__box__options'),
            text: $(this).text()
        }));
    });
});

// Toggling the `.active` state on the `.sel`.
$('.sel').click(function() {
    $(this).toggleClass('active');
});

// Toggling the `.selected` state on the options.
$('.sel__box__options').click(function() {
    var txt = $(this).text();
    var index = $(this).index();

    $(this).siblings('.sel__box__options').removeClass('selected');
    $(this).addClass('selected');

    var $currentSel = $(this).closest('.sel');
    $currentSel.children('.sel__placeholder').text(txt);
    $currentSel.children('select').prop('selectedIndex', index + 1);
});


