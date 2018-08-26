// 框架
var Frame = {

    // 框架自带-点击列表详情下拉框显示详情内容
    tableClickShowDetailTr: function (hasDetail, detialUrl) {
        $('.show-details-btn').on('click', function (e) {
            e.preventDefault();
            var thisTr = $(this).closest('tr');
            var detailTr = thisTr.next();
            detailTr.toggleClass('open');
            $(this).find(ace.vars['.icon']).toggleClass('fa-angle-double-down').toggleClass('fa-angle-double-up');
            //打开详情加载详情数据
            if (hasDetail && detialUrl != null) {
                if (thisTr.next().hasClass("open")) {
                    var tid = $(this).parents("tr").find("th[val='tid']").text();
                    Ajax.get(detialUrl, {"tid": tid}, function (data) {
                        window.tableData = data;
                        if (data != null) {
                            detailTr.find(".profile-info-value").each(function (i, o) {
                                var obj = $(o).find("span");
                                var key = obj.text();
                                var dataFm = Table.dataFmFunc(key);
                                var value = window.tableData[dataFm.text];
                                if (value == null) {
                                    value = "";
                                } else {
                                    if (dataFm.date) {
                                        value = Format.date(new Date(value), dataFm.datefm);
                                    }
                                    if (dataFm.enum) {
                                        value = Format.enum(value, dataFm.enumfm);
                                    }
                                }
                                obj.text(value);
                            });
                        }
                    });
                }
            }
        });
    },

    // 展示当前菜单
    showThisMenu: function () {
        var url = window.location.href;
        var urlStrs = url.split("/html/");
        var page = urlStrs[1];
        var pageA = $("a[href$='" + page + "']");
        var pageLi = pageA.parent("li");
        pageLi.addClass("active");
        if (pageLi.parent("ul").hasClass("submenu")) {
            pageLi.parents("li").addClass("open");
        }
    },

    //设置当前面包屑
    setNav: function () {
        var navLi = $(".ace-save-state").find("li.active");
        var parentLi = navLi.parents("li.open");
        if (parentLi.length == 0) {
            var nav = navLi.find(".menu-text").text();
            $("#iframe-nav-top").text(nav);
            $("#iframe-nav-small1").text(nav);
        } else {
            var nav1 = parentLi.find(".menu-text").text();
            var nav2 = navLi.find("span").text();
            $("#iframe-nav-top").text(nav1);
            $("#iframe-nav-small1").text(nav1);
            $("#iframe-nav-small2").text(nav2);
        }
    }
};

