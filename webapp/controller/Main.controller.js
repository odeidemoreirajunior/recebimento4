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

              var aData = [];


                //var oTable = this.byId("smartTable");
                var oTable = this.getView().byId("smartTable");
                var _itens = oTable.getTable().getSelectedItems();
                var _columns =  oTable.getTable().getColumns();

                var link = oEvent.getSource();
                var row = link.getParent().getParent();

                var indices = row.getSelectedIndices();
                for(var i of indices){
                   console.log(i)
                  }  






                var _indice = row.getSelectedIndex();
                //var sPath = "/" + oTable._getRowBinding().aKeys[_indice];
                var sPath =  oTable._getRowBinding().aKeys[_indice];
              
              // Criando o Model
              var oViewModelTipos = new JSONModel();
            //  this.getView.setModel(oViewModelTipos, "Recebimento");    

              if (!this._oDialogTipos) {

                this._oDialogTipos = sap.ui.xmlfragment("linkup.recebimento4.view.fragment.detailRecebimento", this);
              }
        
              this.getView().addDependent(this._oDialogTipos);
              jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogTipos);
        
              var oDataModelTipos = this.getView().getModel();

              var teste = oDataModelTipos.oData[sPath];


              var sDados =  [];
              sDados.push(oDataModelTipos.getProperty(sPath))

              var sDados = oDataModelTipos.getProperty(sPath);
              //this.getView().setModel(sDados, "filtro")
              this.getView().setModel(teste, "filtro")

              this._oDialogTipos.setModel(sDados, "filtro");
              if (_indice >= 0 ){
               // this._oDialogTipos.setModel(teste,"filtro")
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
