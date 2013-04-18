// this script relies on csCommunicator.js

var currentNode = null;
var savedBorder = null;
var currentBookmark = null;

communicator.on('iconClicked', function(obj) {
    /* Begin selection process */
    if(obj.data === "startSelector"){
      console.log("selection initiated");


      var bs_cssviewer = " <div id='bs_cssviewer'> <div id = 'bs_container'> <div id='title'> <div id='bs_cssviewer_h2'>h2</div> <div id='bs_url'>http://www.google.com</div> </div> <div id='details'> <div id='font-preview'> Grumpy wizards make toxic brew for the evil queen and jack </div> <div id='style-details'> <table id='bs_table'> <tr> <td>font-family</td><td id='bs_font-family'>1</td> </tr> <tr> <td>font-size</td><td id='bs_font-size'>2</td> </tr> <tr> <td>font-weight</td><td id='bs_font-weight'>3</td> </tr> <tr> <td>line-height</td><td id='bs_line-height'>4</td> </tr> <tr> <td>text-align</td><td id='bs_text-align'>5</td> </tr> <tr> <td>word-spacing</td><td id='bs_word-spacing'>6</td> </tr> <tr> <td>color</td><td id='bs_color'>7</td> </tr> </table> </div> </div> <div id='bookmark'> <button id='bs_cssviewer_button'>Bookmark Style</button> </div> </div> <div id = 'bs_container_instr'> Hover over div and press 'S' to preview the CSS here.<br/> Click on the extension icon at any time to close bookmarking... </div> </div>";
      var bs_spacer = $("<div id='bs_spacer'></div>");
      bs_spacer.css({
        'display': 'block',
        'width': '100%',
        'height': '200px',
      });

      $('body').prepend(bs_spacer);
      $('body').prepend(bs_cssviewer);

      $('body').mousemove(function(event) {
        if ($(event.target) !== currentNode) {
          if(savedBorder !== null)
              currentNode.css("border", savedBorder);

          if($(event.target).attr("id") !== "bs_cssviewer" &&
             $(event.target).attr("id") !== "bs_spacer" &&
             !jQuery.contains($("#bs_cssviewer")[0], event.target))
          {
            currentNode = $(event.target);
            savedBorder = currentNode.css("border");
            currentNode.css("border", "3px dashed #F00");
          }
        }
      });

      /* If user presses the "S" key present in preview window */
      $(window).keypress(function(event){
        
        /* Remove instructions, show preview */
        $("#bs_container").css("display", "inline-block");
        $("#bs_cssviewer #bs_container_instr").css("display", "none");

        /* Tag , div class, div id  */
        var tagname = currentNode[0].tagName;
        var classname = currentNode.attr("class");
        var id = currentNode.attr("id");

        /* CSS properties captured */
        font_family = currentNode.css("font-family");
        font_size = currentNode.css("font-size");
        font_weight = currentNode.css("font-weight");
        line_height = currentNode.css("line-height");
        text_align = currentNode.css("text-align");
        word_spacing = currentNode.css("word-spacing");
        color = currentNode.css("color");
        background_color = currentNode.css("background-color");

        /* Draw this information to the preview */
        $("#bs_font-family").html(font_family);
        $("#bs_font-size").html(font_size);
        $("#bs_font-weight").html(font_weight);
        $("#bs_line-height").html(line_height);
        $("#bs_text-align").html(text_align);
        $("#bs_word-spacing").html(word_spacing);
        $("#bs_color").html(color);

        
        var tagStr = tagname;
        if(classname)
          tagStr += "<br/>."+classname;
        if(id)
          tagStr += "<br/>#"+id;

        $("#bs_cssviewer_h2").html(tagStr);
        var url = window.location.host;
        $("#bs_url").html(url);


        /* Update the css for the font preview */
        $("#bs_cssviewer #details #font-preview").css("font-family", font_family);
        $("#bs_cssviewer #details #font-preview").css("font-size", font_size);
        $("#bs_cssviewer #details #font-preview").css("font-weight", font_weight);
        $("#bs_cssviewer #details #font-preview").css("line-height", line_height);
        $("#bs_cssviewer #details #font-preview").css("text-align", text_align);
        $("#bs_cssviewer #details #font-preview").css("word-spacing", word_spacing);
        $("#bs_cssviewer #details #font-preview").css("color", color);
        $("#bs_cssviewer #details #font-preview").css("background-color", background_color);

        /* Update the bookmark object */
        bookmark = {};
        bookmark.url = url;
        bookmark.date = new Date();
        bookmark.image = "";
        bookmark.css = {
          "font_family": font_family,
          "font_size": font_size,
          "font_weight": font_weight,
          "line_height": line_height,
          "text_align": text_align,
          "word_spacing": word_spacing,
          "color": color
        };

        /* Update the button save bookmark on click */
        $("#bs_cssviewer_button").click(function(event){
          console.log("Saving bookmark...");
          chrome.storage.local.get("bookmarks", function(items){
            console.log(items);
            var bookmarks = [];
            if(items.bookmarks)
              var bookmarks = items.bookmarks;
            bookmarks.push(bookmark);
            chrome.storage.local.set({"bookmarks": bookmarks}, function(){
              console.log("Bookmark saved");
            });
          });
        });

      });


    }

    /* Selection process cancelled by the user */
    else if(obj.data === "endSelector"){
      console.log("selection terminated");

      /* Restore CSS state */
      if(savedBorder !== null)
        currentNode.css("border", savedBorder);

      /* Remove selection view */
      $("#bs_cssviewer").remove();
      $("#bs_spacer").remove();

      /* Remove listeners */
      $('body').unbind('mousemove');
      $(window).unbind('keypress');
    }


  // confirm that the data was received (send a 'request' to the background)
  communicator.request('confirm', { received: true });
});