// 列表
var Table = {

    // 自动显示列表
    autoInit: function (id, url, head, oper) {

        var tableObj = $("#" + id);
        //列表div box
        var widgetBox = tableObj.closest('.widget-box');

        //自动填充分页选择
        var pageOption = $("<div class='col-xs-6'><div class='dataTables_paginate paging_simple_numbers' id='dynamic-table_paginate'><ul class='pagination'><li class='paginate_button first disabled'><a href='javascript:void(0);'>首页</a></li><li class='paginate_button previous'><a href='javascript:void(0);'>上一页</a></li><li class='paginate_button active'><a href='javascript:void(0);'>1</a></li><li class='paginate_button next'><a href='javascript:void(0);'>下一页</a></li><li class='paginate_button last'><a href='javascript:void(0);'>尾页</a></li></ul></div></div>");
        widgetBox.find(".row").eq(0).append(pageOption);

        //获取当前页数
        var page = widgetBox.find("li.active").find("a");
        //参数
        var param = Table.getParam(tableObj);

        Table.structure_tabel(null, tableObj, page, url, param, head, pageOption);

        //下一页
        widgetBox.find(".next").click(function () {
            param.page = parseInt(page.text()) + 1;
            Table.structure_tabel($(this), tableObj, page, url, param, head, pageOption);
        });
        //上一页
        widgetBox.find(".previous").click(function () {
            param.page = parseInt(page.text()) - 1;
            Table.structure_tabel($(this), tableObj, page, url, param, head, pageOption);
        });
        //首页
        widgetBox.find(".first").click(function () {
            param.page = 1;
            Table.structure_tabel($(this), tableObj, page, url, param, head, pageOption);
        });
        //尾页
        widgetBox.find(".last").click(function () {
            var max = pageOption.find(".next").attr("max");
            param.page = max;
            Table.structure_tabel($(this), tableObj, page, url, param, head, pageOption);
        });

        // 查询
        tableObj.parents(".table-div").find("#btn-query").click(function () {
            param = Table.getParam(tableObj);
            Table.structure_tabel($(this), tableObj, page, url, param, head, pageOption);
        });
        // 清空
        tableObj.parents(".table-div").find("#btn-clear").click(function () {
            tableObj.parents(".table-div").find("[param*='-']").val("");
            param = Table.getParam(tableObj);
            Table.structure_tabel($(this), tableObj, page, url, param, head, pageOption);
        });
    },

    // 列表初始化
    init: function (id, head, body, detialUrl, oper) {

        // 是否配置按钮
        var hasOper = false;
        if (oper == null) {
            hasOper = false;
        }
        // head长度
        var headSize = 2;

        var table = $("#" + id);
        var thead = table.find("thead");
        if (thead.length == 0) {
            thead = $("<thead><tr></tr></thead>");
            table.append(thead);
        }
        var theadTr = thead.find("tr");
        var tbody = table.find("tbody");
        if (tbody.length == 0) {
            tbody = $("<tbody></tbody>");
            table.append(tbody);
        }

        // 设置表头
        // 第1列是复选框
        var td1 = $("<th class='center width-3' val='check'><label class='pos-rel'><input type='checkbox' class='ace' /><span class='lbl'></span></label></th>");
        theadTr.append(td1);
        // 第2列开始是表头
        for (var key in head) {
            var dataFm = Table.dataFmFunc(head[key]);
            var td3_ = $("<th val='" + key + "'>" + dataFm.text + "</th>");
            if (dataFm.date) {
                td3_.attr("isdate", "true");
                td3_.attr("datefm", dataFm.datefm);
            }
            if (dataFm.enum) {
                td3_.attr("isenum", "true");
                td3_.attr("enumfm", dataFm.enumfm);
            }
            theadTr.append(td3_);
            headSize++;
        }
        // 最后一列是操作
        if (hasOper) {
            var tdn = $("<th class='detail-col' val='oper'>操作</th>");
            theadTr.append(tdn);
        }

        // 设置数据
        for (var i = 0; i < body.length; i++) {
            var tr = $("<tr no='" + (i + 1) + "'></tr>");
            // 第1列是复选框
            var td1 = $("<td class='center width-3' val='check'><label class='pos-rel'><input type='checkbox' class='ace' /><span class='lbl'></span></label></td>");
            tr.append(td1);
            // 第2列开始是数据(根据表头填充)
            for (var key in head) {
                if (body[i][key] != null) {
                    var text = body[i][key];
                    var headTh = thead.find("th[val='" + key + "']");
                    if (headTh.attr("isdate") == "true") {
                        text = Format.date(new Date(text), headTh.attr("datefm"));
                    }
                    if (headTh.attr("isenum") == "true") {
                        text = Format.enum(text, headTh.attr("enumfm"));
                    }
                    var td3_ = $("<th val='" + key + "'>" + text + "</th>");
                    tr.append(td3_);
                } else {
                    var td3_ = $("<th val='" + key + "'></th>");
                    tr.append(td3_);
                }
            }
            // 最后一列是操作
            if (hasOper) {
                var tdn = $("<td val='oper'></td>");
                var btnDiv = $("<div class='hidden-sm hidden-xs btn-group'></div>");
                for (var j = 0; j = oper.length; j++) {
                    var button = $("<button name='" + oper[j]['name'] + "' class='" + oper[j]['btnCls'] + "'><i class='" + oper[j]['iClz'] + "'></i></button>");
                    btnDiv.append(button);
                }
                tdn.append(btnDiv);
                tr.append(tdn);
            }
            tbody.append(tr);

        }
    },
    //构建列表
    structure_tabel: function (thiz, tableObj, page, pageUrl, param, head, pageOption) {
        if (thiz != null && thiz.hasClass("disabled")) {
            return;
        }

        var tableId = tableObj.attr("id");

        //清除原table内容
        tableObj.empty();


        Ajax.get(pageUrl, param, function (data) {
            var body = data.list;
            page.text(data.current);
            //列表初始化
            Table.init(tableId, head, body);
            Table.setPageInfo(data, pageOption);
        });
    },
    //设置分页按钮
    setPageInfo: function (data, pageOption) {
        var current = data.current;
        var max = data.max;
        var size = data.size;
        pageOption.find(".active").find("a").text(current);
        pageOption.find(".last").find("a").text("尾页(" + max + ")");
        if (current == 1) {
            pageOption.find(".first").addClass("disabled");
            pageOption.find(".previous").addClass("disabled");
            pageOption.find(".last").removeClass("disabled");
            pageOption.find(".next").removeClass("disabled");
        }
        if (current == max) {
            pageOption.find(".first").removeClass("disabled");
            pageOption.find(".previous").removeClass("disabled");
            pageOption.find(".last").addClass("disabled");
            pageOption.find(".next").addClass("disabled");
        }

        if (current < max && current > 1) {
            pageOption.find(".first").removeClass("disabled");
            pageOption.find(".previous").removeClass("disabled");
            pageOption.find(".last").removeClass("disabled");
            pageOption.find(".next").removeClass("disabled");
        }

        if (max == 1) {
            pageOption.find(".first").addClass("disabled");
            pageOption.find(".previous").addClass("disabled");
            pageOption.find(".last").addClass("disabled");
            pageOption.find(".next").addClass("disabled");
        }
        pageOption.find(".next").attr("max", max);
    },
    //数据格式化
    dataFmFunc: function (headStr) {
        var dataFm = {};
        headStr = headStr + "";
        var overFlg = true;
        while (overFlg) {
            if (headStr.indexOf("$date") > 0) {
                dataFm.date = true;
                var headStrDate = headStr.split("$date");
                headStr = headStrDate[0];
                if (headStrDate[1] == null || headStrDate[1] == "" || headStrDate[1] == "->") {
                    dataFm.datefm = "yyyy-MM-dd";
                } else {
                    dataFm.datefm = headStrDate[1].replace("->", "");
                }
                continue;
            }
            if (headStr.indexOf("$enum") > 0) {
                dataFm.enum = true;
                var headStrEnum = headStr.split("$enum");
                headStr = headStrEnum[0];
                dataFm.enumfm = headStrEnum[1].replace("->", "");
                continue;
            }
            overFlg = false;
            dataFm.text = headStr;
        }
        return dataFm;
    },
    //参数
    getParam: function (tableObj) {
        var param = {};
        param.page = 1;
        var params = tableObj.parents(".table-div").find("[param*='-']");
        for (var i = 0; i < params.length; i++) {
            var thiz = $(params.get(i));
            var k = thiz.attr("param").replace("-", "");
            var v = thiz.val();
            if (v != null && v != "") {
                param[k] = v;
            }
        }
        return param
    },
    //显示详情
    detail: function (detailId, detailUrl) {
        //获取tid参数
        var checked = $("input.ace[type='checkbox']:checked");
        if (checked.length <= 0) {
            alert("请选择您要查看数据的列");
            return;
        }
        if (checked.length > 1) {
            alert("请选择1列查看");
            return;
        }
        var tid = checked.closest("tr").find("[val='tid']").text();
        if (tid == null || tid == "") {
            alert("tId不能为空");
            return;
        }

        //调用接口获取数据并填充
        var modal = $("#" + detailId);
        modal.modal('show');
        var url = detailUrl;
        var param = {};
        param.tid = tid;
        Ajax.get(url, param, function (data) {
            if (data != null) {
                var modalBody = modal.find(".modal-body");
                //删除之前clone的table
                modalBody.find(".profile-user-info").each(function () {
                    if (!$(this).hasClass("profile-user-info-hide")) {
                        $(this).remove();
                    }
                });
                //判断展示方式 div形式 还是table形式
                if (modalBody.find("table").length == 0) {
                    if (data instanceof Array) {
                        var div = modalBody.find(".profile-user-info");
                        for (var i = 0; i < data.length; i++) {
                            var newDiv = div.clone();
                            Table.detailSetData(newDiv, data[i]);
                            newDiv.removeClass("profile-user-info-hide");
                            modalBody.append(newDiv);
                        }
                    } else {
                        var div = modalBody.find(".profile-user-info");
                        var newDiv = div.clone();
                        Table.detailSetData(newDiv, data);
                        newDiv.removeClass("profile-user-info-hide");
                        modalBody.append(newDiv);
                    }
                } else {
                    if (data instanceof Array) {
                        var div = modalBody.find(".profile-user-info");
                        var newDiv = div.clone();
                        newDiv.removeClass("profile-user-info-hide");
                        modalBody.append(newDiv);

                        var cpTable = div.find("table");
                        var showTable = newDiv.find("table");
                        var cpTr = cpTable.find("tbody").find("tr").eq(0);
                        for (var i = 0; i < data.length; i++) {
                            var newTr = cpTr.clone();
                            Table.detailSetData(newTr, data[i]);
                            showTable.append(newTr);
                        }
                    } else {
                        var div = modalBody.find(".profile-user-info");
                        var newDiv = div.clone();
                        newDiv.removeClass("profile-user-info-hide");
                        modalBody.append(newDiv);

                        var cpTable = div.find("table");
                        var showTable = newDiv.find("table");
                        var cpTr = cpTable.find("tbody").find("tr").eq(0);
                        var newTr = cpTr.clone();
                        Table.detailSetData(newTr, data[i]);
                        showTable.append(newTr);
                    }
                }
            }
        });
    },
    //详情设置数据
    detailSetData: function (table, data) {
        var ks = table.find("[k^='-']");
        for (var i = 0; i < ks.length; i++) {
            var k = ks.eq(i).attr("k");
            k = k.replace("-", "");
            var dataFm = Table.dataFmFunc(k);
            var v = data[dataFm.text];
            if (dataFm.date) {
                v = Format.date(v, dataFm.datefm);
            }
            if (dataFm.enum) {
                v = Format.enum(v, dataFm.enumfm);
            }
            ks.eq(i).text(v);
        }
    },

    //增加记录
    add: function(addId, addUrl){
        var modal = $("#" + addId);
        modal.modal('show');
    }
};

