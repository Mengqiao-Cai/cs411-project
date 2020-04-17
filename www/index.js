$(window).on('load', function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();
        const city = $('#city').val();

        console.log('Sending ajax');
        const options = {
            type: 'GET',
            url: `http://localhost:3000/events?city=${city}`
        };
        $.ajax(options).done(function (data) {
            document.getElementById('events').appendChild(makeUL(data));
        });
    });
});

function makeUL(json) {
    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < Object.keys(json).length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(json[i]['names']+', '+json[i]['venues'] + ', '+json[i]['dateAndTime']));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}