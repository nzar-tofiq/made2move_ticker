(function($){
  // Number of seconds in every time division
  var days	= 24 * 60 * 60, hours	= 60 * 60, minutes	= 60, left, d, h, m, s, positions;
  // Creating the plugin
  $.fn.countdown = function(prop){

    var options = $.extend({
        callback	: function(){
      },
      timestamp	: 0,
      stopTicking: false
    },prop);

    // Initialize the plugin
    countdownInit(this, options);

    positions = this.find('.position');

    (function tick(){

      // Time left
      left = Math.floor((options.timestamp - (new Date())) / 1000);

      if(left < 0){
        left = 0;
      }

      // Number of days left
      d = Math.floor(left / days);
      updateDuo(0, 1, d);
      left -= d * days;

      // Number of hours left
      h = Math.floor(left / hours);
      updateDuo(2, 3, h);
      left -= h * hours;

      // Number of minutes left
      m = Math.floor(left / minutes);
      updateDuo(4, 5, m);
      left -= m * minutes;

      // Number of seconds left
      s = left;
      updateDuo(6, 7, s);

      // Calling an optional user supplied callback to be triggered at every tick
      options.callback(d, h, m, s);

      // Scheduling another call of this function in 1s
      // Keeps ticking untill the user sets stopTicking to true
      if (!options.stopTicking) {
        setTimeout(tick, 1000);
      }
    })();

    // This function updates two digit positions at once
    function updateDuo(minor,major,value){
      switchDigit(positions.eq(minor),Math.floor(value/10)%10);
      switchDigit(positions.eq(major),value%10);
    }
    return this;
  };

  /* The two helper functions go here */
  function countdownInit(elem, options){
    elem.addClass('countdownHolder');
    // Creating the markup inside the container
    $.each(['Days','Hours','Minutes', 'Seconds'],function(i){
      $('<div class="count count'+this+'">').html(
          '<div class="digit_container">\
            <span class="position">\
              <span class="digit static"></span>\
            </span>\
            <span class="position">\
              <span class="digit static"></span>\
            </span>\
          </div>\
          <div class="desc">'+this+'</div>'
        ).appendTo(elem);
      });
    }

    // Creates an animated transition between the two numbers
  function switchDigit(position,number){

    var digit = position.find('.digit')

    if(digit.is(':animated')){
      return false;
    }

    if(position.data('digit') == number){
      // We are already showing this number
      return false;
    }

    position.data('digit', number);

    // Top is the distance between the new digit and the position element
    var replacement = $('<div>',{
      'class':'digit',
      css: {
        top: '60px',
        opacity: 1
      },
      html: number
    });

    // Top here is the distance by which the new digit slides up from the bottom
    digit
      .before(replacement)
      .removeClass('static')
      .animate({top:'-100px',opacity:1},'slow',function(){
        digit.remove();
      });

    // Top here is the distance by which the new digit slides up to the top
    // The .static class is added when the animation completes. This makes it run smoother.
    replacement
      .animate({top:'-20px',opacity:1},'slow', function(){
        replacement.addClass('static');
      });
  }
})(jQuery);
