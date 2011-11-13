(function($) {
    $.flash = function(msg) {
        $('.flash').text(msg).fadeIn('fast');
    };
})(jQuery);

var Options = function() {
    var values = {
        username: null,
        password: null,
        show_popup: '1',
        auto_close: '0',
        badge_style: 0,
        shortcut: {
            keyCode: 83,
            altKey: true,
            ctrlKey: false,
            shiftKey: true
        },
        cx_read_later: '1',
        cx_text_view: '0',
        cx_unread: '0',
        cx_starred: '0',
        cx_archive: '0'
    };

    var ui = {
        username: $('input#username'),
        password: $('input#password'),
        show_popup: $('input#show_popup'),
        auto_close: $('input#auto_close'),
        badge_style: $('select#badge_style'),
        shortcut: $('input#shortcut'),
        cx_read_later: $('input#cx_read_later'),
        cx_text_view: $('input#cx_text_view'),
        cx_unread: $('input#cx_unread'),
        cx_starred: $('input#cx_starred'),
        cx_archive: $('input#cx_archive')
    };

    var dbOrDefault = function(db_key) {
        return $.db(db_key) || values[db_key];
    };

    var authenticateCredentials = function() {
        var username = encodeURIComponent(ui.username.val());
        var password = encodeURIComponent(ui.password.val());
        var url = 'https://www.instapaper.com/api/authenticate?username=' +
            username + '&password=' + password;
        $.ajax(url).always(function() {
            $('.column.label.auth').show('fast').removeClass('ok error');
        }).done(function() {
            $('.column.label.auth').addClass('ok')
                .text('Your credentials are valid.');
            getRSSfeed(username, password);
        }).fail(function() {
            $('.column.label.auth').addClass('error')
                .text('Your username or password is incorrect. ' +
                      'Please double check them.');
        });
    };

    var getRSSfeed = function(user, pass) {
        $.ajax('https://www.instapaper.com/user/login', {
            type: 'POST',
            data: { username: user, password: pass }
        }).done(function() {
            $.ajax('https://www.instapaper.com/u').done(function(data) {
                    $.db('rssfeed',
                         /"(http:\/\/www\.instapaper\.com\/rss\/[^"]*)"/
                            .exec(data)[1]);
            });
        });
    };

    ui.username.bind('change', authenticateCredentials);
    ui.password.bind('change', authenticateCredentials);

    return {
        humanizeKeystrokes: function(e) {
            var key = '',
                special = '';
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                key = String.fromCharCode(e.keyCode);
                if (e.ctrlKey) {
                    special += 'Ctrl + ';
                }
                if (e.altKey) {
                    special += 'Alt + ';
                }
                if (e.shiftKey) {
                    special += 'Shift + ';
                }
            }
            return special + key;
        },

        restore: function() {
            if (location.hash === '#setup') {
                $.flash('Enter your Instapaper credentials to save an URL.');
            }
            ui.username.val(dbOrDefault('username'));
            ui.password.val(dbOrDefault('password'));
            if (dbOrDefault('show_popup') === '1') {
                ui.show_popup.attr('checked', true);
            }
            if (dbOrDefault('auto_close') === '1') {
                ui.auto_close.attr('checked', true);
            }
            if (dbOrDefault('cx_read_later') === '1') {
                ui.cx_read_later.attr('checked', true);
            }
            if (dbOrDefault('cx_text_view') === '1') {
                ui.cx_text_view.attr('checked', true);
            }
            if (dbOrDefault('cx_unread') === '1') {
                ui.cx_unread.attr('checked', true);
            }
            if (dbOrDefault('cx_starred') === '1') {
                ui.cx_starred.attr('checked', true);
            }
            if (dbOrDefault('cx_archive') === '1') {
                ui.cx_archive.attr('checked', true);
            }
            ui.badge_style.val(dbOrDefault('badge_style'));
            ui.shortcut.val(this.humanizeKeystrokes(dbOrDefault('shortcut')))
            .data('keys', dbOrDefault('shortcut'));

            ui.badge_style.change(function() {
                if (parseInt($(this).val(), 10) == 3) {
                    getRSSfeed(ui.username.val(), ui.password.val());
                }
            });
        },

        save: function() {
            $.db('username', ui.username.val());
            $.db('password', ui.password.val());
            $.db('show_popup', ui.show_popup.is(':checked') ? '1' : '0');
            $.db('auto_close', ui.auto_close.is(':checked') ? '1' : '0');
            $.db('cx_read_later', ui.cx_read_later.is(':checked') ? '1' : '0');
            $.db('cx_text_view', ui.cx_text_view.is(':checked') ? '1' : '0');
            $.db('cx_unread', ui.cx_unread.is(':checked') ? '1' : '0');
            $.db('cx_starred', ui.cx_starred.is(':checked') ? '1' : '0');
            $.db('cx_archive', ui.cx_archive.is(':checked') ? '1' : '0');
            $.db('badge_style', ui.badge_style.val());
            $.db('shortcut', ui.shortcut.data('keys'));

            $.flash('Options saved successfully!');
        }
    };
};


$(function() {
    var o = new Options();
    o.restore();

    $('.flash').click(function() {
        $(this).fadeOut('slow');
        return false;
    });

    $('.close').click(function() {
        window.close();
    });

    $('form.options').submit(function() {
        o.save();
        return false;
    });

    $('#shortcut').keydown(function(e) {
        $(this).val(o.humanizeKeystrokes(e)).data('keys', {
            ctrlKey: e.ctrlKey,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            keyCode: e.which
        });
        return false;
    });
});
