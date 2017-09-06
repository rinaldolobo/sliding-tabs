(function( $ ){
  $.fn.slidingtabs = function(activePos){

    var swipeLeftCount = 0;
    var swipeRightCount = 0;
    var flag = false;

    $(this).find('.tab-header-list').wrap('<div class="tab-header-container"></div>');
    $(this).find('.tab-content-list').wrap('<div class="tab-content-container"></div>');
    $(this).find('.tab-header-container,.tab-content-container').wrapAll("<div class='tabs-container'></div>");
    
    $(window).resize(function(){
      $('.activeindicator').remove();
      $('.tab-header-list').width('100%');
      $('.tab-content-list').width('auto');
      $('.tab-content').width('100%');
      $('.tabs-container .tab-content').css({'transition':'initial','-webkit-transition': 'initial','-moz-transition': 'initial','-ms-transition': 'initial'});
      $('.tabs').each(function(){
        $(this).append('<span class="activeindicator"></span>');
        $(this).find('.activeindicator').width($(this).outerWidth());
      });

      //dynamically calculate width of tab-header-list div
      $('.tab-header-container').each(function(){
        var totalWidth = 0;
        $(this).find('.tab-header-list:first .tabs').each(function(){
          totalWidth += $(this).outerWidth(true);
        });
        $(this).find('.tab-header-list').outerWidth(totalWidth+2);
      });

      setActiveIndicatorPos(activePos);

      $('.tab-content-list').each(function(){
        var totalCWidth = 0;
        $(this).children('.tab-content').each(function(){
          $(this).outerWidth($(this).parent().outerWidth());
          totalCWidth += $(this).outerWidth(true);
        });

        $(this).closest('.tabs-container').find('.tab-content-list:first>.tab-content').css('width',totalCWidth/$(this).closest('.tabs-container').find('.tab-content-list:first>.tab-content').length);
        $(this).outerWidth(totalCWidth);
      });

      $('.tab-content-container').each(function(){
        // var activeTabElementId = $(this).closest('.tabs-container').attr('id');
        $('.tab-content-container:first .tab-content-list:first> .tab-content').css({"transform": "translate(-"+($('.tab-content-container:first .tab-content-list:first> .tab-content').outerWidth())*($('.tab-header-container:first .activeTab').index())+"px, 0px)"});

        if(($('.tab-content-container:first>.tab-content-list>.activecontent').index()+1)<$('.tab-content-container:first>.tab-content-list:first>.tab-content').length)
        {
          slideTabHeads('left',0);
        }
        else if(!($('.tab-content-container:first>.tab-content-list:first>.activecontent').index()==0))
        {
          slideTabHeads('right',0);
        }
      });

      //hide or show gradient indicator
      hideShowGradient();
      $('.tabs-container .tab-content').css({'transition':'','-webkit-transition': '','-moz-transition': '','-ms-transition': ''});
    });

    $(window).load(function(){

      $('.tabs').each(function(){
        $(this).append('<span class="activeindicator"></span>')
      });

      //dynamically calculate width of tab-header-list div
      $('.tab-header-container').each(function(){
        var totalWidth = 0;
        $(this).find('.tab-header-list:first .tabs').each(function(){
          totalWidth += $(this).outerWidth(true);
        });
        $(this).find('.tab-header-list').outerWidth(totalWidth+2);
      });

      //dynamically calculate width on the activeindicator based on parent div
      $('.activeindicator').width($('.activeTab').outerWidth());
      
      setActiveIndicatorPos(activePos);

      $('.tab-content').css('width',$('.tab-content-container').width());

      $('.tab-content-container').height($('.activecontent').outerHeight());

      //hide or show gradient indicator
      hideShowGradient();

    });

    //add scroll indicators on left and right
    $('.tab-header-container').prepend("<span class='leftshadow'></span><span class='rightshadow'></span>");

    //add wrapper around the tab headers
    $('.tab-header-list').wrap('<div class="dummy-tab-container"></div>');

    $(document).on('click','.tabs', function(){
      if(!flag) //check if any animation is in progress and wait if yes
      {
        if($('.activeTab').index()<$(this).index())   //determine the direction in which the tabcontent is supposed to translate
        {
          $('.tab-content').css({"transform": "translate(-"+($('.tab-content').outerWidth())*($(this).index())+"px, 0px)"});
          $('.activeTab').removeClass('activeTab');
          $(this).addClass('activeTab');
          $('.activecontent').removeClass('activecontent');
          $('.tab-content:nth-child('+($('.activeTab').index()+1)+')').addClass('activecontent');
          swipeLeftCount=$(this).index();
          swipeRightCount=$(this).index();
          
          slideTabHeads('left');
          
          flag = true;
          setTimeout(function(){
            flag = false;
          }, 800);

          $('.tab-content-container').height($('.activecontent').outerHeight());
        }
        else
        {
          $currMatrix = $('.tab-content').css('transform');   //get current items transform matrix
          $currValues = $currMatrix.match(/-?[\d\.]+/g);
          $currX = parseInt($currValues[4],10);       //get translateX value from the transform matrix
          $currTranslateVal = ($('.tab-content').outerWidth())*($('.activeTab').index()-$(this).index())+$currX;         //calculate the translate value by adding width to the current translateX value
          $('.tab-content').css({"transform": "translate("+$currTranslateVal+"px, 0px)","-ms-transform": "translate("+$currTranslateVal+"px, 0px)","-moz-transform": "translate("+$currTranslateVal+"px, 0px)","-webkit-transform": "translate("+$currTranslateVal+"px, 0px)"});

          $('.activeTab').removeClass('activeTab');
          $(this).addClass('activeTab');
          $('.activecontent').removeClass('activecontent');
          $('.tab-content:nth-child('+($('.activeTab').index()+1)+')').addClass('activecontent');
          swipeLeftCount=$(this).index();
          swipeRightCount=$(this).index();

          slideTabHeads('right');

          flag = true;
          setTimeout(function(){
            flag = false;
          }, 800);
          $('.tab-content-container').height($('.activecontent').outerHeight());
        }
      }
      else
      {
          //do nothing
      }
    });

    //Swipe left
    $(document).on("swipeleft",".activecontent", function(){
      slideContent("left");
    });

    //Swipe right
    $(document).on("swiperight",".activecontent", function(){
      slideContent("right");
    });

    $(document).on('scrollstart','.dummy-tab-container',function(){
      hideShowGradient();
    });

    $(document).on('scrollstop','.dummy-tab-container',function(){
      hideShowGradient();
    });

    // $x,$y,$top,$left,;
    $down=false;

    $(document).on("mousedown",".dummy-tab-container",function(e){
      e.preventDefault();

      $down=true;
      $x=e.pageX;
      $left=$('.dummy-tab-container').scrollLeft();
    });

    $(document).on("mousemove",".dummy-tab-container",function(e){
      if($down)
      {
        $newX=e.pageX;   
        $(".dummy-tab-container").scrollLeft($left-$newX+$x);
        hideShowGradient();
      }
    });

    $(document).on("mouseup",".dummy-tab-container",function(e){
      $down=false;
    });

    $(document).on("mouseleave",".dummy-tab-container",function(e){
      $down=false;
    });

    function slideContent(direction){
      if(!flag) //check if any animation is in progress and wait if yes
      {
        if(direction == "right")
        {
          if(!($('.activecontent').index()==0))
          {
            swipeRightCount++;
            if(swipeLeftCount>0)
              swipeLeftCount--;

            $currMatrix = $('.tab-content').css('transform');   //get current items transform matrix
            $currValues = $currMatrix.match(/-?[\d\.]+/g);
            $currX = parseInt($currValues[4],10);       //get translateX value from the transform matrix
            $currTranslateVal = ($('.tab-content').outerWidth())+$currX;         //calculate the translate value by adding width to the current translateX value
            $('.tab-content').css({"transform": "translate("+$currTranslateVal+"px, 0px)","-ms-transform": "translate("+$currTranslateVal+"px, 0px)","-moz-transform": "translate("+$currTranslateVal+"px, 0px)","-webkit-transform": "translate("+$currTranslateVal+"px, 0px)"});
            
            $('.activeTab').removeClass('activeTab');
            $('.tabs:nth-child('+($('.activecontent').index())+')').addClass('activeTab');
            $('.activecontent').removeClass('activecontent');
            $('.tab-content:nth-child('+($('.activeTab').index()+1)+')').addClass('activecontent');
            slideTabHeads('right');
            flag = true;
            setTimeout(function(){
              flag = false;
            }, 800);
            $('.tab-content-container').height($('.activecontent').outerHeight());
          }
        }
        else if(direction == "left")
        {
          if(($('.activecontent').index()+1)<$('.tab-content').length)
          {
            swipeLeftCount++;

            if(swipeRightCount>0)
             swipeRightCount--;

            $x=($('.tab-content').outerWidth())*$('.activecontent').index();
            $('.tab-content').css({"transform": "translate(-"+($('.tab-content').outerWidth())*($('.activecontent').index()+1)+"px, 0px)"});
            $('.activeTab').removeClass('activeTab');
            $('.tabs:nth-child('+(swipeLeftCount+1)+')').addClass('activeTab');
            $('.activecontent').removeClass('activecontent');
            $('.tab-content:nth-child('+($('.activeTab').index()+1)+')').addClass('activecontent');

            slideTabHeads('left');
            flag = true;

            setTimeout(function(){
             flag = false;
            }, 800);
            $('.tab-content-container').height($('.activecontent').outerHeight());
          }
        }
        hideShowGradient();
      }
    }

    function hideShowGradient(){
      if($('.tabs:nth-child(1)').position().left<0)
        $('.leftshadow').show();
      else if($('.tabs:nth-child(1)').position().left>=0)
        $('.leftshadow').hide();

      $lastTabPos = $('.tabs:last-child').position().left + $('.tabs').outerWidth();

      if($lastTabPos>$('.dummy-tab-container').width())
        $('.rightshadow').fadeIn();
      else if($lastTabPos<=$('.dummy-tab-container').width())
        $('.rightshadow').fadeOut();
    }

    function slideTabHeads(direction,speed){
      var sp;
      if(speed)
      {
        sp = 800;
      }
      else
      {
        sp = speed;
      }
      if(direction=='right')
      {
        $tabPos = $('.activeTab').position().left;
        if($('.activeTab').position().left<1)
        {
          $(".dummy-tab-container").animate({scrollLeft: '+='+$tabPos},sp);
        }
        else if(($tabPos + $('.activeTab').outerWidth()) > $(".dummy-tab-container").width())
        {
          $(".dummy-tab-container").animate({scrollLeft: '+='+$tabPos},sp);
        }
        setTimeout(function(){
          hideShowGradient();
        }, 1000);
      }
      else if(direction=='left')
      {
        $tabPos = $('.activeTab').position().left;
        if(($('.activeTab').position().left+$('.activeTab').outerWidth())>$('.tab-header-container').width())
        {
          $(".dummy-tab-container").animate({scrollLeft: '+='+$tabPos},sp);
        }
        else if($tabPos <0)
        {
          $(".dummy-tab-container").animate({scrollLeft: '+='+$tabPos},sp);
        }
        setTimeout(function(){
          hideShowGradient();
        }, 100);
      }
    }

    function setActiveIndicatorPos(position){
      $position = position;
      if($position.toLowerCase() == 'top')
      {
        $('.activeindicator').css('top','0px');
      }
      else if($position.toLowerCase() == 'bottom')
      {
        $('.activeindicator').css('bottom','0px');
      }
    }
  };
})( jQuery );