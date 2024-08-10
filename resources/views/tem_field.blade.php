<div class="{{$viewClass['form-group']}}">

    <label for="{{$id}}" class="{{$viewClass['label']}} control-label">{{$label}}</label>

    <div class="{{$viewClass['field']}}">
        {{--        <textarea id="{{$id}}" name="{{$name}}">{{ old($column, $value) }}</textarea>--}}

        <div class="tem_warp {{$class}}">
            <input type="hidden" class="Js_tem_input" name="{{$name}}" value="{{old($column, $value)}}">
            <div class="tem_attr_select">
                <span class="btn btn-success Js_single_btn" data-type="single">单规格</span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span class="btn btn-default Js_many_btn" data-type="many">多规格</span>
            </div>
            <div class="tem_attr_key_val" style="display: none">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th style="width: 100px">规格名</th>
                            <th>规格值</th>
                            <th style="width: 100px">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" class="form-control"></td>
                            <td>
                                <div class="tem_attr_val_warp">
                                    <div class="tem_attr_val_item">
                                        <div class="tem_attr_val_input">
                                            <input type="text" class="form-control">
                                        </div>
                                        <span class="btn btn-danger Js_remove_attr_val"><i
                                                class="glyphicon glyphicon-remove"></i></span>
                                    </div>
                                    <div class="tem_attr_val_item Js_add_attr_val" style="padding-left: 10px">
                                        <span class="btn btn-success"><i class="glyphicon glyphicon-plus"></i></span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="btn btn-success Js_add_attr_name">添加</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 操作SKU -->
            <div class="tem_edit_warp" style="display: none">
                <table class="table table-bordered" style="width: auto">
                    <thead></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>

    </div>
</div>