// json
var Json = {
    // json成数组
    json2list: function (json) {

    }
};

// ajax
var Ajax = {
    get: function (url, param, success, fail) {
        Ajax.ajax("get", url, param, success, fail);
    },
    post: function (url, param, success, fail) {
        Ajax.ajax("post", url, param, success, fail);
    },
    ajax: function (method, url, param, success, fail) {
        url = host + url;
        param.LOGIN_SESSION_ = Cookie.get("LOGIN_SESSION");
        $.ajax({
            url: url,
            type: method,
            dataType: 'json',
            timeout: 0,
            async: false,
            data: param,
            success: function (data, status) {
                success(data);
            },
            fail: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            },
            complete: function (XMLHttpRequest, textStatus) {
                //后台异常
                if (XMLHttpRequest.status == 500) {
                    //登录异常
                    if (XMLHttpRequest.responseText.indexOf("exception") > 0
                        && XMLHttpRequest.responseText.indexOf("java.lang.RuntimeException") > 0
                        && XMLHttpRequest.responseText.indexOf("message") > 0
                        && XMLHttpRequest.responseText.indexOf("message") > 0) {
                        var reLogin = confirm("登录状态异常");
                        if (reLogin) {
                            Page.goto(loginPage)
                        }
                    }
                }
            }
        })
    }
};

