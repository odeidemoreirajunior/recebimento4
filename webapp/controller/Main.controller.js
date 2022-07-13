sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/AbsoluteCSSSize",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	Filter,
	JSONModel,
	AbsoluteCSSSize) {
        "use strict";

        return Controller.extend("linkup.recebimento4.controller.Main", {
         
        

            onInit: function () {
                var oModelSAP = this.getOwnerComponent().getModel();
                oModelSAP.setUseBatch(false);
            },           
            onBeforeOpen: function(){
            },



            onProcess: function(){
             
            },

            onCancel: function(){
              this._oDialogTipos.close();
            },

            _onReadFornecedor: async function(oCentro){
              var sLifnr = [];
             
              var oModel = this.getView().getModel("ZSTSD364_SRV");
              var sPath = "/FornecedorSet('" + oCentro + "')";
              const _promisse = new Promise((resolve, reject) => {
                setTimeout(resolve, 5000);


                oModel.read(sPath, {
            
                  success: function(oData, response) {
                     setTimeout(oData, 5000);
                     sLifnr = $.parseJSON(oData.Lifnr);
                    
                                 }.bind(this), 

                  error: function(oError) {
                     console.log(oError)      }.bind(this)
                
                } ) 


              })
               

                
         
           
             
              console.log(sLifnr)   
            
              return  sLifnr ;
            },


            onRecebimento: function(oEvent) {
              var aData = [];
              var selectedEntries = {

                fornecedor :[ {"Codigo": ""
                           
                            } ]
              };
              
             
              var oTable = this.getView().byId("smartTable");
                //Pegar as linhas selecionadas.
              var indices = oTable.getTable().getSelectedIndices();
              var count = indices.length;
              var _lifnr = [];

              
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
                  console.log("1")
                  //_lifnr = this._onReadFornecedor(selectedEntries.Centro_Origem);
                
                  
                  var sLifnr = [];
             
                  var oModel = this.getView().getModel("ZSTSD364_SRV");
                  var sPath = "/FornecedorSet('" + selectedEntries.Centro_Origem + "')";
                  
                 
                  setTimeout(
                    
                    
                    oModel.read(sPath, {
                
                      success: function(oData, response) {
                         setTimeout(oData, 5000);
                         sLifnr = $.parseJSON(oData.Lifnr);
                        
                                     }.bind(this), 
    
                      error: function(oError) {
                         console.log(oError)      }.bind(this)
                    
                    } ) 
                    
                    
                    
                    
                    
                    
                    
                    , 5000);
    
                   
                 
                






























                  console.log("2")
                  for(var i=0;i<_lifnr.length;i++){

                    selectedEntries.fornecedor.push({"Codigo": _lifnr[i].Lifnr })


                  };


                  // selectedEntries.fornecedor.push({"Codigo": "111" })
                   selectedEntries.status = "Error";
                   aData.push(selectedEntries);
             
                   selectedEntries = { fornecedor: [] };

              };
              var oModelDados = new sap.ui.model.json.JSONModel(aData);
            
              if (!this._oDialogTipos) {

                this._oDialogTipos = sap.ui.xmlfragment("linkup.recebimento4.view.fragment.detailRecebimento", this);
              };
        
              this.getView().addDependent(this._oDialogTipos);
              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogTipos);

              if (indices.length > 0){
                //this.getView().setModel(oModelDados);
                
                this._oDialogTipos.setModel(oModelDados)
                this._oDialogTipos.open();
              }
       
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
