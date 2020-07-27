function findMovie() {
  var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
  var btn = $('#btnSerch');
  var input = $('#serchInput');

  btn.click(function () {
    $('#containerMovies').text('');
    var request = input.val();

    $.ajax({
      url:'https://api.themoviedb.org/3/search/movie',
      method:'GET',
      data:{
        'api_key':apiKey,
        'query':request,
        'language': 'it-IT'
      },
      success : function (data) {
        var arrayMovie = data['results'];
        printMovie(arrayMovie);
      },
      error : function (err) {
        console.log(err,"error");
      }
    });
  });
}

function printMovie(arrayMovie) {
  var template = $('#movie-template').html();
  var compiled = Handlebars.compile(template)
  var target = $('#containerMovies');

  for (var i = 0; i < arrayMovie.length; i++) {
    var movie = arrayMovie[i];
    var vote = Math.round(movie['vote_average']/2);

    var movieHtml= compiled({
      'title':movie['title'],
      'original_title':movie['original_title'],
      'original_language':movie['original_language'],
    });
    target.append(movieHtml);

  }
}


function init() {

  findMovie();
}

$(document).ready(init);
