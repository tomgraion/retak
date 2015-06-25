
var computos = {
  init : function(){
    computos.config = {
            items: $( ".tabla-computos tbody tr" ),
            container: $( "<div class='container'></div>" ),
            urlBase: "/foo.php?item="
    };
    $("#calcular" ).click(function() {
      computos.calcular();
    });
    $("#agregar" ).click(function() {
      computos.agregarMuro();
    });
  },

  calcular: function (){
    $(".tabla-computos tbody tr").each(function(){
      var areaMuro = $(this).find('.largoMuro').val() * $(this).find('.altoMuro').val(),
        aberturas = 5;

      for (var i = 1; i < aberturas; i++) {
        areaMuro += computos.calcularAbertura (this,i);
      };

      //Asigna Suma a resultado
      $(this).find('.resultado input').val(areaMuro);
    });
  },

  calcularAbertura : function (context,nro){
    return $(context).find('.ancho' + nro).val() * $(context).find('.alto' + nro).val();
  },

  agregarMuro : function (){
    var $tableBody = $('.tabla-computos').find("tbody"),
      $ultimoTr = $tableBody.find("tr:last"),
      $nuevoTr = $ultimoTr.clone(),
      trNewNumber = parseInt($($ultimoTr).find('.muroNro').val()) + 1;

    //Vaciar Valores y asigna Muro Nro
    $($nuevoTr).find('input').val("");
    $($nuevoTr).find('.muroNro').val(trNewNumber);

    //Imprime TR en como ultima fila
    $ultimoTr.after($nuevoTr);
  }
};

$( document ).ready( computos.init );