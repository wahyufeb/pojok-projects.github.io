const appendScript = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.head.appendChild(script);
};

const getUrlVars = () => {
    let vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

const sanitiseHash = href => href.match(/#/g) ? href.slice(0, href.indexOf('#')) : href;

(() => {
    appendScript('/js/jquery-3.2.1.min.js');
    appendScript('/js/popper.min.js');
    appendScript('/js/bootstrap.min.js');
    appendScript('/js/mdb.min.js');

    var checkReady = (callback) => {
        if (window.jQuery) {
            callback(jQuery);
        } else {
            window.setTimeout(() => {
                checkReady(callback);
            }, 20);
        }
    };

    checkReady(($) => {
        $(() => {
            setTimeout(() => {
                new WOW().init();
            }, 1200);

            $(() => {
                const includes = $('[data-include]'),
                    lang = getUrlVars().lang,
                    excludes = ['footer', 'navbar', 'scripts', 'styles'];

                jQuery.each(includes, function () {
                    const include = $(this).data('include'),
                        suffix = sanitiseHash(!excludes.includes(include) ? (lang ? '-' + lang : '-en') : '');
                    $(this).load(`view/${include + suffix}.html`, () => {
                        if (lang) {
                            $('a').each(function () {
                                const href = $(this).attr('href');
                                if (href) {
                                    const anchor = href.match('#') ? '#' + href.slice(href.indexOf('#') + 1) : null;
                                    let main = sanitiseHash(href);
                                    main += (!main.match(/lang/g)) ? '?lang=' + lang : '';
                                    $(this).attr('href', (anchor && anchor !== '/') ? (main + anchor) : main);
                                }
                            });
                        }
                    });
                });
            });
        });
    });
})();