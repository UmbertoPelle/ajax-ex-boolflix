function findMovie() {
  var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
  var btn = $('#btnSerch');
  var input = $('#serchInput');

  btn.click(function () {
    var request = input.val();

    $.ajax({
      url:'https://api.themoviedb.org/3/search/movie',
      method:'GET',
      data:{
        'api_key':apiKey,
        'query':request,
        'language': 'it_IT'
      },
      success : function (data) {
        var arrayMovie = data['results'];
        console.log(arrayMovie);
      },
      error : function (err) {
        console.log(err,"error");
      }
    });
  });
}


function init() {

  findMovie();
}

$(document).ready(init);
