// al click del tasto enter si avvia una ricerca del film/serie
function findMovie() {

  $('#serchInput').keydown(function () {
    if (event.which == 13) {
      var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
      var input = $('#serchInput');
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

// viene stampato a schermo il risultato della ricerca film/serie/genere
function printMovie(arrayMovie) {
  $('#containerMovies').text('');
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

// al click della scritta BOOLFLIX si resetta il contenuto della main
function home() {
  var home = $('#containerMovies').html()
  $('.logoBoolFlix').click(function () {
    $('#serch #serchInput').val('');
    $('#containerMovies').html(home);
  });
}

// vengono raccolti i dati riguardanti cast e generi tramite un api diversa
function findActorandGenre() {

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
        clicked.children('.more').text('Cast: '+ cast);
        clicked.append('genres-id: ', genre);
      },
      error:function (err) {
        console.log(err);
      }
    });
  })
}

// vengono creati i due dropdown menu con le liste dei vari generi
function genreMovieandSeries() {
  var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';

  $.ajax({
    url:'https://api.themoviedb.org/3/genre/movie/list',
    method:'GET',
    data:{
      'api_key':apiKey,
    },
    success:function (data) {
      var template = $('#genre-template').html();
      var compiled = Handlebars.compile(template)
      var target = $('.movieGenreList');

      for (var i = 0; i < data['genres'].length; i++) {
        var genere = data['genres'][i];

        var genreHTML = compiled(genere);
        target.append(genreHTML);

      }
    },
    error:function (error) {
      console.log(error);
    }
  });

  $.ajax({
    url:'https://api.themoviedb.org/3/genre/tv/list',
    method:'GET',
    data:{
      'api_key':apiKey,
    },
    success:function (data) {
      var template = $('#series-template').html();
      var compiled = Handlebars.compile(template)
      var target = $('.seriesGenreList');

      for (var i = 0; i < data['genres'].length; i++) {
        var genere = data['genres'][i];

        var genreHTML = compiled(genere);
        target.append(genreHTML);

      }
    },
    error:function (error) {
      console.log(error);
    }
  });
}

// vieni avviata una ricerca attraverso il genere selezionato
function getMovieandSeriesforGenre() {
  var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';

  $(document).on('click','.movieGenreList h4', function () {
    var genreId = $(this).data('genre');
    console.log(genreId)
    $.ajax({
      url:'https://api.themoviedb.org/3/discover/movie',
      method:'GET',
      data:{
        'api_key':apiKey,
        'with_genres':genreId
      },
      success:function (data) {
        console.log(data['results']);
        printMovie(data['results'])
      },
      error:function (err) {
        console.log(err);
      }
    });
  })
  $(document).on('click','.seriesGenreList h4', function () {
    var genreId = $(this).data('genre');
    console.log(genreId)
    $.ajax({
      url:'https://api.themoviedb.org/3/discover/tv',
      method:'GET',
      data:{
        'api_key':apiKey,
        'with_genres':genreId
      },
      success:function (data) {
        console.log(data['results']);
        printMovie(data['results'])
      },
      error:function (err) {
        console.log(err);
      }
    });
  })
}

function init() {
  genreMovieandSeries();
  findMovie();
  home();
  findActorandGenre();
  getMovieandSeriesforGenre();
}

$(document).ready(init);
