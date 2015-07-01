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
        xpaletmacizo: 20,
        largoDinteles :[
          { largo: 1.2, cantidad : 0},
          { largo: 1.5, cantidad : 0},
          { largo: 2.0, cantidad : 0},
          { largo: 2.5, cantidad : 0}
        ]
      } ,
      10 :  {
        val : 0,
        clase : '10',
        xpaletmacizo: 15,
        largoDinteles :[
          { largo: 1.2, cantidad : 0},
          { largo: 1.5, cantidad : 0},
          { largo: 2.0, cantidad : 0},
          { largo: 2.5, cantidad : 0}
        ]
      } ,
      12.5 : {
        val : 0,
        clase : '125',
        xpaletmacizo: 12,
        clasemacizo: 'macizo',
        largoDinteles :[
          { largo: 1.2, cantidad : 0},
          { largo: 1.5, cantidad : 0},
          { largo: 2.0, cantidad : 0},
          { largo: 2.5, cantidad : 0}
        ]
      },
      15 :  {
        val : 0,
        clase : '15',
        claseU :'15u',
        xpaletmacizo: 10,
        xpaletu: 24,
        largo: 0,
        largoDinteles :[
          { largo: 1.2, cantidad : 0},
          { largo: 1.5, cantidad : 0},
          { largo: 2.0, cantidad : 0},
          { largo: 2.5, cantidad : 0}
        ]
      },
      17.5 : {
        val : 0,
        clase : '175',
        claseU :'175u',
        xpaletmacizo: 9,
        xpaletu: 20,
        largo: 0,
        largoDinteles :[
          { largo: 1.2, cantidad : 0},
          { largo: 1.5, cantidad : 0},
          { largo: 2.0, cantidad : 0},
          { largo: 2.5, cantidad : 0}
        ]
      } ,
      20 : {
        val : 0,
        clase : '20',
        claseU :'20u',
        xpaletmacizo: 7,
        xpaletu: 20,
        largo: 0,
        largoDinteles :[
          { largo: 1.2, cantidad: 0},
          { largo: 1.5, cantidad: 0},
          { largo: 2.0, cantidad: 0},
          { largo: 2.5, cantidad: 0}
        ]
      }
  },

  restartDinteles : function (dinteles){
    dinteles.forEach(function(dintel){
       dintel.cantidad = 0;
    })
  },

  restartEspesores : function () {
    for(var i in this.espesores){
      this.espesores[i].val = 0;
      this.espesores[i].largo = 0;
      this.restartDinteles(this.espesores[i].largoDinteles);
    }
  },

  sumarDintel : function (ancho, espesorMuro){
    var largoDinteles = this.espesores[espesorMuro]['largoDinteles'];

    largoDinteles.some(function(dintel){
      if(ancho <= dintel.largo ){
        dintel.cantidad ++;
        return true;
      }
    })

  },

  calcularSuperficieNeta : function (scope, aberturas,areaMuro,espesorMuro){
    for (var i = 1; i < aberturas; i++) {
        var ancho = parseFloat($(scope).find('.ancho' + i).val()),
          alto = parseFloat($(scope).find('.alto' + i).val()),
          ancho = Math.max(ancho, alto);

        //Suma Dintel y Resta al area total las aberturas
        this.sumarDintel(ancho,espesorMuro);
        areaMuro -= this.calcularAbertura (scope,i);
    };
    return areaMuro;
  },

  calcular: function (){

    this.restartEspesores();

    $( ".tabla-computos tbody tr" ).each(function(){
      var areaMuro = $(this).find('.largoMuro').val() * $(this).find('.altoMuro').val(),
        largoMuro = parseInt($(this).find('.largoMuro').val()),
        aberturas = 5,
        noPortante = $(this).find('.tipoMuro').val() === 'NP' ? true : false,
        espesorMuro = $(this).find('.espesorMuro').val(),
        espesores = computos.espesores,
        areaMuro = computos.calcularSuperficieNeta(this,aberturas,areaMuro,espesorMuro);

      computos.espesores[espesorMuro].val += areaMuro;
      if(espesorMuro >=15 && !noPortante){
        computos.espesores[espesorMuro].largo += largoMuro;
      }

      //Asigna Suma de Superficie Neta a resultado
      $(this).find('.resultado input').val(areaMuro);
    });

    this.llenarTablaMateriales();
  },

  llenarDinteles : function (espesor,clase){
    var rows = $('#tabla_materiales #dintel' + clase).children();

    $(rows[1]).html(espesor.largoDinteles[0].cantidad);
    $(rows[2]).html(espesor.largoDinteles[1].cantidad);
    $(rows[3]).html(espesor.largoDinteles[2].cantidad);
    $(rows[4]).html(espesor.largoDinteles[3].cantidad);
  },

  llenarTablaMateriales : function (){
    for(var i in this.espesores){
    //Declaro Variables
      var espesor = this.espesores[i],
        clase = espesor.clase,
        claseU = espesor.claseU,
        valor = espesor.val,
        largo = Math.ceil(espesor.largo),
        xpaletmacizo = espesor.xpaletmacizo,
        xpaletu = espesor.xpaletu,
        palletsMacizo = Math.ceil(valor/xpaletmacizo),
        palletsU = parseInt(i) > 14 ? Math.ceil(largo/xpaletu) : 0;

      //Rellena cantidad de pallets
      $('#tabla_materiales .macizo_' + clase).html(palletsMacizo)
      $('#tabla_materiales .u_' + clase).html(palletsU)

      //Rellena m2 por espesor en tabla
      $('#tabla_materiales .' + clase).html(valor);
      $('#tabla_materiales .' + claseU).html(largo);

      this.llenarDinteles(espesor,clase);
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

};

$( document ).ready( computos.init );