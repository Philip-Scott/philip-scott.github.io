// depends on libphilip.js

var SLIDES = `
  <div class="slides">
		{0}
	</div>
`;

var SLIDE_STYLE = "background: {1}, {0};";
var SLIDE = `
  <div class="slide" style='{1}'>
    {0}
  </div>
`;

var TEXT_STYLE = "color: {0}; font-family: {1}; font-size: {2}px; {3}; justify-content: {4}; text-align: {5}; font-weight: {6}";
var TEXT_ITEM = `
  <text-item class="canvas-item" style="{1}"><span>{0}</span></text-item>
`

var COLOR_STYLE = "background: {0}; {1}";
var COLOR_ITEM = `
  <color-item class="canvas-item" style="{0}"></color-item>
`

var IMAGE_STYLE = "background: url(data:image/{1};base64,{0}) no-repeat center; background-size: contain; {2}";
var IMAGE_ITEM = `
  <image-item class="canvas-item" style="{0}"></image-item>
`

MAX_WIDTH = 2140 + 611;
MAX_HEIGHT = 1532 + 12;
function getPosition (item) {
  var style = "left: {0}px; top: {1}px; min-width: {2}px; max-width: {2}px; min-height: {3}px; max-height: {3}px;";

  var w_scale = 1920 / MAX_WIDTH;
  var h_scale = 1080 / MAX_HEIGHT;
  console.log (w_scale);

  var x = (item["x"] + 611) * w_scale;
  var y = (item["y"] + 12) * h_scale;
  var w = item["w"] * w_scale;
  var h = item["h"] * h_scale;

  return String.build (style, x, y, w, h);
}

// Formats for the ROW and HEADER for the table
function get (id) {
  return document.getElementById(id);
}

function renderSlides (file) {
  reader = new FileReader();

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
        let style = "";
        switch (item["type"]) {
          case "text":
            let text = base64Decode (item['text-data']);
            let justification;
            let text_align = "";

            switch (item['justification']) {
              case 0: justification = "flex-start"; text_align = "left"; break;
              case 1: justification = "center"; text_align = "center"; break;
              case 2: justification = "flex-end"; text_align = "right"; break;
              case 3: justification = "center"; text_align = "justify"; break;
            }

            let font_style = item["font-style"];
            if (font_style.indexOf("italic") != -1) {
              font_style = font_style.replace(" italic", "");
            }

            switch (font_style) {
              case "black": font_style = "900"; break;
              case "extrabold": font_style = "800"; break;
              case "semibold": font_style = "600"; break;
              case "bold": font_style = "700"; break;
              case "medium": font_style = "500"; break;
              case "regular": font_style = "400"; break;
              case "extralight": font_style = "300"; break;
              case "light": font_style = "200"; break;
              case "thin": font_style = "100"; break;
            }

            style = String.build (TEXT_STYLE, item["color"], item["font"], item["font-size"] * 3.8, pos, justification, text_align, font_style);
            slide_content += String.build (TEXT_ITEM, text, style);
            break;
          case "color":
            style = String.build (COLOR_STYLE, item["background_color"], pos);
            slide_content += String.build (COLOR_ITEM, style);
            break
          case "image":
            style = String.build (IMAGE_STYLE, item["image-data"], item["image"], pos);
            slide_content += String.build (IMAGE_ITEM, style);
            break;
        }
      }

      let background_pattern = slide["background-pattern"];
      if (background_pattern !== "") {
        let pattern = background_pattern.split ("/");
        background_pattern = "url(https://raw.githubusercontent.com/Philip-Scott/Spice-up/master/data/assets/patterns/" + pattern[pattern.length - 1] + ")";
      } else {
        background_pattern = "none";
      }

      let style = String.build (SLIDE_STYLE, slide["background-color"], background_pattern);
      content += String.build (SLIDE, slide_content, style);

      $('#body').html (String.build (SLIDES, content));
      $('link[rel=stylesheet][href~="assets/css/main.css"]').remove();
    }
  }

  reader.readAsText(file);
}

$('#the-file-input').change(function() {
    console.log(this.files)
    renderSlides (this.files[0])
});
