var computos = {
  init : function(){
    $("#calcular" ).click(function() {
      computos.calcular();
    });
    $("#agregar" ).click(function() {
      computos.agregarMuro();
    });

  },
  filasRevoques: [
    {
      tabla:'base_flexible',
      fila : 'base_flexible'
    },
    {
      tabla : 'cementicio',
      fila : 'imprimacion'
    },
    {
      tabla : 'cementicio',
      fila : 'cementicio'
    },
    {
      tabla : 'fibrado',
      fila : 'fibrado'
    },
    {
      tabla : 'fino_a_la_cal',
      fila : 'imprimacion'
    },
    {
      tabla : 'fino_a_la_cal',
      fila : 'fino_a_la_cal'
    },
    {
      tabla : 'enlucido_interior',
      fila : 'enlucido'
    }
  ],
  netaTotal : 0,
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
    jQuery.each(dinteles, function(index, dintel){
       dintel.cantidad = 0;
    });
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
    var self = this;
    this.restartEspesores();
    this.netaTotal = 0;

    $( ".tabla-computos tbody tr" ).each(function(){
      var areaMuro = $(this).find('.largoMuro').val() * $(this).find('.altoMuro').val(),
        largoMuro = parseInt($(this).find('.largoMuro').val()),
        aberturas = 5,
        noPortante = $(this).find('.tipoMuro').val() === 'NP' ? true : false,
        espesorMuro = $(this).find('.espesorMuro').val(),
        espesores = computos.espesores,
        areaMuro = computos.calcularSuperficieNeta(this,aberturas,areaMuro,espesorMuro);

      self.espesores[espesorMuro].val += areaMuro;
      if(espesorMuro >=15 && !noPortante){
        self.espesores[espesorMuro].largo += largoMuro;
      }
      self.netaTotal += areaMuro;

      //Asigna Suma de Superficie Neta a resultado
      $(this).find('.resultado input').val(areaMuro);
    });

    this.llenarTablaMateriales();
    this.llenarTablasRevoques();
  },

  llenarTablasRevoques : function (){
    var self = this;

    jQuery.each(this.filasRevoques, function(index, filaRevoque){
       self.llenarTablaRevoque(filaRevoque.tabla,filaRevoque.fila);
    });

  },

  llenarTablaRevoque : function (id_tabla,id_fila){
    var fila = $('table#'+id_tabla ).find('#' + id_fila),
      rendimiento = fila.find('#rendimiento').html(),
      kg = fila.find('#kg').html(),
      m2 = this.netaTotal,
      total = m2*rendimiento/kg,
      total = total.toFixed(2),
      redondeo = Math.ceil(total);

      fila.find('#m2').html(m2);
      fila.find('#total').html(total);
      fila.find('#redondeo').html(redondeo);

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
    //fuera del for calcula adhesivo
    this.llenarAdhesivo();
  },

  llenarAdhesivo: function (){
    var suma = 0,
      materiales = $('#tabla_materiales'),
      suma = suma + parseFloat(materiales.find('.macizo_75').html()) * 47,
      suma = suma + parseFloat(materiales.find('.macizo_10').html()) * 47.25,
      suma = suma + parseFloat(materiales.find('.macizo_125').html()) * 46.8,
      suma = suma + parseFloat(materiales.find('.macizo_15').html()) * 47,
      suma = suma + parseFloat(materiales.find('.macizo_175').html()) * 49.35,
      suma = suma + parseFloat(materiales.find('.macizo_20').html()) * 43.5;

    suma = suma + (parseFloat(materiales.find('.u_15').html()) + parseFloat(materiales.find('.u_175').html())
    + parseFloat(materiales.find('.u_20').html()))*30;
    unidades = Math.ceil(suma/30);

    materiales.find('#adhesivo').html(suma);
    materiales.find('#adhesivoUn').html(unidades);

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