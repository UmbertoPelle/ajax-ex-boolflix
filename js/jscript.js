function findMovie() {

  $('#serchInput').keydown(function () {
    if (event.which == 13) {
      var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
      var input = $('#serchInput');
      $('#containerMovies').text('');
      var request = input.val();

      if (request) {
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
            if (data['total_results'] >0) {
              printMovie(arrayMovie);
            }else {
              findSerie();
            }
          },
          error : function (err) {
            console.log(err,"error");
          }
        });
      }
    }
  });
}

function printMovie(arrayMovie) {
  $('#serchInput').val('');
  var template = $('#movie-template').html();
  var compiled = Handlebars.compile(template)
  var target = $('#containerMovies');
  var poster = 'https://image.tmdb.org/t/p/w342';


  for (var i = 0; i < arrayMovie.length; i++) {
    var movie = arrayMovie[i];
    var vote = Math.round(movie['vote_average']/2);

    var movieHtml= compiled({
      'title':movie['title'],
      'original_title':movie['original_title'],
      'original_language':movie['original_language'],
      'poster_path': poster + movie['poster_path']
    });
    target.append(movieHtml);

    for (var x = 0; x <= vote; x++) {
      var stars = $('.vote_average').children('.'+x).addClass('stars');
    }

  }
}

function findSerie() {
  var input = $('#serchInput');
  var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
  $('#containerMovies').text('');
  var request = input.val();

  $.ajax({
    url:'https://api.themoviedb.org/3/search/tv',
    method:'GET',
    data:{
      'api_key':apiKey,
      'query':request,
      'language': 'it-IT'
    },
    success : function (data) {
      var arraySeries = data['results'];
      if (data['total_results'] >0) {
        printSeries(arraySeries);
      }else {
        $('#containerMovies').text('NESSUN CONTENUTO TROVATO');
      }


    },
    error : function (err) {
      console.log(err,"error");
    }

  });
}

function printSeries(arraySeries) {
  $('#serchInput').val('');
  var template = $('#movie-template').html();
  var compiled = Handlebars.compile(template)
  var target = $('#containerMovies');
  var poster = 'https://image.tmdb.org/t/p/w342'

  for (var i = 0; i < arraySeries.length; i++) {
    var series = arraySeries[i];
    var vote = Math.round(series['vote_average']/2);
    var seriesHtml= compiled({
      'title':series['name'],
      'original_title':series['original_name'],
      'original_language':series['original_language'],
      'poster_path': poster + series['poster_path']
    });
    target.append(seriesHtml);
    for (var x = 0; x <= vote; x++) {
      var stars = $('.vote_average').children('.'+x).addClass('stars');
    }
  }
}

function home() {
  $('.logoBoolFlix').click(function () {
    $('#serch #serchInput').val('');
    $('#containerMovies').text('');
  });
}

function init() {
  findMovie();
  home();
}

$(document).ready(init);
