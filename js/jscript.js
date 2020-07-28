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
                    printMovie(arraySeries);
                  }else {
                    $('#containerMovies').html('<h1 class="error">NESSUN CONTENUTO TROVATO </h1>');
                  }
                },
                error : function (err) {
                  console.log(err,"error");
                }

              });
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
    movie['poster_path']= poster + movie['poster_path'];

    var movieHtml = compiled(movie);
    target.append(movieHtml);

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

function findActor() {

  $(document).on('click','.details', function () {
    var clicked = $(this);
    var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
    var id=clicked.data('id');
    var genre = clicked.data('genre');
    console.log(genre);
    console.log(id);
    $.ajax({
      url:'http://api.themoviedb.org/3/movie/'+id+'/credits',
      method:'GET',
      data:{
        'api_key':apiKey,
      },
      success:function (data) {
        var cast = [];
        for (var i = 0; i < 5; i++) {
          cast.push(data['cast'][i]['name'])
        }
        clicked.html('<h2>'+cast+'</h2>');
        clicked.append('genres: ', genre);
      },
      error:function (err) {
        console.log(err);
      }
    });
  })
}

function init() {
  findMovie();
  home();
  findActor();
}

$(document).ready(init);
