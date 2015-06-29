var computos = {
  init : function(){
    $("#calcular" ).click(function() {
      computos.calcular();
    });
    $("#agregar" ).click(function() {
      computos.agregarMuro();
    });

  },
  espesores : {
      7.5 : {
        val : 0,
        clase : '75',
        xpaletmacizo: 20
      } ,
      10 :  {
        val : 0,
        clase : '10',
        xpaletmacizo: 15
      } ,
      12.5 : {
        val : 0,
        clase : '125',
        xpaletmacizo: 12,
        clasemacizo: 'macizo'
      },
      15 :  {
        val : 0,
        clase : '15',
        claseU :'15u',
        xpaletmacizo: 10,
        xpaletu: 24,
        largo: 0
      },
      17.5 : {
        val : 0,
        clase : '175',
        claseU :'175u',
        xpaletmacizo: 9,
        xpaletu: 20,
        largo: 0
      } ,
      20 : {
        val : 0,
        clase : '20',
        claseU :'20u',
        xpaletmacizo: 7,
        xpaletu: 20,
        largo: 0
      }
  },

  restartEspesores : function () {
    for(var i in this.espesores){
      this.espesores[i].val = 0;
      this.espesores[i].largo = 0;
    }
  },

  sumarMetrosPorEspesor : function (espesorMuro, areaMuro){
    //this.espesores;
  },

  calcular: function (){

    this.restartEspesores();

    $( ".tabla-computos tbody tr" ).each(function(){
      var areaMuro = $(this).find('.largoMuro').val() * $(this).find('.altoMuro').val(),
        largoMuro = parseInt($(this).find('.largoMuro').val()),
        aberturas = 5,
        noPortante = $(this).find('.tipoMuro').val() === 'NP' ? true : false,
        espesorMuro = $(this).find('.espesorMuro').val(),
        espesores = computos.espesores;

      //Calcula Superficie Neta
      for (var i = 1; i < aberturas; i++) {
        areaMuro -= computos.calcularAbertura (this,i);
      };

      //Agregar Mts 2 Por Espesor
      computos.espesores[espesorMuro].val += areaMuro;

      //Largo de muro para NP
      if(espesorMuro>=15 && !noPortante){
        computos.espesores[espesorMuro].largo += largoMuro;
      }

      //Asigna Suma de Superficie Neta a resultado
      $(this).find('.resultado input').val(areaMuro);
    });
    this.llenarTablaMateriales();
  },

  llenarTablaMateriales : function (){
    for(var i in this.espesores){

    //Declaro Variables
    var clase = this.espesores[i].clase,
      claseU = this.espesores[i].claseU,
      valor = this.espesores[i].val,
      largo = Math.ceil(this.espesores[i].largo),
      xpaletmacizo = this.espesores[i].xpaletmacizo,
      xpaletu = this.espesores[i].xpaletu,
      palletsMacizo = Math.ceil(valor/xpaletmacizo),
      palletsU = parseInt(i) > 14 ? Math.ceil(largo/xpaletu) : 0;

      //Rellena cantidad de pallets
      $('#tabla_materiales .macizo_' + clase).html(palletsMacizo)
      $('#tabla_materiales .u_' + clase).html(palletsU)

      //Rellena m2 por espesor en tabla
      $('#tabla_materiales .' + clase).html(valor);
      $('#tabla_materiales .' + claseU).html(largo);
    }
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
  },

  calcularLadrillo : function (){

  }
};

$( document ).ready( computos.init );