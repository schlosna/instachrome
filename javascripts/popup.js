$(function() {
    var show_popup = $.db('show_popup') === '1';
    if (show_popup) {
        $('ul.links li > #add').click(function() {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.extension.getBackgroundPage().readLater(tab);
                window.close();
            });
        });

        $('ul.links li > #text').click(function() {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.update(tab.id, {
                    url: 'http://www.instapaper.com/text?u=' +
                        encodeURIComponent(tab.url)
                });
                window.close();
            });
        });

        $('ul.links li > #unread').click(function() {
            chrome.tabs.create({
                url: 'http://www.instapaper.com/u'
            });
            window.close();
        });

        $('ul.links li > #starred').click(function() {
            chrome.tabs.create({
                url: 'http://www.instapaper.com/starred'
            });
            window.close();
        });

        $('ul.links li > #archive').click(function() {
            chrome.tabs.create({
                url: 'http://www.instapaper.com/archive'
            });
            window.close();
        });

        $('ul.links li > #options').click(function() {
            chrome.tabs.create({url: chrome.extension.getURL('options.html')});
            window.close();
        });

        $('ul.links li > a').click(function() {
            return false;
        });
    } else {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.extension.getBackgroundPage().readLater(tab);
            window.close();
        });
    }
});
