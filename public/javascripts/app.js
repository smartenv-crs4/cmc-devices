$(document).foundation();
$(document).ready(function() {
  // Attach a submit handler to the form
  $("#add-device, #update-device").submit(function(event) {
    var arrayOfElements = $(this).serializeArray();
    // Stop form from submitting normally
    event.preventDefault();
    // Get some values from elements on the page:
    var $form = $(this),
      terms = objectifyForm(arrayOfElements),
      url = $form.attr("action"),
      method = $(this).prop("id") == "add-device"? "POST" : "PUT",
      token = terms.token;

    // Send the data using post
    $.ajax({method: method, url: url,
      headers: {
      'Authorization':'Bearer ' + token,
  }, data: terms}).done(function(data) {
      if (data.id) {
        var message = ( method == 'POST' ) ? 'Added' : 'Updated';
        alert('Device with id: ' + data.id + ' ' + message + ' Successfully!');
      } else {
        alert(data.message);
      }
    }).fail(function() {
      alert("error");
    });
  });

  $("#add-category, #update-category").submit(function(event) {
    var arrayOfElements = $(this).serializeArray();
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var $form = $(this),
      terms = objectifyForm(arrayOfElements),
      url = $form.attr("action"),
      method = $(this).prop("id") == "add-category"? "POST" : "PUT",
      token = terms.token;
    // Send the data using post
    $.ajax({method: method, url: url,     headers: {
        'Authorization':'Bearer ' + token,
    }, data: terms}).done(function(data) {
      if (data._id) {
        alert('Category with id: ' + data._id + ' Added Successfully!');
      } else {
        alert(data.message);
      }
    }).fail(function() {
      alert("error");
    });

  });

  $("#add-connector, #update-connector").submit(function(event) {
    var arrayOfElements = $(this).serializeArray();
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var $form = $(this),
      terms = objectifyForm(arrayOfElements),
      url = $form.attr("action"),
      method = $(this).prop("id") == "add-connector"? "POST" : "PUT",
      token = terms.token;

    // Send the data using post
    $.ajax({method: method, url: url,     headers: {
        'Authorization':'Bearer ' + token,
    }, data: terms}).done(function(data) {
      if (data._id) {
        alert('Connector with id: ' + data._id + ' Added Successfully!');
      } else {
        alert(data.message);
      }
    }).fail(function() {
      alert("error");
    });
  });
});

function objectifyForm(formArray) { //serialize data function
  var returnArray = {};
  for (var i = 0; i < formArray.length; i++) {
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}
