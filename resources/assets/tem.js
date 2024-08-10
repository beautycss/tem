(function () {
    // 上传地址
    const UploadHost = '/admin/upload_file';

    function TEM(warp) {
        this.warp = $(warp);
        this.attrs = {};
        this.commonStock = 0; // 统一库存
        this.commonPrice = 0; // 统一价格
        this.init();
    }

    TEM.prototype.init = function () {
        let _this = this;

        // 选择tem的类型（单规格/多规格）
        _this.warp.find('.tem_attr_select .btn').click(function () {
            let _dom = $(this);
            if (!_dom.hasClass('btn-success')) {
                _dom.addClass('btn-success').removeClass('btn-default')
                    .siblings().removeClass('btn-success').addClass('btn-default');

                if (_dom.hasClass('Js_single_btn')) {
                    // 点击了单规格
                    // 隐藏多规格编辑DOM
                    _this.warp.find('.tem_attr_key_val,.tem_edit_warp').hide();
                } else if (_dom.hasClass('Js_many_btn')) {
                    // 点击了多规格
                    // 显示多规格编辑DOM
                    _this.warp.find('.tem_attr_key_val,.tem_edit_warp').show();
                }
            }
            _this.processTem()
        });

        // 绑定属性值添加事件
        _this.warp.find('.tem_attr_key_val').on('click', '.Js_add_attr_val', function () {
            let html = '<div class="tem_attr_val_item">' +
                '<div class="tem_attr_val_input">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<span class="btn btn-danger Js_remove_attr_val"><i class="glyphicon glyphicon-remove"></i></span>' +
                '</div>';
            $(this).before(html);
        });

        // 绑定属性值移除事件
        _this.warp.find('.tem_attr_key_val').on('click', '.Js_remove_attr_val', function () {
            $(this).parent('.tem_attr_val_item').remove();
            _this.getTemAttr();
        });

        // 绑定添加属性名事件
        _this.warp.find('.Js_add_attr_name').click(function () {
            let html = '<tr>' +
                '<td><input type="text" class="form-control"></td>' +
                '<td>' +
                '<div class="tem_attr_val_warp">' +
                '<div class="tem_attr_val_item">' +
                '<div class="tem_attr_val_input">' +
                '<input type="text" class="form-control">' +
                '</div>' +
                '<span class="btn btn-danger Js_remove_attr_val"><i class="glyphicon glyphicon-remove"></i></span>' +
                '</div>' +
                '<div class="tem_attr_val_item Js_add_attr_val" style="padding-left:10px">' +
                '<span class="btn btn-success"><i class="glyphicon glyphicon-plus"></i></span>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td>' +
                '<span class="btn btn-danger Js_remove_attr_name">移除</span>' +
                '</td>' +
                '</tr>';
            _this.warp.find('.tem_attr_key_val tbody').append(html)
        });

        // 绑定移除属性名事件
        _this.warp.find('.tem_attr_key_val').on('click', '.Js_remove_attr_name', function () {
            console.log('移除属性名');
            $(this).parents('tr').remove();
            _this.getTemAttr()
        });

        // 绑定input变化事件
        _this.warp.find('.tem_attr_key_val tbody').on('change', 'input', _this.getTemAttr.bind(_this));
        _this.warp.find('.tem_edit_warp tbody').on('keyup', 'input', _this.processTem.bind(_this));

        // 统一价格
        _this.warp.find('.tem_edit_warp thead').on('keyup', 'input.Js_price', function () {
            _this.commonPrice = $(this).val();
            _this.warp.find('.tem_edit_warp tbody td[data-field="price"] input').val(_this.commonPrice);
            _this.processTem()
        });

        // 统一库存
        _this.warp.find('.tem_edit_warp thead').on('keyup', 'input.Js_stock', function () {
            _this.commonStock = $(this).val();
            _this.warp.find('.tem_edit_warp tbody td[data-field="stock"] input').val(_this.commonStock);
            _this.processTem()
        });

        // TEM图片上传
        _this.warp.find('.tem_edit_warp tbody').on('click', '.Js_tem_upload', function() {
            _this.upload($(this))
        });

        // 清空TEM图片
        _this.warp.find('.tem_edit_warp tbody').on('click','.Js_tem_del_pic', function() {
            let td = $(this).parent();
            td.find('input').val('');
            td.find('.Js_tem_upload').css('background-image','none');
            _this.processTem()
        });

        let old_val = _this.warp.find('.Js_tem_input').val();
        if (old_val) {
            // 根据值生成DOM
            old_val = JSON.parse(old_val);
            if (old_val.type === 'many') {
                // 多规格
                _this.warp.find('.tem_attr_select .Js_many_btn').trigger('click');

                // 处理规格名
                let attr_names = old_val.attrs;
                let tbody = _this.warp.find('.tem_attr_key_val tbody');
                let attr_keys = Object.keys(attr_names);
                let attr_keys_len = attr_keys.length;
                attr_keys.forEach(function (attr_key, index) {
                    // 规格名
                    let tr = tbody.find('tr').eq(index);
                    tr.find('td:eq(0) input').val(attr_key);

                    // 规格值
                    let attr_val_td = tr.find('td:eq(1)');
                    let attr_vals = attr_names[attr_key];
                    let attr_vals_len = attr_vals.length;
                    attr_vals.forEach(function (attr_val, index_2) {
                        attr_val_td.find('input').eq(index_2).val(attr_val);
                        if (index_2 < attr_vals_len - 1) {
                            attr_val_td.find('.Js_add_attr_val').trigger('click');
                        }
                    });

                    // 接着处理下一行
                    if(index < attr_keys_len - 1) {
                        tr.find('td:eq(2) .Js_add_attr_name').trigger('click');
                    }
                });

                // 生成具体的TEM配置表单
                _this.attrs = old_val.attrs;
                _this.TEMForm(old_val.tem);
            }
        } else {
            _this.processTem()
        }
    };

    // 获取TEM属性
    TEM.prototype.getTemAttr = function () {
        let attr = {}; // 所有属性
        let _this = this;
        let trs = _this.warp.find('.tem_attr_key_val tbody tr');
        trs.each(function () {
            let tr = $(this);
            let attr_name = tr.find('td:eq(0) input').val(); // 属性名
            let attr_val = []; // 属性值
            if (attr_name) {
                // 获取对应的属性值
                tr.find('td:eq(1) input').each(function () {
                    let ipt_val = $(this).val();
                    if (ipt_val) {
                        attr_val.push(ipt_val)
                    }
                });
            }
            if (attr_val.length) {
                attr[attr_name] = attr_val;
            }
        });

        if (JSON.stringify(_this.attrs) !== JSON.stringify(attr)) {
            _this.attrs = attr;
            _this.TEMForm()
        }
    };

    // 生成具体的TEM配置表单
    TEM.prototype.TEMForm = function (default_tem) {
        let _this = this;
        let attr_names = Object.keys(_this.attrs);
        if (attr_names.length === 0) {
            _this.warp.find('.tem_edit_warp tbody').html(' ');
            _this.warp.find('.tem_edit_warp thead').html(' ');
        } else {
            // 渲染表头
            let thead_html = '<tr>';
            attr_names.forEach(function (attr_name) {
                thead_html += '<th>' + attr_name + '</th>'
            });
            thead_html += '<th style="width: 100px">图片</th>';
            thead_html += '<th style="width: 100px">价格 <input value="' + _this.commonPrice + '" type="text" style="width: 50px" class="Js_price"></th>';
            thead_html += '<th style="width: 100px">库存 <input value="' + _this.commonStock + '" type="text" style="width: 50px" class="Js_stock"></th>';
            thead_html += '</tr>';
            _this.warp.find('.tem_edit_warp thead').html(thead_html);

            // 求笛卡尔积
            let cartesianProductOf = (function () {
                    return Array.prototype.reduce.call(arguments, function (a, b) {
                        var ret = [];
                        a.forEach(function (a) {
                            b.forEach(function (b) {
                                ret.push(a.concat([b]));
                            });
                        });
                        return ret;
                    }, [[]]);
                })(...Object.values(_this.attrs));

            // 根据计算的笛卡尔积渲染tbody
            let tbody_html = '';
            cartesianProductOf.forEach(function (tem_item) {
                tbody_html += '<tr>';
                tem_item.forEach(function (attr_val, index) {
                    let attr_name = attr_names[index];
                    tbody_html += '<td data-field="' + attr_name + '">' + attr_val + '</td>';
                });
                tbody_html += '<td data-field="pic"><input value="" type="hidden" class="form-control"><span class="Js_tem_upload">+</span><span class="Js_tem_del_pic">清空</span></td>';
                tbody_html += '<td data-field="price"><input value="' + _this.commonPrice + '" type="text" class="form-control"></td>';
                tbody_html += '<td data-field="stock"><input value="' + _this.commonStock + '" type="text" class="form-control"></td>';
                tbody_html += '</tr>'
            });
            _this.warp.find('.tem_edit_warp tbody').html(tbody_html);

            if(default_tem) {
                // 填充数据
                default_tem.forEach(function(item_tem, index) {
                    let tr = _this.warp.find('.tem_edit_warp tbody tr').eq(index);
                    Object.keys(item_tem).forEach(function(field) {
                        let input = tr.find('td[data-field="'+field+'"] input');
                        if(input.length) {
                            input.val(item_tem[field]);
                            let tem_upload = tr.find('td[data-field="'+field+'"] .Js_tem_upload');
                            if(tem_upload.length) {
                                tem_upload.css('background-image','url('+item_tem[field]+')');
                            }
                        }
                    })
                });
            }
        }
        _this.processTem()
    };

    // 处理最终TEM数据，并写入input
    TEM.prototype.processTem = function () {
        let _this = this;
        let tem_json = {};
        tem_json.type = _this.warp.find('.tem_attr_select .btn.btn-success').attr('data-type');
        if (tem_json.type === 'many') {
            // 多规格
            tem_json.attrs = _this.attrs;
            let tem = [];
            _this.warp.find('.tem_edit_warp tbody tr').each(function () {
                let tr = $(this);
                let item_tem = {};
                tr.find('td[data-field]').each(function () {
                    let td = $(this);
                    let field = td.attr('data-field');
                    let input = td.find('input');
                    if (input.length) {
                        item_tem[field] = input.val();
                    } else {
                        item_tem[field] = td.text();
                    }
                });
                tem.push(item_tem);
            });
            tem_json.tem = tem;
        }
        _this.warp.find('.Js_tem_input').val(JSON.stringify(tem_json));
    };

    // 图片上传
    TEM.prototype.upload = function(obj) {
        let _this = this;
        // 创建input[type="file"]元素
        let file_input = document.createElement('input');
        file_input.setAttribute('type','file');
        file_input.setAttribute('accept','image/x-png,image/jpeg');

        // 模拟点击 选择文件
        file_input.click();

        file_input.onchange = function() {
            let file = file_input.files[0];  //获取上传的文件名
            let formData = new FormData();
            formData.append('file', file);
            formData.append('_token', LA.token);
            // 使用ajax上传文件
            $.ajax({
                type: "POST",
                url: UploadHost,
                data: formData,
                contentType: false, //告诉jQuery不要去设置Content-Type请求头
                headers: {
                    Accept: "application/json"
                },
                processData: false, //告诉jQuery不要去处理发送的数据
                success: function (res) {
                    obj.css('background-image','url('+res.url+')');
                    obj.parent().find('input').val(res.url);
                    _this.processTem()
                }
            })
        }
    };

    window.BeautycssTEM = TEM;
})();
