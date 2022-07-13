sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/ui/model/json/JSONModel",
	"sap/ui/core/AbsoluteCSSSize",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,coreLibrary,
	  	JSONModel,	AbsoluteCSSSize) {
        "use strict";

        return Controller.extend("linkup.recebimento4.controller.Main", {
         
        

            onInit: function () {
              var oModelSAP = this.getOwnerComponent().getModel();
              oModelSAP.setUseBatch(false);
            },           
           
            _onHandleChange: function (oEvent) {
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
            },



            onProcess: function(){
             
            },

            onCancel: function(){
              this._oDialogTipos.close();
            },

            _onReadFornecedor:  function(oCentro){
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
              
            },

            onRecebimento: function(oEvent) {
              var aData = [];
              var _lifnr = [];
              var _centros = [];
              var selectedEntries = {
                fornecedor :[ {"Codigo": ""
                            } ]
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
                selectedEntries.Centro_Destino = oTable.getTable().getRows()[no1].getCells()[4].getText();
                selectedEntries.OV = oTable.getTable().getRows()[no1].getCells()[5].getText();
                selectedEntries.Item_ov = oTable.getTable().getRows()[no1].getCells()[6].getText();
                selectedEntries.dataexp = oTable.getTable().getRows()[no1].getCells()[7].getText();
                selectedEntries.Material = oTable.getTable().getRows()[no1].getCells()[8].getText();

                aData.push(selectedEntries);
                selectedEntries = { fornecedor: [] };
              }

          
              //----------------------------------------------------------------------------------------
              
              var j = 0;
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

              };
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