// 数据格式化
var Format = {
    //日期格式化
    date: function (date, fmt) {
        if (date == null) {
            return "";
        }
        //左边补0
        var padLeftZero = function (str) {
            return ('00' + str).substr(str.length);
        };
        if (date == null || date == undefined || date == '') {
            return;
        }
        if (typeof date === "number") {
            date = new Date(date);
        }
        if (!fmt) {
            fmt = 'yyyy-MM-dd';
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        var o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                var str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
            }
        }
        return fmt;
    },
    enum: function (key, fmt) {
        var map = new Map();
        var enums = fmt.split("&");
        for (var i = 0; i < enums.length; i++) {
            var k_v = enums[i].split("=");
            map.set(k_v[0], k_v[1]);
        }
        if (map.get(key) == null) {
            return key;
        } else {
            return map.get(key);
        }
    }
};

// 缓存
var localStorage = window.localStorage;
var Cookie = {
    //存入缓存
    put: function (key, value) {
        if (value != null) {
            localStorage.setItem(key, value);
        } else {
            localStorage.clear(key);
        }
    },
    get: function (key) {
        return localStorage.getItem(key);
    }
};

//画面跳转
var Page = {
    //画面跳转
    goto: function (url) {
        window.location.href = url;
    }
};

//数据校验
var Data = {
    //为空
    isEmpty: function (v) {
        if (v == null || v == "") {
            return true;
        } else {
            return false;
        }
    },
    //不为空
    isNotEmpty: function (v) {
        if (v != null & v != "") {
            return true;
        } else {
            return false;
        }
    }
};

//倒计时
var Time = {
    //倒计时
    interval: function (id, max) {
        var obj = $("#" + id);
        obj.append("<b>(" + max + ")</b>");
        obj.attr("disabled", "disabled");
        setInterval(function () {
            var time = obj.find("b").text();
            time = time.replace("(", "");
            time = time.replace(")", "");
            time = parseInt(time);
            if (time > 0) {
                obj.find("b").text("(" + (time - 1) + ")");
            } else {
                obj.find("b").remove();
                obj.removeAttr("disabled");
            }
        }, 1000);
    }
};

//事件
var Event = {
    //阻止事件冒泡
    stop: function (ev) {
        var oEvent = ev || event;
        oEvent.cancelBubble = true;
        oEvent.stopPropagation();
    }
};