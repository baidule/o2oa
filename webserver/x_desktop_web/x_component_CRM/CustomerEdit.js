MWF.xApplication.CRM.CustomerEdit = new Class({
    Extends: MWF.xApplication.CRM.Template.PopupForm,
    Implements: [Options, Events],
    options: {
        "style": "default",
        "width": "800",
        "height": "100%",
        "top" : 0,
        "left" : 0,
        "hasTop": true,
        "hasIcon": false,
        "hasBottom": true,
        "title": "",
        "draggable": false,
        "closeAction": true
    },

    initialize: function (explorer, actions, data, options) {
        this.setOptions(options);
        this.explorer = explorer;
        this.app = explorer.app;
        this.lp = this.app.lp.customer.customerEdit;
        this.path = "/x_component_CRM/$CustomerEdit/";
        this.cssPath = this.path + this.options.style + "/css.wcss";
        this._loadCss();

        this.options.title = this.lp.title;

        this.data = data || {};
        this.actions = actions;
    },
    load: function () {

        this.createForm();

    },
    createForm:function(){
        this.allArrowArr = [];
        if (this.options.isNew) {
            this.create();
        } else if (this.options.isEdited) {
            this.edit();
        } else {
            this.open();
        }

        this.formContentNode.addEvents({
            "click": function () {
                if(this.listContentDiv){
                    this.listContentDiv.destroy();
                }
                if(this.allArrowArr.length>0){
                    this.allArrowArr.each(function(d){
                        d.setStyles({
                            "background":"url(/x_component_CRM/$Template/default/icons/arrow.png) no-repeat center"
                        });
                    }.bind(this))
                }

            }.bind(this)
        });
    },
    createTopNode: function () {
        if (!this.formTopNode) {
            this.formTopNode = new Element("div.formTopNode", {
                "styles": this.css.formTopNode
            }).inject(this.formNode);

            this.formTopIconNode = new Element("div", {
                "styles": this.css.formTopIconNode
            }).inject(this.formTopNode);

            this.formTopTextNode = new Element("div", {
                "styles": this.css.formTopTextNode,
                "text": this.options.title + ( this.data.title ? ("-" + this.data.title ) : "" )
            }).inject(this.formTopNode);

            if (this.options.closeAction) {
                this.formTopCloseActionNode = new Element("div", {"styles": this.css.formTopCloseActionNode}).inject(this.formTopNode);
                this.formTopCloseActionNode.addEvent("click", function () {
                    this.close();
                }.bind(this))
            }

            this.formTopContentNode = new Element("div", {
                "styles": this.css.formTopContentNode
            }).inject(this.formTopNode);

            this._createTopContent();

        }
    },
    _createTopContent: function () {

    },
    _createTableContent: function () {
        //this.loadFormData();
        var Ttype = "customer";
        this.actions.getProfiles(Ttype,function(json){
            this.profileData = json.data;
            if(this.data.id){
                this.actions.getCustomerInfo(this.data.id,function(json){
                    this.customerData = json.data;
                    this.loadFormData();
                    this.createCustomBottom();
                }.bind(this));
            }else{
                this.loadFormData();
                this.createCustomBottom();
            }
        }.bind(this));

    },
    loadFormData:function(){
        var tmpData={};
        var html = "<table width='100%' bordr='0' cellpadding='5' cellspacing='0' styles='formTable'>" +
            "<tr>" +
            "   <td styles='formTableTitle'><span lable='TCustomerName'></span><span style='color:#f00'>*</span></td>" +
            "   <td styles='formTableValue' item='TCustomerName'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TCustomerType'></td>" +
            "   <td styles='formTableValue'><div id='TCustomerType'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TCustomerLevel'></td>" +
            "   <td styles='formTableValue'><div id='TCustomerLevel'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TSource'></td>" +
            "   <td styles='formTableValue'><div id='TSource'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TIndustryFirst'></td>" +
            "   <td styles='formTableValue'><div id='TIndustryFirst'></div><div id='TIndustrySecond'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TDistrict'></td>" +
            "   <td styles='formTableValue'><div id='TProvince'></div><div id='TCity'></div><div id='TArea'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TStreet'></td>" +
            "   <td styles='formTableValue' item='TStreet'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TLocation'></td>" +
            "   <td styles='formTableValue'><div style='width:100%;height:30px;'><input type='text' placeholder='"+this.lp.TLocationNotice+"' id='mapLocation' disabled/></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle'></td>" +
            "   <td styles='formTableValue'><div id='mapDiv' styles='mapDiv'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TTelphone'></td>" +
            "   <td styles='formTableValue' item='TTelphone'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TFax'></td>" +
            "   <td styles='formTableValue' item='TFax'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TRemark'></td>" +
            "   <td styles='formTableValue' item='TRemark'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TWebSite'></td>" +
            "   <td styles='formTableValue' item='TWebSite'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TEmail'></td>" +
            "   <td styles='formTableValue' item='TEmail'></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TCustomerStatus'></td>" +
            "   <td styles='formTableValue'><div id='TCustomerStatus'></div></td>" +
            "</tr><tr>" +
            "   <td styles='formTableTitle' lable='TCustomerGrade'></td>" +
            "   <td styles='formTableValue'><div id='TCustomerGrade'></div></td>" +
            "</tr>" +
            "</table>"
        this.formTableArea.set("html", html);
        this.loadForm();

        this.TCustomerType = this.formTableArea.getElement("#TCustomerType");
        this.TCustomerLevel = this.formTableArea.getElement("#TCustomerLevel");
        this.TSource = this.formTableArea.getElement("#TSource");
        this.TIndustryFirst = this.formTableArea.getElement("#TIndustryFirst");
        this.TIndustrySecond = this.formTableArea.getElement("#TIndustrySecond");
        this.TProvince = this.formTableArea.getElement("#TProvince");
        this.TCity = this.formTableArea.getElement("#TCity");
        this.TArea = this.formTableArea.getElement("#TArea");
        this.TCustomerStatus = this.formTableArea.getElement("#TCustomerStatus");
        this.TCustomerGrade = this.formTableArea.getElement("#TCustomerGrade");

        var size = {"width":230,"height":30};

        this.TIndustryFirst.setStyles({"float":"left"});
        this.TIndustrySecond.setStyles({"float":"left","margin-left":"10px"});



        //客户类型
        this.TCustomerTypeSelector =  new MWF.xApplication.CRM.Template.Select(this.TCustomerType,this, this.actions, size);
        this.TCustomerTypeSelector.load();
        alert(JSON.stringify(this.profileData.customertype_config))
        this.TCustomerTypeSelector.setList(this.profileData.customertype_config);
        if(this.customerData && this.customerData.customertype){
            this.TCustomerTypeSelector.selectValueDiv.set({"text":this.customerData.customertype});
            this.TCustomerTypeSelector.node.set("value",this.customerData.customertype);
        }
        //客户级别
        this.TCustomerLevelSelector =  new MWF.xApplication.CRM.Template.Select(this.TCustomerLevel,this, this.actions, size);
        this.TCustomerLevelSelector.load();
        this.TCustomerLevelSelector.setList(this.profileData.level_config);
        if(this.customerData && this.customerData.level){
            this.TCustomerLevelSelector.selectValueDiv.set({"text":this.customerData.level});
            this.TCustomerLevelSelector.node.set("value",this.customerData.level);
        }
        //来源
        this.TSourceSelector =  new MWF.xApplication.CRM.Template.Select(this.TSource,this, this.actions, size);
        this.TSourceSelector.load();
        this.TSourceSelector.setList(this.profileData.source_config);
        if(this.customerData && this.customerData.source){
            this.TSourceSelector.selectValueDiv.set({"text":this.customerData.source});
            this.TSourceSelector.node.set("value",this.customerData.source);
        }
        //行业
        this.TIndustryFirstSelector =  new MWF.xApplication.CRM.Template.Select(this.TIndustryFirst,this, this.actions, {"width":230,"height":30});
        this.TIndustrySecondSelector =  new MWF.xApplication.CRM.Template.Select(this.TIndustrySecond,this, this.actions, {"width":230,"height":30,"available":"no"});
        this.TIndustrySecondSelector.load();
        this.TIndustryFirstSelector.load();
        if(this.customerData && this.customerData.industryfirst){
            this.TIndustryFirstSelector.selectValueDiv.set({"text":this.customerData.industryfirst});
            this.TIndustryFirstSelector.node.set("value",this.customerData.industryfirst);


            this.profileData.industry_config.childNodes.each(function(d){
                if(d.configname == this.customerData.industryfirst){
                    tmpData = d;
                }
            }.bind(this));
            this.TIndustrySecondSelector.setList(tmpData);
            this.TIndustrySecond.set("available","yes");
            this.TIndustrySecond.setStyles({"background-color":""});

        }
        if(this.customerData && this.customerData.industrysecond){
            this.TIndustrySecondSelector.selectValueDiv.set({"text":this.customerData.industrysecond});
            this.TIndustrySecondSelector.node.set("value",this.customerData.industrysecond);

            this.profileData.industry_config.childNodes.each(function(d){
                if(d.configname == this.customerData.industryfirst){
                    tmpData = d;
                }
            }.bind(this));
            this.TIndustrySecondSelector.setList(tmpData);
            this.TIndustrySecond.set("available","yes");
            this.TIndustrySecond.setStyles({"background-color":""});

        }
        this.TIndustryFirstSelector.setList(this.profileData.industry_config,function(d){
            if(this.TIndustryFirst.get("value") == this.lp.defaultSelect){
                this.TIndustrySecondSelector.createDefault();
                this.TIndustrySecondSelector.setList();
                this.TIndustrySecond.set("available","no");
                this.TIndustrySecond.setStyles({"background-color":"#eeeeee"})
            }else{
                this.TIndustrySecondSelector.createDefault();
                this.TIndustrySecondSelector.setList(d);
                this.TIndustrySecond.set("available","yes");
                this.TIndustrySecond.setStyles({"background-color":""});
            }
        }.bind(this));



        //省、市、区
        this.TProvinceSelector =  new MWF.xApplication.CRM.Template.Select(this.TProvince,this, this.actions, {"width":150,"height":30});
        this.TProvinceSelector.load({},function(){
            this.actions.getProvinceList(function(json){
                this.TProvinceSelector.setAddress(json.data,function(d){
                    //city
                    if(this.TProvince.get("value") == this.lp.defaultSelect){
                        this.TCitySelector.createDefault();
                        this.TCitySelector.setAddress();
                        this.TCity.set("available","no");
                        this.TCity.setStyles({"background-color":"#eeeeee"});
                    }else{
                        this.actions.getCityList({pid: d.cityid},function(json){
                            this.TCitySelector.createDefault();
                            this.TCitySelector.setAddress(json.data,function(dd){
                                //area
                                if(this.TCity.get("value") == this.lp.defaultSelect){
                                    this.TAreaSelector.createDefault();
                                    this.TAreaSelector.setAddress();
                                    this.TArea.set("available","no");
                                    this.TArea.setStyles({"background-color":"#eeeeee"});
                                }else{
                                    this.actions.getAreaList({pid:dd.cityid},function(json){
                                        this.TAreaSelector.createDefault();
                                        this.TAreaSelector.setAddress(json.data);
                                        this.TArea.set("available","yes");
                                        this.TArea.setStyles({"background-color":""});
                                    }.bind(this));
                                }

                            }.bind(this));
                            this.TCity.set("available","yes");
                            this.TCity.setStyles({"background-color":""});
                        }.bind(this));

                    }

                    this.TAreaSelector.createDefault();
                    this.TAreaSelector.setAddress();
                    this.TArea.set("available","no");
                    this.TArea.setStyles({"background-color":"#eeeeee"});
                }.bind(this))
            }.bind(this))
        }.bind(this));
        this.TCitySelector =  new MWF.xApplication.CRM.Template.Select(this.TCity,this, this.actions, {"width":150,"height":30,"available":"no"});
        this.TCitySelector.load();
        this.TAreaSelector =  new MWF.xApplication.CRM.Template.Select(this.TArea,this, this.actions, {"width":150,"height":30,"available":"no"});
        this.TAreaSelector.load();

        if(this.customerData && this.customerData.province){ //省
            this.TProvinceSelector.selectValueDiv.set({"text":this.customerData.province});
            this.TProvinceSelector.node.set("value",this.customerData.province);
        }
        if(this.customerData && this.customerData.city){ //市
            if(this.customerData && this.customerData.province){
                this.actions.getCityListByName({"regionname":this.customerData.province},
                    function(json){
                        this.TCitySelector.setAddress(json.data,function(dd){
                            //area
                            if(this.TCity.get("value") == this.lp.defaultSelect){
                                this.TAreaSelector.createDefault();
                                this.TAreaSelector.setAddress();
                                this.TArea.set("available","no");
                                this.TArea.setStyles({"background-color":"#eeeeee"});
                            }else{
                                this.actions.getAreaList({pid:dd.cityid},function(json){
                                    this.TAreaSelector.createDefault();
                                    this.TAreaSelector.setAddress(json.data);
                                    this.TArea.set("available","yes");
                                    this.TArea.setStyles({"background-color":""});
                                }.bind(this));
                            }

                        }.bind(this));
                    }.bind(this));
            }
            this.TCitySelector.selectValueDiv.set({"text":this.customerData.city});
            this.TCitySelector.node.set("value",this.customerData.city);
            this.TCity.set("available","yes");
            this.TCity.setStyles({"background-color":""});


        }
        if(this.customerData && this.customerData.county){ //区
            if(this.customerData && this.customerData.city){
                this.actions.getAreaListByName({"regionname":this.customerData.city},
                    function(json){
                        this.TAreaSelector.setAddress(json.data);
                    }.bind(this));
            }
            this.TAreaSelector.selectValueDiv.set({"text":this.customerData.county});
            this.TAreaSelector.node.set("value",this.customerData.county);
            this.TArea.set("available","yes");
            this.TArea.setStyles({"background-color":""});
        }

        this.TProvince.setStyles({"float":"left"});
        this.TCity.setStyles({"float":"left","margin-left":"10px"});
        this.TArea.setStyles({"float":"left","margin-left":"10px"});

        this.TCustomerStatusSelector =  new MWF.xApplication.CRM.Template.Select(this.TCustomerStatus,this, this.actions, size);
        this.TCustomerStatusSelector.load();
        this.TCustomerStatusSelector.setList(this.profileData.state_config);
        if(this.customerData && this.customerData.state){
            this.TCustomerStatusSelector.selectValueDiv.set({"text":this.customerData.state});
            this.TCustomerStatusSelector.node.set("value",this.customerData.state);
        }
        this.TCustomerGradeSelector = new MWF.xApplication.CRM.Template.Select(this.TCustomerGrade,this, this.actions, size);
        this.TCustomerGradeSelector.load();
        this.TCustomerGradeSelector.setList(this.profileData.customerrank_config);

        this.TMap = this.formTableArea.getElement("#mapDiv");
        this.TMap.addEvents({
            "mousewheel":function(e){
                e.stopPropagation();
            }
        });
        this.mapLocation = this.formTableArea.getElement("#mapLocation");
        this.mapLocation.setStyles({
            "width": "99%",
            "text-indent":"5px",
            "border":"1px solid #999",
            "background-color":"#eee",
            "border-radius": "3px",
            "box-shadow": "0px 0px 6px #eee",
            "height": "26px"
        });


        MWF.xDesktop.requireApp("CRM", "BaiduMap", function(){
            this.bMap = new MWF.xApplication.CRM.BaiduMap(this.TMap,this.app,this,this.actions,{"from":"newCustomer"});
            var mapData = {};
            if(this.customerData && this.customerData.addresslatitude){
                mapData.latitude = this.customerData.addresslatitude
            }
            if(this.customerData && this.customerData.addresslongitude){
                mapData.longitude = this.customerData.addresslongitude
            }
            this.bMap.load(mapData);
        }.bind(this));
    },

    loadForm: function(){
        this.form = new MForm(this.formTableArea, this.data, {
            style: "default",
            isEdited: this.isEdited || this.isNew,
            itemTemplate: this.getItemTemplate(this.lp )
        },this.app,this.css);
        this.form.load();
        this.formTableArea.getElements("textarea").setStyles({"height":"100px","overflow":"auto","color":"#666666"});
        this.formTableArea.getElements("input").setStyles({"color":"#666666"});
    },
    getItemTemplate: function( lp ){
        _self = this;
        return {
            TCustomerName: {
                text: lp.TCustomerName,
                type: "text",
                attr : {placeholder:lp.TCustomerName},
                notEmpty:true,
                value:this.customerData && this.customerData.customername?this.customerData.customername:""
            },
            TCustomerType:{
                text: lp.TCustomerType
            },
            TCustomerLevel: {
                text: lp.TCustomerLevel
            },
            TSource: {
                text: lp.TSource
            },
            TIndustryFirst:{
                text: lp.TIndustryFirst
            },
            TIndustrySecond:{

            },
            TDistrict:{
                text: lp.TDistrict
            },
            TStreet: {
                text: lp.TStreet,
                type: "text",
                value:this.customerData && this.customerData.houseno?this.customerData.houseno:""
            },
            TLocation:{
                text: lp.TLocation,
                type : "text",
                attr : {"id":"mapLocation","disabled":true},
                value:this.customerData && this.customerData.houseno?this.customerData.houseno:""
            },
            TTelphone: {
                text: lp.TTelphone,
                type: "text",
                value:this.customerData && this.customerData.telno?this.customerData.telno:""
            },
            TFax: {
                text: lp.TFax,
                type: "text",
                value:this.customerData && this.customerData.customerfax?this.customerData.customerfax:""
            },
            TRemark: {
                text: lp.TRemark,
                name:"TRemark",
                type: "textarea",
                value:this.customerData && this.customerData.remark?this.customerData.remark:""
            },
            TWebSite: {
                text: lp.TWebSite,
                type: "text",
                value:this.customerData && this.customerData.url?this.customerData.url:""
            },
            TEmail: {
                text: lp.TEmail,
                type: "text",
                value:this.customerData && this.customerData.email?this.customerData.email:""
            },
            TCustomerStatus: {
                text: lp.TCustomerStatus
            },
            TCustomerGrade: {
                text: lp.TCustomerGrade
            }
        }
    },
    createCustomBottom:function(){
        this.okActionNode = new Element("div.formOkActionNode", {
            "styles": this.css.formOkActionNode,
            "text": this.lp.actionConfirm
        }).inject(this.formBottomNode);

        this.okActionNode.addEvent("click", function (e) {
            this.ok(e);
        }.bind(this));
    },
    //_createBottomContent: function () {
    //
    //    this.cancelActionNode = new Element("div.formCancelActionNode", {
    //        "styles": this.css.formCancelActionNode,
    //        "text": this.lp.actionCancel
    //    }).inject(this.formBottomNode);
    //    this.cancelActionNode.addEvent("click", function (e) {
    //        this.cancel(e);
    //    }.bind(this));
    //
    //    this.okActionNode = new Element("div.formOkActionNode", {
    //        "styles": this.css.formOkActionNode,
    //        "text": this.lp.actionConfirm
    //    }).inject(this.formBottomNode);
    //
    //    this.okActionNode.addEvent("click", function (e) {
    //        this.ok(e);
    //    }.bind(this));
    //
    //},
    _ok: function (data, callback) {
        var name = this.data.TCustomerName;
        var customertype = this.formTableArea.getElement("#TCustomerTypeValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TCustomerTypeValue").get("text");
        var level = this.formTableArea.getElement("#TCustomerLevel").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TCustomerLevel").get("text");
        var source = this.formTableArea.getElement("#TSourceValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TSourceValue").get("text");
        var industryfirst = this.formTableArea.getElement("#TIndustryFirstValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TIndustryFirstValue").get("text");
        var industrysecond = this.formTableArea.getElement("#TIndustrySecond").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TIndustrySecond").get("text");
        var province = this.formTableArea.getElement("#TProvinceValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TProvinceValue").get("text");
        var city = this.formTableArea.getElement("#TCityValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TCityValue").get("text");
        var county = this.formTableArea.getElement("#TAreaValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TAreaValue").get("text");
        var houseno = this.data.TStreet;
        var addresslongitude = this.data.lng;
        var addresslatitude = this.data.lat;
        var telno = this.data.TTelphone;
        var url = this.data.TWebSite;
        var email = this.data.TEmail;
        var state = this.formTableArea.getElement("#TCustomerStatusValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TCustomerStatusValue").get("text");
        var rank = this.formTableArea.getElement("#TCustomerGradeValue").get("text") == this.lp.defaultSelect ? "":this.formTableArea.getElement("#TCustomerGradeValue").get("text");
        var customerfax = this.data.TFax;
        var remark = this.data.TRemark;
        var qqno = "";
        var webchat = "";
        var id = this.customerData ? this.customerData.id:"";

        var saveData = {
            "id":id,
            "customername":name,
            "customertype":customertype,
            "level":level,
            "source":source,
            "industryfirst":industryfirst,
            "industrysecond":industrysecond,
            "province":province,
            "city":city,
            "county":county,
            "houseno":houseno,
            "addresslongitude":addresslongitude,
            "addresslatitude":addresslatitude,
            "customerfax":customerfax,
            "telno":telno,
            "url":url,
            "remark":remark,
            "email":email,
            "state":state,
            "customerrank":rank,
            "qqno":qqno,
            "webchat":webchat
        };

        //alert(JSON.stringify(saveData))
        this.app.createShade();
        this.actions.saveCustomer(saveData,function(json){
            this.app.destroyShade();
            this.app.notice(this.lp.saveSuccess,"success");
            this.close();
            this.fireEvent("reloadView",json);
        }.bind(this),function(xhr,text,error){
            this.app.showErrorMessage(xhr,text,error);
            this.app.destroyShade();
        }.bind(this));
    }
});