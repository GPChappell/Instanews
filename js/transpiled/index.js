"use strict";

var url = 'https://api.nytimes.com/svc/topstories/v2/';
var apiKey = '9ef02a0589784f0db09a4dd1cbaea8ab';
var numberStories = 12; //Number of stories to display

//Retrieve NYT top stories
$(document).ready(function () {

  $('#sectionDropdown').on('change', function () {
    //When user chooses a news topic

    //Update site header format when results are loaded
    $('.site-header').css('height', 'auto');
    $('.site-header').addClass('results-loaded');
    $('#siteHeaderLogo').addClass('results-loaded');
    $('.search-form').addClass('results-loaded');

    $('.story').remove(); //Remove existing search results
    $('.story-grid__loading-animation').show(); //Show loading GIF

    //Build API query string based on news topic selected by user
    var searchSelection = $(undefined).val().toLowerCase();
    var searchURL = url + searchSelection + '.json';
    searchURL += '?' + $.param({
      'api-key': apiKey
    });

    //AJAX call to New York Times API
    $.ajax({
      url: searchURL,
      method: 'GET'
    }).done(function (data) {

      $('.story-grid__loading-animation').hide(); //Hide loading GIF

      //Process news stories (AJAX data)
      var results = data.results;
      var resultCounter = 0;

      //Create a html element for  news story
      $.each(results, function (key, value) {

        //Only display specified number of stories
        if (resultCounter === numberStories) {
          return false;
        }
        //Skip loading of story if image is missing
        if (value.multimedia[4] === undefined) {
          return true;
        }

        //Read in story components from AJAX results
        var articleImage = value.multimedia[4].url,
            articleURL = value.url,
            articleTitle = value.abstract;

        //Build html element for story
        var searchResult = '';
        searchResult = '<article class="story" style="background: url(\'' + articleImage + '\')';
        searchResult += ' center top / auto 100% no-repeat; ">';
        searchResult += '<a href="' + articleURL + '" target="_blank">';
        searchResult += '<p>' + articleTitle + '</p>';
        searchResult += '</article>';

        //Add story element to document
        $('#searchResults').append(searchResult);

        resultCounter++;
      });

      //Position footer to follow main content
      $('footer').css('position', 'static');
    }).fail(function () {
      alert('Stories failed to load. Please try again');
    });
  });
});