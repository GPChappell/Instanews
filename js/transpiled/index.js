"use strict";

var url = 'https://api.nytimes.com/svc/topstories/v2/';
var apiKey = '9ef02a0589784f0db09a4dd1cbaea8ab';
var numberStories = 12; //Number of stories to display

$(document).ready(function () {

  //Initialise Selectric plugin
  $('select').selectric();

  //Retrieve NYT top stories

  $('#sectionDropdown').on('change', function () {
    //When user chooses a news topic

    //Update page elements when articles are requested
    $('.site-header').css('height', 'auto');
    $('.site-header').addClass('results-loaded');
    $('#siteHeaderLogo').addClass('results-loaded');
    $('.search-form').addClass('results-loaded');

    $('.story').remove(); //Remove existing search results
    $('footer').css('position', 'absolute');
    $('.loading-animation').show(); //Show loading GIF

    //Build API query string
    var searchSelection = $('#sectionDropdown').val().toLowerCase();
    var searchURL = url + searchSelection + '.json'; //Read in topic selected by user
    searchURL += '?' + $.param({
      'api-key': apiKey
    });

    //AJAX call to New York Times API
    $.ajax({
      url: searchURL,
      method: 'GET'
    }).done(function (data) {

      //Limit results to 12 articles with image
      var results = data.results.filter(function (val) {
        return val.multimedia[4] != undefined;
      }) //Check article image is present
      .slice(0, 12);

      //Create a html element for  news story
      $.each(results, function (key, value) {

        //Read in story components from AJAX results
        var articleImage = value.multimedia[4].url,
            imageCaption = value.multimedia[4].caption,
            articleURL = value.url,
            articleTitle = value.abstract;

        //Create element for story
        var searchResult = '';
        searchResult = '<article class="story results-loading">';
        searchResult += '<a href=\'' + articleURL + '\' target=\'_blank\'>';
        searchResult += '<img src=\'' + articleImage + '\' alt=\'' + imageCaption + '\'/>';
        searchResult += '<p>' + articleTitle + '</p>';
        searchResult += '</article>';

        //Append story element
        $('#searchResults').append(searchResult);
      });

      //Position footer to follow main content
      $('footer').css('position', 'static');

      // Reveal stories once images are fully loaded
      var images = $('.story-grid img');
      var loadedImgNum = 0;
      images.on('load', function () {
        loadedImgNum += 1;
        if (loadedImgNum === images.length) {
          (function () {
            $('.loading-animation').hide(); //Hide loading GIF
            var articles = $('.story-grid article');

            var _loop = function _loop(index) {
              setTimeout(function () {
                articles[index].classList.remove("results-loading");
              }, (index + 1) * 100);
            };

            for (var index = 0; index <= articles.length - 1; index++) {
              _loop(index);
            }
          })();
        }
      });
    }).fail(function () {
      alert('Stories failed to load. Please try again');
    });
  });
});