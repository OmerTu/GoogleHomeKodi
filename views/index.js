'use strict';

let onSuccess = function(response) {
    $('#output')
        .append(response)
        .toggleClass('error', false);
};

let onError = function(xhr, status, error) {
    $('#output')
        .append(error)
        .append('\r\n')
        .append(xhr.responseText)
        .toggleClass('error', true);
};

let onExecute = function() {
    let token = $('#token').val();
    let route = $('#route').val();

    $('body').toggleClass('spinner', true);
    $('#output').text(`Executing request: ${route}\r\n\r\n`);

    $.ajax({
        type: 'POST',
        url: route,
        contentType: 'application/json',
        dataType: 'text',
        processData: false,
        data: JSON.stringify({ token: token })
    })
        .done(onSuccess)
        .fail(onError)
        .always(function() {
            $('body').toggleClass('spinner', false);
        });
};

$(document).ready(function() {
    $('#route')
        .keypress(function(e) {
            if (e.which === 13) {
                $('#execute-btn').click();
                return false;
            }
        })
        .autoComplete({
            source: function(term, response) {
                $.getJSON('/listRoutes', { q: term.split('?')[0] },
                    function(data) {
                        response(data);
                    });
            }
        });

    $('#execute-btn').click(onExecute);
});
