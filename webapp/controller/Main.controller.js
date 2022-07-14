sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",	
	"sap/ui/core/AbsoluteCSSSize",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,coreLibrary,
	  	JSONModel,	Filter,FilterOperator, AbsoluteCSSSize) {
        "use strict";

        var aFilters = [];
        var aCentros = [];
        var aData = [];
        return Controller.extend("linkup.recebimento4.controller.Main", {
         
        

            onInit: function () {
              var oModelSAP = this.getOwnerComponent().getModel();
              oModelSAP.setUseBatch(false);
            },           
           
         /*   _onHandleChange: function (oEvent) {
              var ValueState = coreLibrary.ValueState;
              var oValidatedComboBox = oEvent.getSource(),
              
                sSelectedKey = oValidatedComboBox.getSelectedKey(),
                sValue = oValidatedComboBox.getValue();
                oValidatedComboBox.setValueState(ValueState.None);
        
              if (!sSelectedKey && sValue) {
                oValidatedComboBox.setValueState(ValueState.Error);
                oValidatedComboBox.setValueStateText("Entrar com valor válido!");
              } else {
                oValidatedComboBox.setValueState(ValueState.None);
              }
            },*/

            onLog : function(oEvent) {
              MessageToast.show("Log " + this.getView().getModel().getProperty("Lote", oEvent.getSource().getBindingContext()));
            },

            onProcess: function(){
              var _table = sap.ui.getCore().byId("idTableItem");
              var oModel = _table.getModel();
              var oModelDados = this.getView().getModel("ZSTSD364_SRV");


              var oData = oModel.oData;
              var sPath = "/SOInputSet"

              var _dados =	{
                "ILifnr" : "",
                "ICharg" : '',
                "TChargSet" : {
                  "results" : ""
                      },
                "TReturnSet":[{
                        "Type":'',
                        "Id":'',
                        "Message":'',
                        "Charg" : '',
                        "Description": '',
                      }]		
              }										
              
              var aLotes = [];
              var oLote = {};
              oData.forEach(
                function(retorno){

                  _dados.ILifnr = retorno.Fornecedor;
                  _dados.ICharg = retorno.Lote;
                  oLote.ILifnr = retorno.Fornecedor;
                  oLote.Low = retorno.Lote;
                  aLotes.push(oLote)

                  _dados.TChargSet.results = aLotes;

                  oModelDados.create(sPath, _dados,  {
                    success: function(data,response){

                      var that = this
						          var aReturn = []
						          var typeT = "Success"

                      data.TReturnSet.results.forEach(
                        function(retorno){ 

                          switch (retorno.Type) {
                            case 'E':
                              typeT = "Error";
                              break;
                            case 'S':
                              typeT = "Success";
                              break;
                            case 'W':
                              typeT = "Warning";
                              break;
                            case '':
                              typeT = "Success";
                              break;
                            }
                            
                          var oReturn = {
                          type : typeT,
                          title: retorno.Charg,
                          description: retorno.Description,
                          subtitle: retorno.Message,
                          counter: 1,
                          };
                          aReturn.push(oReturn)
                          }
                      )
                    }
                  })
                }
              )
            },

            onCancel: function(){
              this._oDialogDetalhes.close();
            },

            _createFilter: function(sValue) {
              
              aFilters.push(new Filter('Werks', FilterOperator.EQ, sValue));
            },

            _onListaFornecedor: function(){
              var sLifnr = [];
              var oModel = this.getView().getModel("ZSTSD364_SRV");
              var sPath = "/ListaFornecedorSet";
              var sCodigo =  {"Codigo": ""
            };

              return new Promise(function(resolve, reject) {	
                oModel.read(sPath, {
                  filters: aFilters,
                  success: function(oData, response) {
                    aCentros = oData;
                    resolve(sLifnr);
                    ;
                   for (var a = 0; a < oData.results.length;a++ ){

                      for (var b = 0; b < aData.length;b++)
                      
                        if ( oData.results[a].Werks == aData[b].Centro_Origem){ 
                          sCodigo.Codigo = oData.results[a].Lifnr;
                          aData[b].fornecedor.push({"Codigo": sCodigo.Codigo });
                          sCodigo.Codigo = "";
                        };
                    }  
                  }.bind(this), 

                  error: function(oError) {
                    console.log('Errrouuuuu')
                    reject(oError);
                        }.bind(this)
                } ) 
              });
            },


          /*  _onReadFornecedor:  function(oCentro){
              var sLifnr = [];
             
              var oModel = this.getView().getModel("ZSTSD364_SRV");
              var sPath = "/FornecedorSet('" + oCentro + "')";
              return new Promise(function(resolve, reject) {	

                oModel.read(sPath, {
            
                  success: function(oData, response) {
                    sLifnr = $.parseJSON(oData.Lifnr);
                    resolve(sLifnr);		
                  }.bind(this), 

                  error: function(oError) {
                      reject(oError);
                         }.bind(this)
                } ) 
              });
              
            },*/

            onRecebimento: function(oEvent) {
              aData = [];
              aCentros = [];
              aFilters = [];
             
              var selectedEntries = {
                fornecedor :[  ]
              };
              
              // Instanciar a tabela
              var oTable = this.getView().byId("smartTable");
              //Pegar as linhas selecionadas.
              var indices = oTable.getTable().getSelectedIndices();
              // Quantidade de linhas selecionadas.
              var count = indices.length;
              //---------------------------------------------------------------------------------------
              for(var a=0;a<count;a++){
                var no1 = indices[a];

                selectedEntries.Nfe = oTable.getTable().getRows()[no1].getCells()[0].getText();
                selectedEntries.Lote = oTable.getTable().getRows()[no1].getCells()[1].getText();
                selectedEntries.Peso = oTable.getTable().getRows()[no1].getCells()[2].getText();
                selectedEntries.Centro_Origem = oTable.getTable().getRows()[no1].getCells()[3].getText();
                this._createFilter(selectedEntries.Centro_Origem);
                selectedEntries.Centro_Destino = oTable.getTable().getRows()[no1].getCells()[4].getText();
                selectedEntries.OV = oTable.getTable().getRows()[no1].getCells()[5].getText();
                selectedEntries.Item_ov = oTable.getTable().getRows()[no1].getCells()[6].getText();
                selectedEntries.dataexp = oTable.getTable().getRows()[no1].getCells()[7].getText();
                selectedEntries.Material = oTable.getTable().getRows()[no1].getCells()[8].getText();
                selectedEntries.Status = "Não iniciado.."
                aData.push(selectedEntries);
                selectedEntries = { fornecedor: [] };

               
              }
              //teste
              this._onListaFornecedor().then(result => {
                var oModelDados = new sap.ui.model.json.JSONModel(aData);
                
                if (!this._oDialogDetalhes) {

                  this._oDialogDetalhes = sap.ui.xmlfragment("linkup.recebimento4.view.fragment.detailRecebimento", this);
                };

                this.getView().addDependent(this._oDialogDetalhes);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogDetalhes);

                if (indices.length > 0){
                  this.getView().setModel(oModelDados, "lista");
                  
                  this._oDialogDetalhes.setModel(oModelDados)
                  this._oDialogDetalhes.open();  
                }  //fim do se
              }).then(result => {
                console.log("teste")

              }).catch(reason => {
                      
              });

             


          
              //----------------------------------------------------------------------------------------
              
             /* var j = 0;
              for(var i=0;i<count;i++){
                  var no = indices[i];

                  selectedEntries.Nfe = oTable.getTable().getRows()[no].getCells()[0].getText();
                  selectedEntries.Lote = oTable.getTable().getRows()[no].getCells()[1].getText();
                  selectedEntries.Peso = oTable.getTable().getRows()[no].getCells()[2].getText();
                  selectedEntries.Centro_Origem = oTable.getTable().getRows()[no].getCells()[3].getText();
                  selectedEntries.Centro_Destino = oTable.getTable().getRows()[no].getCells()[4].getText();
                  selectedEntries.OV = oTable.getTable().getRows()[no].getCells()[5].getText();
                  selectedEntries.Item_ov = oTable.getTable().getRows()[no].getCells()[6].getText();
                  selectedEntries.dataexp = oTable.getTable().getRows()[no].getCells()[7].getText();
                  selectedEntries.Material = oTable.getTable().getRows()[no].getCells()[8].getText();

                  //Buscar fornecedores de acordo com o centro de origem para cada registro.
                  this._onReadFornecedor(selectedEntries.Centro_Origem).then(result => {
                     result.Lifnr;

                    for(j=0;j<result.length;j++){
                     
                        selectedEntries.fornecedor.push({"Codigo": result[j].LIFNR })
                      
                    };
  
                     selectedEntries.status = "Error";
                     aData.push(selectedEntries);
                     selectedEntries = { fornecedor: [] };

                    }).then(result => {
                      if (i = indices.length ){
                        var oModelDados = new sap.ui.model.json.JSONModel(aData);
                
                        if (!this._oDialogTipos) {

                          this._oDialogTipos = sap.ui.xmlfragment("linkup.recebimento4.view.fragment.detailRecebimento", this);
                        };

                        this.getView().addDependent(this._oDialogTipos);
                        jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogTipos);

                        if (indices.length > 0){
                          this.getView().setModel(oModelDados, "lista");
                          
                          this._oDialogTipos.setModel(oModelDados)
                          this._oDialogTipos.open();  
                        }  //fim do se
                      }

                   }).catch(reason => {
                      
                   });

              };*/
            },

            onDataReceived: function() {
                var oTable = this.byId("smartTable");
                var i = 0;
                oTable.getTable().getColumns().forEach(function(oLine) {
                    var scolId = oLine.getId();
                    var iPos = scolId.indexOf('Table');
                    iPos = iPos + 6 - scolId.length;
                    var sIdsubstr = scolId.slice(iPos);
                    switch(sIdsubstr) {
                        case "nfenum":
                          oLine.setWidth("110px");
                          break;
                        case "Lote":
                          oLine.setWidth("110px");
                          break;
                        case "clabs":
                          oLine.setWidth("120px");
                          break;
                        case "Centro_Origem":
                          oLine.setWidth("120px");
                          break;
                        case "Centro_Destino":
                          oLine.setWidth("120px");
                          break;
                        case "ov":
                          oLine.setWidth("90px");
                          break;
                        case "item_ov":
                          oLine.setWidth("90px");
                          break;
                        case "data_expedicao":
                            oLine.setWidth("120px");
                            break;
                     





                           case "remessa":
                          oLine.setWidth("120px");
                          break;
                        case "Ntransporte":
                          oLine.setWidth("120px");
                          break;
                       
                        case "docnum":
                          oLine.setWidth("100px");
                          break;
                        case "dtfaturamento":
                          oLine.setWidth("130px");
                          break;
                        case "matnr":
                          oLine.setWidth("120px");
                          break;
                        case "emissor":
                          oLine.setWidth("120px");
                          break;
                        case "kunnr_uf":
                          oLine.setWidth("120px");
                          break;
                        case "Transportadora":
                          oLine.setWidth("120px");
                          
                          break;
                        case "Chave_acesso":
                          oLine.setWidth("380px");
                          break;
                       
                      };
                    i++;
                });
            },

            

        });
    });
