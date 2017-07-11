getRepositories(6).done(function (data) {
    $.each(data, function (index, object) {
        getTemplate('site').done(function (template) {
            var template = renderTemplate(template, {
                title: formatDashToSpace(object.name),
                image: object.img,
                url: object.download
            });

            $('#sites-list').append(template);
        });
    });
});

// 6 is default, next is 12, so set that as default
localStorage.setItem('load-sites', 12);

$('#load-more').on('click', function () {
    var button = $(this);
    var buttonText = button.children('#load-text');
    var buttonSpinner = button.children('#load-spin');

    buttonText.addClass('hide');
    buttonSpinner.removeClass('hide');

    getRepositories(localStorage.getItem('load-sites')).done(function (data) {
        // Timeout, because fetch is fast
        setTimeout(function () {
            buttonText.removeClass('hide');
            buttonSpinner.addClass('hide');
        }, 500);

        if ($.isEmptyObject(data)) {
            buttonText.text('No More Content');
            button.prop('disabled', true);
            return;
        }

        $.each(data, function (index, object) {
            getTemplate('site').done(function (template) {
                var template = renderTemplate(template, {
                    title: formatDashToSpace(object.name),
                    image: object.img,
                    url: object.download
                });

                $('#sites-list').append(template);
            });
        });

        localStorage.setItem(
            'load-sites',
            parseInt(localStorage.getItem('load-sites'), 10) + 6
        );
    });
});

function formatDashToSpace(string) {
    return string.replace(/-/g, ' ');
}

function getTemplate(name) {
    return $.get('templates/' + name + '.mst');
}

function renderTemplate(template, data) {
    return Mustache.render(template, data);
}

function getRepositories(id) {
    return $.getJSON('http://git.unpacker.org?load=' + id);
}
