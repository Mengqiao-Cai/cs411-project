$(window).on('load', function () {
    $('#search').on('click', function (e) {
        e.preventDefault();
        const city = $('#city').val();
        const date = $('#date').val();
        
        console.log('Sending ajax');
        var options = {
            type: 'GET',
            url: `http://localhost:3000/events?city=${city}&date=${date}`
        };
        $.ajax(options).done(function (data) {
            document.getElementById('events').appendChild(makeUL(data));
        });

        console.log("sending second ajax")
        var options = {
            type: 'GET',
            url: `https://api.spotify.com/v1/me/top/{artists}`,
            headers: {
                'Authorization': 'Bearer BQAYi2yfTA31a9qM2OuMDVTOSjhUfu9GS4kb0B5JfoJbO6zsmcjbJwkqnlhisi0hXYE9iPtEDcS_AjB1s4vR9oBE8Bb58EdKYrt6HV_9in1506uWAApdGkAMPVObwPtlkTWD6se6KEMfGua4xY5vVOiUHhLKnN4'
              }
        };
        $.ajax(options).done(function (data) {
            console.log(data);
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
