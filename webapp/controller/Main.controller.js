sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/library',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",	
    'sap/m/MessageView',
    'sap/m/MessageItem',
    'sap/m/Popover',
    'sap/m/Button',
    'sap/m/Bar',
    "sap/m/MessageBox",
    'sap/m/Title',
    'sap/ui/core/IconPool',
    "sap/ui/core/AbsoluteCSSSize",
    "sap/ui/core/util/File",
    "sap/m/PDFViewer",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,coreLibrary, 
	  	JSONModel,	Filter,FilterOperator,  MessageView, MessageItem, Popover, Button, Bar, MessageBox, 
      Title, IconPool, AbsoluteCSSSize,File, PDFViewer) {
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
              var _logErro = [];
               // Seleicionar a linha do click da tabela.
               var _lote  = oEvent.getSource().getBindingContext().getProperty("Lote");
              if (aMensagem.length == 0) {
                return;

              }
               for (var a = 0; a < aMensagem.length; a++){
                 if (_lote == aMensagem[a].title){
                   _logErro.push(aMensagem[a]);
                   
                 };
               }
             
              var oModel = new JSONModel();
              oModel.setData(_logErro);

              var oMessageTemplate = new MessageItem({
                type: '{type}',
                title: '{title}',
                description: '{description}',
                subtitle: '{subtitle}',
                counter: '{counter}',
                markupDescription: '{markupDescription}'
                
              });

              this.oMessageView = new MessageView({
                showDetailsPageHeader: false,
                itemSelect: function () {
                  oBackButton.setVisible(true);
                },
                items: {
                  path: "/",
                  template: oMessageTemplate
                }
              });

              var that = this;

              var oBackButton = new Button({
                icon: IconPool.getIconURI("nav-back"),
                visible: false,
                press: function () {
                  that.oMessageView.navigateBack();
                  that._oPopover.focus();
                  this.setVisible(false);
                }
              });
              this.oMessageView.setModel(oModel);
              var oCloseButton =  new Button({
                text: "Fechar",
                press: function () {
                  that._oPopover.close();
                }
              }).addStyleClass("sapUiTinyMarginEnd"),
              oPopoverFooter = new Bar({
                contentRight: oCloseButton
              }),
              oPopoverBar = new Bar({
                contentLeft: [oBackButton],
                contentMiddle: [
                  new Title({text: "Mensagens"})
                ]
              });


              this._oPopover = new Popover({
                customHeader: oPopoverBar,
                contentWidth: "340px",
                contentHeight: "340px",
                verticalScrolling: false,
                modal: true,
                content: [this.oMessageView],
                footer: oPopoverFooter
              });
              this.oMessageView.navigateBack();
              this._oPopover.openBy(oEvent.getSource());

            },


            _onProcessarReceb:  function(sFornecedor, sLote, _modelDados ){
              return new Promise(function(resolve, reject) {	
                var aLotes = [];
                var oLote = {};
                var _contador = 0;
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
                            _contador ++; 
                            break;
                          case "S":
                            _erro = "Success";
                              break;
                        }

                        var _log = { "type" : _erro,
                                     "title": data.TReturnSet.results[z].Charg , 
                                     "description" : data.TReturnSet.results[z].Description,
                                     "subtitle" : data.TReturnSet.results[z].Description
                                     //"counter": _contador
                                    }
                        aMensagem.push(_log);
                        aData.forEach(
                          function(oLine, index) {
                            
                            if (oLine.Lote == data.TReturnSet.results[z].Charg)
                              aData[index].Status = _erro;

                          }
                        )

                      
                      };
                          
                      resolve(data);	
                     
                  }.bind(this),
                  error: function(oError) {
                    console.log('Errrouuuuu')
                    reject(oError);
                        }.bind(this)
                  
                })
                
              }.bind(this));
            },
          
            onProcess: async function(oEvent){
             
           
              //Bloquear a view e mostrar a tela processando  
              var oGlobalBusyDialog = new sap.m.BusyDialog();
              oGlobalBusyDialog.open();
              aMensagem = [];
            
              
              var _table = sap.ui.getCore().byId("idTableItem");
              var oModel = _table.getModel();
              var oModelDados = this.getView().getModel("ZSTSD364_SRV");
              var oData = oModel.oData;
   
         
         

              for (var i = 0;i < oData.length; i++ ){
                //if (oData[i].KeyValue == ""){
                //  break;
                //};
                //Validar se existe algum na lista ja processado com sucesso
                if (oData[i].Status == "Success"){
                 break;
                }

                  await this._onProcessarReceb(oData[i].KeyValue, oData[i].Lote, oModelDados).then(result => {
                
                      console.log("Logica aqui")
          
                  },this).then(result => {
                            
                      console.log("Logica aqui1")
                    
                  },this).catch(reason => {
                  });
                
                
              }

              oGlobalBusyDialog.close();
           
              sap.ui.getCore().byId("idTableItem").getModel().refresh(true) ;
            },

            onCancel: function(){
              this._oDialogDetalhes.close();
              this.getView().getModel().refresh(true);
           
              
            },

            _createFilter: function(sValue) {
              
              aFilters.push(new Filter('Werks', FilterOperator.EQ, sValue));
            },

            _onListaFornecedor: function(){
              var sLifnr = [];
              var oModel = this.getView().getModel("ZSTSD364_SRV");
              var sPath = "/ListaFornecedorSet";
              var sCodigo =  {"Codigo": "",
                              "Name1": ""
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
                      
                        //if ( oData.results[a].Werks == aData[b].Centro_Origem){ 
                        if ( oData.results[a].Werks == aData[b].Centro_Destino){ 
                          sCodigo.Codigo = oData.results[a].Lifnr;
                         
                          aData[b].fornecedor.push({"Codigo": sCodigo.Codigo , "Name1": oData.results[a].Name1 });
                          sCodigo.Codigo = "";
                          sCodigo.Name1 = "";
                         
                          
                        };
                    } 
                    //Verifica se existe somente um registro para o fornecedor. Caso exista, ja seta um default.
                    for ( var c = 0; c < aData.length; c++){
                      if ( aData[c].fornecedor.length == 1){
                        aData[c].KeyValue = aData[c].fornecedor[0].Codigo;
                        aData[c].Name1 = aData[c].fornecedor[0].Name1;
                     

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
             
              var oGlobalBusyDialog = new sap.m.BusyDialog();
              aMensagem = [];
              oGlobalBusyDialog.open();
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
              if (count ==0){
                oGlobalBusyDialog.close();
               return;
              }
              if (count > 10){
                MessageBox.information("Quantidade selecionada não pode ser maior que 10 itens!");
             
                oGlobalBusyDialog.close();
                return;
              }
              for(var a=0;a<count;a++){                
                var no1 = indices[a];
                selectedEntries.Nfe = oTable.getTable().getContextByIndex(no1).getProperty("nfenum")
                selectedEntries.Lote = oTable.getTable().getContextByIndex(no1).getProperty("Lote");
                selectedEntries.Peso = oTable.getTable().getContextByIndex(no1).getProperty("clabs");
                selectedEntries.Centro_Origem = oTable.getTable().getContextByIndex(no1).getProperty("Centro_Origem");
                //this._createFilter(selectedEntries.Centro_Origem);
                selectedEntries.Centro_Destino = oTable.getTable().getContextByIndex(no1).getProperty("Centro_Destino");
                this._createFilter(selectedEntries.Centro_Destino);  
                selectedEntries.OV = oTable.getTable().getContextByIndex(no1).getProperty("ov");
                selectedEntries.Item_ov = oTable.getTable().getContextByIndex(no1).getProperty("item_ov")
                selectedEntries.dataexp = oTable.getTable().getContextByIndex(no1).getProperty("data_expedicao")
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
                  oGlobalBusyDialog.close();
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

            onDowXML: function (oEvent) {

              //Bloquear a view e mostrar a tela processando  
              var oGlobalBusyDialog = new sap.m.BusyDialog();
              oGlobalBusyDialog.open();

              var bCompact = !!this.getView().$().closest(".sapUiSizeCompact")
                .length;
              var oTable = this.byId("smartTable").getTable();
              var oRows = oTable.getRows();
              var oSelIndices = oTable.getSelectedIndices();
              var that = this;
    
              if (oSelIndices.length == 0) {
                MessageBox.warning(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("msgBoxNoItem"),
                  {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                  }
                );
                return;
              }
    
              //nf is ok
              var sNfs = "";
              for (var i of oSelIndices) {
                if(!oTable.getContextByIndex(i).getProperty("nfenum")){
                  if(sNfs==""){
                    sNfs = oTable.getContextByIndex(i).getProperty("docnum");
                  }else{
                    sNfs = sNfs + ", " + oTable.getContextByIndex(i).getProperty("docnum");
                  }
                }
              }
    
              if(sNfs !== ""){
                MessageBox.error(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("msgNfNaoAutorizada2", [sNfs])
                );
              }
    
              var oModel = that.getView().getModel("ZSTSD364_SRV");
              var oLineItemArray = [];
    
              for (var i of oSelIndices) {
                var oObject = oTable.getContextByIndex(i);
                console.log(
                  oObject.getProperty("docnum") +
                    " " +
                    oObject.getProperty("Itmnum")
                );
                oLineItemArray.push({
                  Docnum: oObject.getProperty("docnum"),
                  NfeNum: oObject.getProperty("nfenum"),

               
                });
              }
    
              //Sort Array
              oLineItemArray.sort(function (a, b) {
                return a["Docnum"] - b["Docnum"] || a["Itmnum"] - b["Itmnum"];
              });
    
              //Set deferred groups and create Function Imports
              oModel.setDeferredGroups(["batchFunctionImport"]);
              for (i = 0; i < oLineItemArray.length; i++) {
                if (oLineItemArray[i].Docnum == ""){
                  oGlobalBusyDialog.close();
                  break;
                }

                oModel.callFunction("/DownloadXML", {
                  method: "GET",
                  groupId: "batchFunctionImport",
                  changeSetId: "batch" + i,
                  refreshAfterChange: "true",
                  urlParameters: {
                    Docnum: oLineItemArray[i].Docnum,
                    Itmnum: oLineItemArray[i].Itmnum,
                    Nfenum: oLineItemArray[i].NfeNum,
                  },
                });
              }
    
              //Submitting the function import batch call
              oModel.submitChanges({
                groupId: "batchFunctionImport",
                success: function (oData, sResponse) {
                  //this.getView().byId("idUserDetTable").updateBindings();
               //   that.byId("DynamicPage").setBusy(false);
    
                  var xmls = [];
                  var aDown = [];
    
                  for (i = 0; i < oData.__batchResponses.length; i++) {
                    var y;
                    for (
                      y = 0;
                      y < oData.__batchResponses[i].data.results.length;
                      y++
                    ) {
                      if (
                        !aDown.includes(
                          oData.__batchResponses[i].data.results[y].Docnum
                        )
                      ) {
                        xmls.push({
                          nfenum: oData.__batchResponses[i].data.results[y].Nfenum,
                          docnum: oData.__batchResponses[i].data.results[y].Docnum,
                          itmnum: oData.__batchResponses[i].data.results[y].Itmnum,
                          xmltid: oData.__batchResponses[i].data.results[y].XmlTid,
                          xmlnfe: oData.__batchResponses[i].data.results[y].XmlNfe,
                        });
                        aDown.push(
                          oData.__batchResponses[i].data.results[y].Docnum
                        );
                      }
                    }
                  }
    
                  that.DownloadFile(xmls);
                  oGlobalBusyDialog.close();
                  oModel.refresh();
                },
                error: function (oError) {
                  var sMensagem = JSONModel.parse(oError.responseText).error.message
                    .value;
                  that.byId("DynamicPage").setBusy(false);
                  MessageBox.error(sMensagem);
                },
              });
            },

            DownloadFile: function (xmls) {
              var z;
              for (z = 0; z < xmls.length; z++) {
                if (xmls[z].xmltid != "") {
                  File.save(
                    xmls[z].xmltid,
                    "NF" + xmls[z].nfenum, //tid
                    "xml",
                    "application/xml"
                  );
                }

              }
            },

            onDowDanfe: function (oEvent) {
              var bCompact = !!this.getView().$().closest(".sapUiSizeCompact")
              .length;
              var oTable = this.byId("smartTable").getTable("ZSTSD364_SRV");
           
              var oSelIndices = oTable.getSelectedIndices();
         
  
              if (oSelIndices.length == 0) {
                MessageBox.warning(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("msgBoxNoItem"),
                  {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                  }
                );
                return;
              } else if (oSelIndices.length > 1) {
                MessageBox.warning(
                  this.getView()
                    .getModel("i18n")
                    .getResourceBundle()
                    .getText("msgBoxOnlyOne"),
                  {
                    styleClass: bCompact ? "sapUiSizeCompact" : "",
                  }
                );
                return;
              }
  
              for (var i of oSelIndices) {
                var _docnum = oTable.getContextByIndex(i).getProperty("docnum");
                break;
              }
  
              //open pdf
              var sUrl =
                this.getView().getModel("ZSTSD364_SRV").sServiceUrl +
                "/FileDanfeSet(DocNum='" +
                _docnum + 
               
                "')/$value";
    
              var opdfViewer = new PDFViewer();
              this.getView().addDependent(opdfViewer);
              opdfViewer.setSource(sUrl);
              opdfViewer.open();


  
  
            }


        });
    });
