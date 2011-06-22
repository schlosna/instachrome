Instapaper.Bookmarks = new function () {
    var consumerKey = 'kNfh6BSVMURjOGrYN7a0jdIyPxOwqujdtJpvC5ub6Ov74YNcic',
        consumerSecret = 'KxjIrl2Lgo6yzo2WEqGqOkzttEsEf4tiido5eF85VGIwRVyuKo';
    var unread = function () {

        var url = 'https://www.instapaper.com/api/1/bookmarks/list',
            accessor = {
                consumerKey: consumerKey,
                consumerSecret: consumerSecret,
                token: $.db('oauth_token')
            },
            parameters = {
            },
            message = {
                action: url,
                method: 'GET',
                parameters: $.extend({}, parameters)
            };
        OAuth.completeRequest(message, accessor);

        Instapaper.Api.get('/bookmarks/list', {
            query: {
                limit: 100
            },
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': OAuth.getAuthorizationHeader(url, message.parameters)
            }
        }, function (response) {
            console.log(response);
        });
    };

    return {
        unread: unread
    };
};

