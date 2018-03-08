'use strict';

const url = 'https://api.nytimes.com/svc/topstories/v2/';
const apiKey = '9ef02a0589784f0db09a4dd1cbaea8ab';
const numberStories = 12;  //Number of stories to display


$(document).ready( () => {

  //Initialise Selectric plugin
  $('select').selectric();

  //Retrieve NYT top stories
  $('#sectionDropdown').on('change', () => { //When user chooses a news topic
    
    //Update site header format when results are loaded
    $( '.site-header' ).css( 'height', 'auto' ); 
    $( '.site-header' ).addClass( 'results-loaded' );
    $( '#siteHeaderLogo' ).addClass( 'results-loaded' );
    $( '.search-form' ).addClass( 'results-loaded' );

    $( '.story' ).remove(); //Remove existing search results
    $( 'footer' ).css( 'position', 'absolute' );
    $( '.loading-animation' ).show(); //Show loading GIF
    $( '.story-grid').toggleClass( 'results-loading' );

    //Build API query string based on news topic selected by user
    let searchSelection = $('#sectionDropdown').val().toLowerCase();
    let searchURL = url + searchSelection + '.json' 
    searchURL += '?' + $.param({
      'api-key': apiKey
    });

    //AJAX call to New York Times API
    $.ajax({
      url: searchURL,
      method: 'GET',
    })
    .done( ( data ) => {

      // $( '.loading-animation' ).hide();  //Hide loading GIF
      
      //Process news stories (AJAX data)
      let results = data.results;
      let resultCounter = 0;

      //Create a html element for  news story
      $.each(results, ( key, value ) => {
        
        //Only display specified number of stories
        if( resultCounter === numberStories ) {  
          return false;
        }
        //Skip loading of story if image is missing
        if( value.multimedia[4] === undefined ){  
          return true;
        }

        //Read in story components from AJAX results
        let articleImage = value.multimedia[4].url,
          imageCaption = value.multimedia[4].caption,
          articleURL = value.url,
          articleTitle = value.abstract;

        //Build html element for story
        var searchResult = '';
        searchResult = `<article class="story">`;
        searchResult += `<a href='${articleURL}' target='_blank'>`;        
        searchResult += `<img src='${articleImage}' alt='${imageCaption}'/>`;
        searchResult += `<p>${articleTitle}</p>`;
        searchResult += `</article>`;

        //Add story element to document
        $( '#searchResults' ).append( searchResult ); 

        resultCounter++;
      });

      //Position footer to follow main content
      $( 'footer' ).css( 'position', 'static' ); 

      // Reveal stories once images are fully loaded
      var images = $(".story-grid img");
      var loadedImgNum = 0;
      images.on('load', function(){
        loadedImgNum += 1;
        if (loadedImgNum == images.length) {
          $( '.story-grid').toggleClass( 'results-loading' );
        }
      });
      $( '.loading-animation' ).hide();  //Hide loading GIF

    })
    .fail(function() {
      alert('Stories failed to load. Please try again');
      $( '.story-grid').toggleClass( 'results-loading' );
    });
  });
});