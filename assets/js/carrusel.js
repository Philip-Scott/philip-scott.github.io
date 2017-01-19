(function($) {
    $.carousel = function(id) {
        //console.log(id)
        var plugin = this;
        
        var init = false;
        var playNext = true;

        var SLIDE_TIME = 3000;
        var current_element;
        var slides = [];
        var current_slide;
        var last_slide;

        plugin.nextSlide = function () {
            plugin.current_element = plugin.current_element + 1;
            if (plugin.current_element === plugin.slides.length) {
                plugin.current_element = 0;
            }
            
            plugin.selectVisible (plugin.current_element);
        };

        plugin.selectVisible = function(slide_id) {
            plugin.playNext = false;
            plugin.slides[slide_id].className = "carouselI animated fadeInDown";

            if (plugin.current_slide != null) {
                plugin.current_slide.className = "carouselI animated fadeOutDown"; 
            }

            if (last_slide != null) {
                plugin.last_slide.className = "carouselI"; 
            }

            plugin.last_slide = plugin.current_slide;
            plugin.current_slide = plugin.slides[slide_id];  
        };

        plugin.startCarousel = function() {
            $carousel = plugin;
            $carousel.playNext = true;
            setTimeout(function () {
                if ($carousel.playNext) {
                    $carousel.nextSlide ();
                    $carousel.startCarousel ();
                }
            }, 3000);
        }; 

        var makeCarousel = function (id) {
            if (!init) {
                plugin.init = true;
                plugin.carousel = this;
                plugin.slides = [].slice.call(document.getElementById(id).getElementsByTagName("li"));
                plugin.current_element = 0;
                plugin.selectVisible (0);   
                plugin.startCarousel ();  
                
            }
        };
        
        makeCarousel(id);
    }

    $.fn.carousel = function(id) {
        return this.each(function() {
            if (undefined == $(this).data('carousel')) {
                var plugin = new $.carousel(id);
                $(this).data('carousel', plugin);
            }
        });

    }
})(jQuery);
