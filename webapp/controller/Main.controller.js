sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
        "use strict";

        return Controller.extend("linkup.recebimento4.controller.Main", {
            onInit: function () {

                var oModelSAP = this.getOwnerComponent().getModel();
                oModelSAP.setUseBatch(false);

            }, 
          
           
            onBeforeOpen: function(){

            },

            onSave: function(){

            },

            onCancel: function(){
              this._oDialogTipos.close();
            },

            onRecebimento: function(oEvent) {

              var aData = [
                

              ];
              

              
    

            

              var selectedEntries = {};
             
              var oTable = this.getView().byId("smartTable");
                //Pegar as linhas selecionadas.
              var indices = oTable.getTable().getSelectedIndices();
              var count = indices.length;
               
                for(var i=0;i<count;i++){
                selectedEntries.Nfe = oTable.getTable().getRows()[i].getCells()[0].getText();
                selectedEntries.Lote = oTable.getTable().getRows()[i].getCells()[1].getText();
                selectedEntries.Peso = oTable.getTable().getRows()[i].getCells()[2].getText();
                selectedEntries.Centro_Origem = oTable.getTable().getRows()[i].getCells()[3].getText();
                selectedEntries.Centro_Destino = oTable.getTable().getRows()[i].getCells()[4].getText();
                selectedEntries.OV = oTable.getTable().getRows()[i].getCells()[5].getText();
                selectedEntries.Item_ov = oTable.getTable().getRows()[i].getCells()[6].getText();
                selectedEntries.dataexp = oTable.getTable().getRows()[i].getCells()[7].getText();
                selectedEntries.Material = oTable.getTable().getRows()[i].getCells()[8].getText();
                selectedEntries.Fornecedor = "";
                selectedEntries.status = "";
                
                aData.push(selectedEntries);
                }  
                var oModelDados = new sap.ui.model.json.JSONModel(aData);
               

                
              if (!this._oDialogTipos) {

                this._oDialogTipos = sap.ui.xmlfragment("linkup.recebimento4.view.fragment.detailRecebimento", this);
              }
        
              this.getView().addDependent(this._oDialogTipos);
              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogTipos);

              if (indices.length > 0){
                this.getView().setModel(oModelDados,"lista");
                this._oDialogTipos.setModel(oModelDados,"lista")
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
