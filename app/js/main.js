document.addEventListener('DOMContentLoaded', function(){ 
	@@include('convertToWebP.js')
  var listTypeView = document.querySelectorAll('.list-type')
  var mainContent = document.querySelector('.main__content')
	$( function() {
    var dateFormat = "mm/dd/yy",
      from = $( "#from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });
 
    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
      return date;
    }
  } )
	 
  function checkClass(elem, className){
    if(elem.classList.contains(className)){
      return true
    }
    return false
  }
   
  listTypeView.forEach(function(elem){
    elem.addEventListener('click', function(){
      var listType = elem.dataset.list
        listTypeView.forEach(function(elem){
          elem.classList.remove('active')
        })      
      elem.classList.add('active')
      if(listType == 'list-view') {
        mainContent.classList.add('list-view')
        if(mainContent.classList.contains('grid-view')){
          mainContent.classList.remove('grid-view')
        }
      }else if(listType == 'grid-view'){
         mainContent.classList.add('grid-view')
          if(mainContent.classList.contains('list-view')){
            mainContent.classList.remove('list-view')
          }
      }
    })
  })
  


});





