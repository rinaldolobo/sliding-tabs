(function( $ ){
  $.fn.slidingtabs = function(activePos){

    var swipeLeftCount = [];
    var swipeRightCount = [];
    var flag = false;

    $(this).find('.tab-header-list').wrap('<div class="tab-header-container"></div>');
    $(this).find('.tab-content-list').wrap('<div class="tab-content-container"></div>');
    $(this).wrapInner("<div class='tabs-container'></div>");
    
    $(window).resize(function(){
      
      $('.activeindicator').remove();
      $('.tab-header-list').width('100%');
      $('.tab-content-list').width('auto');
      $('.tab-content-list').width('auto');
      $('.tab-content').width('100%');
      $('.tab-content-container .tab-content').css({'transition':'initial','-webkit-transition': 'initial','-moz-transition': 'initial','-ms-transition': 'initial'});
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
          totalCWidth += $(this).outerWidth();
        });
        $(this).closest('.tabs-container').find('.tab-content-list:first>.tab-content').css('width',totalCWidth/$(this).closest('.tabs-container').find('.tab-content-list:first>.tab-content').length/2);
        $(this).outerWidth(totalCWidth/2);
      });

      $('.tab-content-container').each(function(){
        var activeTabElementId = $(this).closest('.tabs-container').attr('id');
        $('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').css({"transform": "translate(-"+($('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').outerWidth())*($('#'+activeTabElementId+'>.tab-header-container:first .activeTab').index())+"px, 0px)"});

        if(($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.activecontent').index()+1)<$('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.tab-content').length)
        {
          slideTabHeads('left',activeTabElementId,0);
        }
        else if(!($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').index()==0))
        {
          slideTabHeads('right',activeTabElementId,0);
        }
      });
      //hide or show gradient indicator
      hideShowGradient();
      $('.tab-content-container .tab-content').css({'transition':'','-webkit-transition': '','-moz-transition': '','-ms-transition': ''});
    });

    var tCount = 0;

    $('.tabs-container').each(function(){
      $(this).attr('id','tabCont'+tCount);
      swipeRightCount[tCount]=0;
      swipeLeftCount[tCount]=0;
      tCount++;
    });

    var tabCount = 0;

    $(this).each(function(){
      $(this).attr('id','tabsCont'+tabCount);
      tabCount++;
    });

    $(window).load(function(){

      $('.tabs').each(function(){
        $(this).append('<span class="activeindicator"></span>');
        $(this).find('.activeindicator').width($(this).outerWidth());
      });

      //dynamically calculate width of tab-header-list div
      $('.tab-header-container').each(function(){
        var totalWidth = 0;
        $(this).find('.tab-header-list .tabs').each(function(){
          totalWidth += $(this).outerWidth(true);
        });
        //dynamically calculate width on the activeindicator based on parent div
        $(this).find('.tab-header-list').outerWidth(totalWidth+2);
      });
      
      setActiveIndicatorPos(activePos);

      $('.tab-content-list').each(function(){
        var totalCWidth = 0;
        $(this).children('.tab-content').each(function(){
          totalCWidth += $(this).outerWidth(true);
        });
        $(this).children('.tab-content').css('width',totalCWidth/$(this).children('.tab-content').length);
        $(this).outerWidth(totalCWidth);
      });

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
        var activeTabElementId = $(this).closest('.tabs-container').attr('id');
        if($('#'+activeTabElementId+'>.tab-header-container:first .activeTab').index()<$(this).index())   //detremine the direction in which the tabcontent is supposed to translate
        {
          $('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').css({"transform": "translate(-"+($('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').outerWidth())*($(this).index())+"px, 0px)"});
          $('#'+activeTabElementId+'>.tab-header-container:first .activeTab').removeClass('activeTab');
          $(this).addClass('activeTab');
          $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab .activeindicator').width($('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab').outerWidth());
          $('#'+activeTabElementId+'>.tab-content-container:first .activecontent:first').removeClass('activecontent');
          $('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content:nth-child('+($('#'+activeTabElementId+'>.tab-header-container:first .activeTab').index()+1)+')').addClass('activecontent');
          swipeLeftCount[activeTabElementId.substring(7)]=$(this).index();
          swipeRightCount[activeTabElementId.substring(7)]=$(this).index();
          
          slideTabHeads('left',activeTabElementId);
          
          flag = true;
          setTimeout(function(){
            flag = false;
          }, 800);

          $('#'+activeTabElementId+'> .tab-content-container').height($('#'+activeTabElementId+' .activecontent').outerHeight());
        }
        else
        {
          $currMatrix = $('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').css('transform');   //get current items transform matrix
          $currValues = $currMatrix.match(/-?[\d\.]+/g);
          $currX = parseInt($currValues[4],10);       //get translateX value from the transform matrix
          $currTranslateVal = ($('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').outerWidth())*($('#'+activeTabElementId+'>.tab-header-container .activeTab').index()-$(this).index())+$currX;         //calculate the translate value by adding width to the current translateX value
          $('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content').css({"transform": "translate("+$currTranslateVal+"px, 0px)","-ms-transform": "translate("+$currTranslateVal+"px, 0px)","-moz-transform": "translate("+$currTranslateVal+"px, 0px)","-webkit-transform": "translate("+$currTranslateVal+"px, 0px)"});

          $('#'+activeTabElementId+'>.tab-header-container:first .activeTab').removeClass('activeTab');
          $(this).addClass('activeTab');
          $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab .activeindicator').width($('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab').outerWidth());
          $('#'+activeTabElementId+'>.tab-content-container:first .activecontent:first').removeClass('activecontent');
          $('#'+activeTabElementId+' .tab-content-container:first .tab-content-list:first> .tab-content:nth-child('+($('#'+activeTabElementId+'>.tab-header-container:first .activeTab').index()+1)+')').addClass('activecontent');
          swipeLeftCount[activeTabElementId.substring(7)]=$(this).index();
          swipeRightCount[activeTabElementId.substring(7)]=$(this).index();

          slideTabHeads('right',activeTabElementId);

          flag = true;
          setTimeout(function(){
            flag = false;
          }, 800);
          $('#'+activeTabElementId+'> .tab-content-container').height($('.activecontent').outerHeight());
        }
      }
    });

    //Swipe left
    $(document).on("swipeLeft",".activecontent", function(e){
      e.stopPropagation();
      slideContent('left',$(this));
    });

    //Swipe right
    $(document).on("swipeRight",".activecontent", function(e){
      e.stopPropagation();
      slideContent('right',$(this));
    });

    $(document).on("swipeRight",".tab-header-container", function(e){
      e.stopPropagation();
    });

    $(document).on("swipeLeft",".tab-header-container", function(e){
      e.stopPropagation();
    });

    $(document).on('scrollstart','.dummy-tab-container',function(e){
      e.stopPropagation();
      hideShowGradient();
    });

    $(document).on('scrollstop','.dummy-tab-container',function(e){
      e.stopPropagation();
      hideShowGradient();
    });
  
    var x,down,left,newX;
    $down=false;
    $(document).on("mousedown",".dummy-tab-container",function(e){
      var containerID = $(this).closest('.tabs-container').attr("id");
      e.preventDefault();
      e.stopPropagation();

      down=true;
      x=e.pageX;
      left=$("#"+containerID+">.tab-header-container>.dummy-tab-container").scrollLeft();
    });

    $(document).on("mousemove",".dummy-tab-container",function(e){
      var containerID = $(this).closest('.tabs-container').attr("id");
      e.stopPropagation();
      if(down)
      {
        newX=e.pageX;   
        $("#"+containerID+">.tab-header-container>.dummy-tab-container").scrollLeft(left-newX+x);
        hideShowGradient();
      }
    });

    $(document).on("mouseleave",".dummy-tab-container",function(e){
      down=false;
    });

    $(document).on("mouseup",".dummy-tab-container",function(e){
      down=false;
    });

    function slideContent(direction,element){
      if(!flag) //check if any animation is in progress and wait if yes
      {
        var activeTabElementId = $(element).closest('.tabs-container').attr('id');
        if(direction == "right")
        {
          if(!($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').index()==0))
          {
            swipeRightCount[activeTabElementId.substring(7)]=swipeRightCount[activeTabElementId.substring(7)]+1;
            if(swipeLeftCount[activeTabElementId.substring(7)]>0)
              swipeLeftCount[activeTabElementId.substring(7)]=swipeLeftCount[activeTabElementId.substring(7)]-1;
            $currMatrix = $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.tab-content').css('transform');   //get current items transform matrix
            $currValues = $currMatrix.match(/-?[\d\.]+/g);
            $currX = parseInt($currValues[4],10);       //get translateX value from the transform matrix
            $currTranslateVal = ($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.tab-content').outerWidth())+$currX;         //calculate the translate value by adding width to the current translateX value
            $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.tab-content').css({"transform": "translate("+$currTranslateVal+"px, 0px)","-ms-transform": "translate("+$currTranslateVal+"px, 0px)","-moz-transform": "translate("+$currTranslateVal+"px, 0px)","-webkit-transform": "translate("+$currTranslateVal+"px, 0px)"});
            
            $('#'+activeTabElementId+'>.tab-header-container:first .activeTab').removeClass('activeTab');
            $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.tabs:nth-child('+($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').index())+')').addClass('activeTab');
            $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab .activeindicator').width($('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab').outerWidth());
            $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').removeClass('activecontent');
            $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.tab-content:nth-child('+($('#'+activeTabElementId+'>.tab-header-container:first .activeTab').index()+1)+')').addClass('activecontent');
            slideTabHeads('right',activeTabElementId);
            flag = true;
            setTimeout(function(){
              flag = false;
            }, 800);
            $('#'+activeTabElementId+' .tab-content-container:first').height($('#'+activeTabElementId+' .activecontent').outerHeight());
          }
        }
        else if(direction == "left")
        {
          if(($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.activecontent').index()+1)<$('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.tab-content').length)
          {
            swipeLeftCount[activeTabElementId.substring(7)]=swipeLeftCount[activeTabElementId.substring(7)]+1;

            if(swipeRightCount[activeTabElementId.substring(7)]>0)
              swipeRightCount[activeTabElementId.substring(7)]=swipeRightCount[activeTabElementId.substring(7)]-1;

            $x=($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.tab-content').outerWidth())*$('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').index();
            $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first> .tab-content').css({"transform": "translate(-"+($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list .tab-content').outerWidth())*($('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').index()+1)+"px, 0px)"});
            $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab').removeClass('activeTab');
            $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.tabs:nth-child('+(swipeLeftCount[activeTabElementId.substring(7)]+1)+')').addClass('activeTab');
            $('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab .activeindicator').width($('#'+activeTabElementId+'>.tab-header-container:first .tab-header-list:first>.activeTab').outerWidth());
            $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list:first>.activecontent').removeClass('activecontent');
            $('#'+activeTabElementId+'>.tab-content-container:first>.tab-content-list>.tab-content:nth-child('+($('#'+activeTabElementId+'>.tab-header-container:first .activeTab').index()+1)+')').addClass('activecontent');

            slideTabHeads('left',activeTabElementId);
            flag = true;

            setTimeout(function(){
              flag = false;
            }, 800);
            $('#'+activeTabElementId+' .tab-content-container:first').height($('#'+activeTabElementId+'.tab-content-container:first .activecontent:first').outerHeight());
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

    function slideTabHeads(direction,TabElementId,speed){
      var sp;
      if(speed)
       {
        sp=800;
      }
      else
      {
        sp=speed;
      }
      if(direction=='right')
      {
        $tabPos = $('#'+TabElementId+'>.tab-header-container .activeTab').position().left;
        if($('#'+TabElementId+'>.tab-header-container .activeTab').position().left<1)
        {
          $('#'+TabElementId+'>.tab-header-container .dummy-tab-container').animate({scrollLeft: '+='+$tabPos},sp);
        }
        else if(($tabPos + $('#'+TabElementId+'>.tab-header-container .activeTab').outerWidth(true)) > $('#'+TabElementId+'>.tab-header-container .dummy-tab-container').width())
        {
          $('#'+TabElementId+'>.tab-header-container .dummy-tab-container').animate({scrollLeft: '+='+$tabPos},sp);
        }
        setTimeout(function(){
          hideShowGradient();
        }, 800);
      }
      else if(direction=='left')
      {
        $tabPos = $('#'+TabElementId+'>.tab-header-container .activeTab').position().left;
        if(($('#'+TabElementId+'>.tab-header-container .activeTab').position().left+$('#'+TabElementId+'>.tab-header-container .activeTab').outerWidth(true))>$('#'+TabElementId+'>.tab-header-container').width())
        {
          $('#'+TabElementId+'>.tab-header-container .dummy-tab-container').animate({scrollLeft: '+='+$tabPos},sp);
        }
        else if($tabPos <0)
        {
          $('#'+TabElementId+'>.tab-header-container .dummy-tab-container').animate({scrollLeft: '+='+$tabPos},sp);
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

