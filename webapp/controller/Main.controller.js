sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",	
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
	"sap/ui/core/AbsoluteCSSSize",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,coreLibrary, 
	  	JSONModel,	Filter,FilterOperator, MessagePopover, MessageItem, AbsoluteCSSSize) {
        "use strict";
        var ValueState = coreLibrary.ValueState;
        var aFilters = [];
        var aCentros = [];
        var aData = [];
        var aMensagem = [];

        var typeT = "Success"
        var oReturn = {
          type : typeT,
          title: "",
          description: "",
          subtitle: "",
          counter: 1,
          };

        var oLog = [{}];
         
        var oMessagePopover;
      
        return Controller.extend("linkup.recebimento4.controller.Main", {
         
        

            onInit: function () {
              var oModelSAP = this.getOwnerComponent().getModel();
              oModelSAP.setUseBatch(false);
            },           
            onValueChangeCombo: function(oEvent) {
              var oValidatedComboBox = oEvent.getSource(),
              sSelectedKey = oValidatedComboBox.getSelectedKey(),
              sValue = oValidatedComboBox.getValue();
      
            if (!sSelectedKey && sValue) {
              oValidatedComboBox.setValueState(ValueState.Error);
              oValidatedComboBox.setValueStateText("Entrar com Fornecedor Válido!");
            } else {
              oValidatedComboBox.setValueState(ValueState.None);
            }

            },

            _onLog : function(oEvent) {
              //var oTable = sap.ui.getCore().byId("idTableItem");
            
              // Seleicionar a linha do click da tabela.
          //    var _lote  = oEvent.getSource().getBindingContext().getProperty("Lote")
           //   var oVC = this.byId("oVerticalContent");
             
              var oModel = new JSONModel();
              oModel.setData(aMensagem);
              this._oDialogDetalhes.setModel(oModel,"Messages");
              
              var oMessageTemplate = new MessageItem({
                type: '{Type}',
                title: '{Lote}',
              //  activeTitle: "{active}",
                description: '{Mensagem}',
            //    subtitle: '{subtitle}',
              //  counter: '{counter}'
                
              });  

              oMessagePopover = new MessagePopover({
                items: {
                  path: '/Messages',
                  template: oMessageTemplate
                },
                activeTitlePress: function () {
                  MessageToast.show('Active title is pressed');
                }
              });

              oMessagePopover.toggle(oEvent.getSource());


            },


            _onProcessarReceb:  function(sFornecedor, sLote, _modelDados ){
              return new Promise(function(resolve, reject) {	
                var aLotes = [];
                var oLote = {};
                var sPath = "/SOInputSet"
                oReturn = [];
              
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
                _dados.ILifnr = sFornecedor;
                _dados.ICharg = sLote;
                oLote.ILifnr = sFornecedor;
                oLote.Low = sLote;
                aLotes.push(oLote)
              
                _dados.TChargSet.results = aLotes;
                _modelDados.create(sPath, _dados, {
                  success: function(data,response){
                      var _log = {};
                      for (var z = 0; z < data.TReturnSet.results.length; z++){
                        switch(data.TReturnSet.results[z].Type) {
                          case "E":
                            var _erro = "Error";
                            break;
                            case "S":
                              _erro = "Success";
                              break;
                        }

                        var _log = {"Lote": data.TReturnSet.results[z].Charg , 
                                    "Mensagem" : data.TReturnSet.results[z].Description,
                                    "Type" : _erro }
                        aMensagem.push(_log);
                        aData.forEach(
                          function(oLine, index) {
                            
                            if (oLine.Lote == data.TReturnSet.results[z].Charg)
                              aData[index].Status = _erro;

                          }
                        )

                      
                      };
                          
                      resolve(data);	
                     
                  }
                  
                })
                
              }.bind(this));
            },
          
            onProcess: async function(){
             // sap.ui.core.BusyIndicator.show();

              //Bloquear a view e mostrar a tela processando  
              var oGlobalBusyDialog = new sap.m.BusyDialog();

              oGlobalBusyDialog.open();





              oLog = [{}];
              var _table = sap.ui.getCore().byId("idTableItem");
              var oModel = _table.getModel();
              var oModelDados = this.getView().getModel("ZSTSD364_SRV");
              var oData = oModel.oData;
   
              for (var i = 0;i < oData.length; i++ ){
                await this._onProcessarReceb(oData[i].Fornecedor, oData[i].Lote, oModelDados).then(result => {
               
                    console.log("Logica aqui")
        
                },this).then(result => {
                          
                    console.log("Logica aqui1")
                  
                },this).catch(reason => {
              });
                
              }
              //sap.ui.core.BusyIndicator.hide()
              oGlobalBusyDialog.close();
           
              sap.ui.getCore().byId("idTableItem").getModel().refresh(true) ;
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
                          aData[b].fornecedor.push({"Codigo": sCodigo.Codigo  });
                          sCodigo.Codigo = "";
                         
                          
                        };
                    } 
                    //Verifica se existe somente um registro para o fornecedor. Caso exista, ja seta um default.
                    for ( var c = 0; aData.length; c++){
                      if ( aData[c].fornecedor.length == 1){
                        aData[c].KeyValue = aData[c].fornecedor[0].Codigo
                      }
                    }
                  }.bind(this), 

                  error: function(oError) {
                    console.log('Errrouuuuu')
                    reject(oError);
                        }.bind(this)
                } ) 
              });
            },
        
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
                selectedEntries.Status = "None";
                selectedEntries.KeyValue = "";
                aData.push(selectedEntries);
                selectedEntries = { fornecedor: [] };
               
              }
              
              this._onListaFornecedor().then(result => {
                var oModelDados = new sap.ui.model.json.JSONModel(aData);
                
                if (!this._oDialogDetalhes) {

                  this._oDialogDetalhes = sap.ui.xmlfragment("linkup.recebimento4.view.fragment.detailRecebimento", this);
                };

                this.getView().addDependent(this._oDialogDetalhes);
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogDetalhes);

                if (indices.length > 0){
                 // this.getView().setModel(oModelDados, "lista");
                  
                  this._oDialogDetalhes.setModel(oModelDados)
                  this._oDialogDetalhes.open();  
                }  //fim do se
              }).then(result => {
               

              }).catch(reason => {
                      
              });

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
