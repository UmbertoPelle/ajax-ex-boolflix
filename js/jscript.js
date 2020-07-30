// al click del tasto enter si avvia una ricerca del film/serie
function findMovieSerie() {
  $('#serchInput').keydown(function () {

    if (event.which == 13) {
      var empty=0;
      var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
      var input = $('#serchInput');
      var request = input.val();

      if (request) {
        $('#containerMovies').text('');
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
              empty++;
            }
          },
          error : function (err) {
            console.log(err,"error");
          }
        });
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
              empty++;
              if (empty==2) {
                input.val('')
                $('#containerMovies').html('<h1 class="error">NESSUN CONTENUTO TROVATO </h1>');
              }
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

  $(document).on('click','.details .more', function () {
    var clicked = $(this).parent('.details');
    var apiKey = 'dc2cea832b9cc2420fe1b945e738abdf';
    var id=clicked.data('id');
    var genre = [];

    // prendo la lista dei generi id-nome e salvo solo i nomi
    $.ajax({
      url:'http://api.themoviedb.org/3/movie/'+id+'?api_key=dc2cea832b9cc2420fe1b945e738abdf',
      method:'GET',
      data:{
        'api_key':apiKey,
      },
      success:function (data) {
        for (var i = 0; i < data['genres'].length; i++) {
          genre.push(data['genres'][i]['name']+', ')
        }
      },
      error:function (error) {
        console.log(error);
      }
    });

    // stampo cast e generi
    $.ajax({
      url:'http://api.themoviedb.org/3/movie/'+id+'/credits',
      method:'GET',
      data:{
        'api_key':apiKey,
      },
      success:function (data) {
        var cast = [];
        for (var i = 0; i < 5; i++) {
          cast.push(data['cast'][i]['name']);
        }
        clicked.children('.more').text('');
        clicked.append('<h3>'+cast+'</h3>');
        clicked.append('genres: ', genre);
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
      'language': 'it-IT'
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
      'language': 'it-IT'
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
        'with_genres':genreId,
        'language': 'it-IT'
      },
      success:function (data) {
        $('#containerMovies').text('');
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
        'with_genres':genreId,
        'language': 'it-IT'
      },
      success:function (data) {
        $('#containerMovies').text('');
        printMovie(data['results'])
      },
      error:function (err) {
        console.log(err);
      }
    });
  })
}

// viene stampato a schermo il risultato della ricerca film/serie/genere
function printMovie(arrayMovie) {
  $('#serchInput').val('');
  var template = $('#movie-template').html();
  var compiled = Handlebars.compile(template)
  var target = $('#containerMovies');
  var poster = 'https://image.tmdb.org/t/p/w342';

  for (var i = 0; i < arrayMovie.length; i++) {
    var movie = arrayMovie[i];
    var vote = Math.ceil(movie['vote_average']/2);
    movie['poster_path']= poster + movie['poster_path'];

    var movieHtml = compiled(movie);
    target.append(movieHtml);

    for (var x = 1; x <= vote; x++) {
      var stars = $('.vote_average').children('.'+x).addClass('stars');
    }

  }
}

function init() {
  genreMovieandSeries();
  findMovieSerie();
  home();
  findActorandGenre();
  getMovieandSeriesforGenre();
}

$(document).ready(init);
