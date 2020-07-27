function findMovie() {
  var btn = $('#btnSerch');

  btn.click(function () {
    var input = $('#serchInput');
    var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
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
  });
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
      printSeries(arraySeries);
    },
    error : function (err) {
      console.log(err,"error");
    }
  });
}

function printSeries(arraySeries) {
  var template = $('#movie-template').html();
  var compiled = Handlebars.compile(template)
  var target = $('#containerMovies');

  for (var i = 0; i < arraySeries.length; i++) {
    var series = arraySeries[i];
    var vote = Math.round(series['vote_average']/2);

    var seriesHtml= compiled({
      'title':series['name'],
      'original_title':series['original_name'],
      'original_language':series['original_language'],
    });
    target.append(seriesHtml);
  }
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
