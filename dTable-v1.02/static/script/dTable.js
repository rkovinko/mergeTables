(function( $ ) {

$dTableStructure = {
  defult: {
    off: false
  },
  init: function(options){
    if(!this.started){
      this.table = $('table');
      // adding index number each of the td element
      this.table.each(function(){
        $(this).find('tr').each(function(){
          $(this).find('td').each(function(){
            $(this).attr('data-index', $(this).index())
          })
        })
      })

      //adding no-arrow class to first and last td elements
      this.table.find('tr:first td').addClass('no-top');
      this.table.find('tr:last td').addClass('no-bottom');
      this.table.find('tr').each(function(){
        $(this).find('td:first').addClass('no-left');
        $(this).find('td:last').addClass('no-right');
      })

      // create arrow node
      this.node = $('<div>', {
        class : 'arrow'
      })

      // clearing and bind events
      this.clearEvents();
      this.bindEvents();
      console.log('инициализация')
    }else{
      console.log('включили слушатель ивента')
      this.clearEvents();
      this.bindEvents();
    }
    this.started = true;
  },
  bindEvents: function(){
    this.table.find('td').on({
      'mouseenter' : function(){
        if(!$(this).is('.no-top')){
          $dTableStructure.node.clone().appendTo(this).addClass('top');
        }
        if(!$(this).is('.no-right')){
          $dTableStructure.node.clone().appendTo(this).addClass('right');
        }
        if(!$(this).is('.no-bottom')){
          $dTableStructure.node.clone().appendTo(this).addClass('bottom');
        }
        if(!$(this).is('.no-left')){
          $dTableStructure.node.clone().appendTo(this).addClass('left');
        }
      },
      'mouseleave': function(){
        $('.arrow').remove();
      }
    })

    $('body').on('click', '.arrow', function(){
        if($(this).is('.left') || $(this).is('.right') ){
          $dTableStructure.gorizontMerge(this);
        }
        if($(this).is('.top') || $(this).is('.bottom') ){
          $dTableStructure.verticalMerge(this);
        }
        $('.arrow').remove();
    })
  },
  clearEvents: function(){
    this.table.find('td').off();
    $("body").off("click", ".arrow")
  },
  verticalMerge: function(current){
    var cont             = $('tr').has(current),
        topDirection     = $(current).is('.top'),
        curElement       = $('td').has(current),
        curElementIndex  = curElement.data('index'),
        curVal           = curElement.html(),
        curElementAttr   = curElement.attr('rowspan')*1 || 0,
        curElementClass  = curElement.attr('class') || '',
        nextElement      = this.getVertElment(cont, topDirection, curElementIndex, curElement),
        nextElementAttr  = nextElement.attr('rowspan')*1,
        nextElementClass = nextElement.attr('class') || '',
        nextVal          = nextElement.html(),
        resultElement    = false;

    // adding no-arrow class for close td elements
    curElement.prev().addClass('no-right');
    curElement.next().addClass('no-left');
    nextElement.prev().addClass('no-right');
    nextElement.next().addClass('no-left');

    // short link
    var a = curElementAttr,
        b = nextElementAttr;

    // detecting result td container
    if(topDirection){
      resultElement =  nextElement;
      curElement.remove();
    }else{
      resultElement = curElement;
      nextElement.remove();
    }

    // merge two values of td elements to one
    resultElement.html( nextVal  + curVal );


    // adding colspan attr for merged td element given the post-conditions
    this.setMergAttr(resultElement, a, b, 'rowspan', 'no-left no-right '+ curElementClass +' '+ nextElementClass+'');

  },
  gorizontMerge: function(current){
    var cont             = $('tr').has(current),
        curElement       = $('td').has(current),
        curElementIndex  = curElement.data('index'),
        leftDirection    = $(current).is('.left'),
        prevcont         = cont.prev('tr'),
        nextcont         = cont.next('tr'),
        curVal           = curElement.html(),
        curElementAttr   = curElement.attr('colspan')*1 || 0,
        curElementClass  = curElement.attr('class') || '',
        nextElement      = $(curElement[(leftDirection) ?'prev': 'next']('td')),
        nextElementIndex = nextElement.data('index'),
        nextElementAttr  = nextElement.attr('colspan')*1,
        nextElementClass = nextElement.attr('class') || '',
        nextVal          = nextElement.html();

    // short link
    var a = curElementAttr,
        b = nextElementAttr;

    // merge two values of td elements to one
    curElement.html( (leftDirection) ? nextVal + curVal : curVal + nextVal )

    // adding colspan attr for merged td element given the post-conditions
    this.setMergAttr(curElement, a, b, 'colspan', 'no-top no-bottom '+ curElementClass +' '+ nextElementClass+'');

    // generate index of element which is above or below this line tr
    var setIndex =   Math.abs(curElementAttr - curElementIndex),
        a = this.getVertElment(cont, true, setIndex, curElement),
        b = this.getVertElment(cont, false, setIndex, curElement),
        c = this.getVertElment(cont, true, nextElementIndex, curElement),
        d = this.getVertElment(cont, false, nextElementIndex, curElement);

    if(a){
      a.addClass('no-bottom');
    }
    if(b){
      b.addClass('no-top');
    }
    if(c){
      c.addClass('no-bottom');
    }
    if(d){
      d.addClass('no-top');
    }

    nextElement.remove();

  },
  getGorizElment: function(container, index ,classname, direction){
    // helper function to find and add className for element
    return container.find('td[data-index='+index+']').addClass(classname);

  },
  setMergAttr: function(container, a, b, attr, classAttr){
    container
        .attr(''+attr+'', (a && b ) ? a + b : (a) ? ++a : (b) ? ++b : 2)
        .addClass(classAttr);
  },
  getVertElment: function(container, direction, elementIndex, curElement ){
    // helper function to find element which is above or below this line tr
    var table = this.table.has(curElement);
    var
      elemnts    = table.find('tr'),
      stratPoint = $(container).index() + ((direction) ? -1 : 1);
      endPoint   = (direction) ? 0 : elemnts.length;

    if(stratPoint == endPoint){
      return $(elemnts[stratPoint]).find('td[data-index='+elementIndex+']')
    }

    for (var i = stratPoint; (direction) ? i >= endPoint : i < endPoint  ; (direction) ? i-- : i++ ){
      var elemnt = $(elemnts[i]).find('td[data-index='+elementIndex+']');
      if($(elemnt).length !== 0){
        return elemnt;
      }
    }
  }

}

})(jQuery);


