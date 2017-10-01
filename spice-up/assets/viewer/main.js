// depends on libphilip.js

var _window = `
  <div class="slides">
		{0}
	</div>
`;

var SLIDE = `
  <div class="slide" style='{1}'>
    {0}
  </div>
`;

var SLIDE_STYLE = "background: {0};";

var text_item = `
  <text-item class="canvas-item" style="{1}">{0}</text-item>
`

var TEXT_STYLE = "color: {0}; font-family: {1}; font-size: {2}px; {3};";

var color_item = `
  <color-item class="canvas-item" style="{0}"></color-item>
`

var COLOR_STYLE = "background: {0}; {1}";


MAX_WIDTH = 2140 + 611;
MAX_HEIGHT = 1532 + 12;
function getPosition (item) {
  var style = "left: {0}px; top: {1}px; min-width: {2}px; min-height: {3}px;";

  var w_scale = 1920 / MAX_WIDTH;
  var h_scale = 1080 / MAX_HEIGHT;
  console.log (w_scale);

  var x = (item["x"] + 611) * w_scale;
  var y = item["y"] * h_scale;
  var w = item["w"] * w_scale;
  var h = item["h"] * h_scale;

  return String.build (style, x, y, w, h);
}

// Formats for the ROW and HEADER for the table
function get (id) {
  // console.log (String.format ("Getting: {0}", id));
  return document.getElementById(id);
}

function renderSlides (file) {
  $('link[rel=stylesheet][href~="assets/css/main.css"]').remove();

  // generate a new FileReader object
  reader = new FileReader();

  // inject an image with the src url
  reader.onload = function(event) {
    let root_object = JSON.parse (event.target.result);
    console.log (root_object);

    let content = "";
    for (var id in root_object.slides) {
      let slide = root_object.slides[id];
      let slide_content = "";

      for (var object_id in slide.items) {
        let item = slide.items[object_id];
        var pos = getPosition(item);

        switch (item["type"]) {
          case "text":
            let text = base64Decode (item['text-data']);
            let style = String.build (TEXT_STYLE, item["color"], item["font"], item["font-size"] * 3, pos);
            slide_content += String.build (text_item, text, style);
            break;
          case "color":
            let styled = String.build (COLOR_STYLE, item["background_color"], pos);
            slide_content += String.build (color_item, styled);

            break;
        }
      }

      let style = String.build (SLIDE_STYLE, slide["background-color"]);
      content += String.build (SLIDE, slide_content, style);
    }

    $('#body').html (String.build (_window, content));

    //var $box = $('#content');
    //$box.tinycarousel();
  }

  // when the file is read it triggers the onload event above.
  reader.readAsText(file);
}

// handle input changes
$('#the-file-input').change(function() {
    console.log(this.files)
    // grab the first image in the FileList object and pass it to the function
    renderSlides (this.files[0])
});
