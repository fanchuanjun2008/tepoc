define(['text!pages/FHVO/FHVO.html','pages/FHVO/meta','css!pages/FHVO/FHVO.css','uuitree','uuigrid'],function(html){
//define(['text!./FHVO.html','./meta.js','css!./FHVO.css'],function(html){
    var init = function (element, params) {
        var viewModel = {
    		listurl : '/FHVO/list',   
        	addurl :  '/FHVO/createRow',
            saveurl : '/FHVO/save',
        	delurl  :  '/FHVO/del',
        	

			FHVODa: new u.DataTable(FHVOmeta),
			
			/* 树设置 */
			treeSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				callback : {
					onClick : function(e, id, node) {
						var rightInfo = node.name + '被选中';
					}
				}
			
			},			
			
            event: {
                initList: function () {
                    var nowPageIndex = viewModel.FHVODa.pageIndex();
                    if (viewModel.FHVODa.hasPage(nowPageIndex)) {
                        viewModel.FHVODa.setCurrentPage(nowPageIndex)
                    } else {
                        var queryData = {};
                        $(".form-search").find(".input_search").each(function () {
                            queryData[this.name] = this.value;
                        });
                        viewModel.FHVODa.addParams(queryData);
                        app.serverEvent().addDataTable("FHVODa").fire({
                            url: ctx + viewModel.listurl,
                            success: function (data) {

                            },
                            error:function(er){
                            	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
                            }
                        })
                    }
                },
                pageChange: function (index) {
                    viewModel.FHVODa.pageIndex(index);
                    viewModel.event.initList();
                },
                sizeChange: function (size) {
                    viewModel.FHVODa.clear();
                    viewModel.FHVODa.pageSize(size);
                    viewModel.event.initList();
                },
                

				/**
                 * 树弹窗公共方法中取消按钮
                 */

                mdClose: function () {
                    md.close();
                },                

                /**绑定弹出层 树的按钮 */
                bindClickButton: function (ele, data, functionevent) { //对某一个按钮进行  点击事假绑定 ele:被绑定的元素，  data：需要传递的数据，functionevent：绑定的方法
                    $(ele).unbind('click'); //取消之前的绑定
                    $(ele).bind('click', data, functionevent); //重新绑定
                }, 
                
                search: function () {
                    viewModel.FHVODa.clear();
                    var queryData = {};
                    $(".form-search").find(".input_search").each(function () {
                        queryData[this.name] = this.value;
                    });
                    viewModel.FHVODa.addParams(queryData);
                    app.serverEvent().addDataTable("FHVODa").fire({
                        url: ctx + viewModel.listurl,
                        success: function (data) {

                        },
	                    error:function(er){
	                  	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
	                    }
                    })
                },
                cleanSearch: function () {
                    $(element).find('.form-search').find('input').val('');
                },
                addClick: function () {
                    app.serverEvent().addDataTable("FHVODa").fire({
                        url: ctx + viewModel.addurl,
                        error:function(er){
                        	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
                         }
                    })
                    
                },
                getRowData: function (rows) {  //rows 表示行数据对象
                    var rowsdata = [];
                    for (var i = 0; i < rows.length; i++) {
                        var d = rows[i].getSimpleData();
                        rowsdata.push(d);
                    }
                    return rowsdata;
                },
                saveClick: function () {
                    //以下compsValidate是验证输入格式。开发调试，暂时不用
                    if (!app.compsValidate($(element).find('#list')[0])) {
                        return;
                    }

                    app.serverEvent().addDataTable("FHVODa", 'change').fire({
                        url: ctx + viewModel.saveurl,
                        success: function (data) {
                            u.showMessage({msg: '操作完成'})
                        },
	                    error:function(er){
	                  	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
	                    }
                    })
                },

                delRow: function (data, index) {
                    if (typeof(data) == 'number') {
                        viewModel.FHVODa.setRowSelect(index);
                    }
                    u.confirmDialog({
                        msg: '<div class="pull-left col-padding" >' +
                        '<i class="fa fa-exclamation-circle margin-r-5 fa-3x orange" style="vertical-align:middle"></i>确认删除这些数据数据吗？</div>',
                        title: '警告',
                        onOk: function () {
                            app.serverEvent().addDataTable("FHVODa", 'allSelect').fire({
                                url: ctx + viewModel.delurl,
                                success: function (data) {
                                   /* u.showMessage({msg: '操作完成'})*/
                                },
	                            error:function(er){
	                          	  u.messageDialog({msg: '请求失败，请检查。', title: '请求错误', btnText: '确定'});
	                            }
                            })
                        }
                    });
                }
            }
        }		//end viewModel

        $(element).html(html);
        var app = u.createApp({
            el: '#content',
            el: element,
            model: viewModel
        });
        viewModel.event.initList();
        $('.search-enter').keydown(function (e) {
        	           if (e.keyCode == 13) {
        	                $('#user-action-search').trigger('click');
        	 
        	             }
         });
    }

    return {
        'template': html,
        init: init
    }
});//end define
