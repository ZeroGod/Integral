/**
 * Author:zhouxiong
 * CreateTime:2017-05-17
 * QQ:978133539   
 * Email:zhouxiong@zhongjiu.cn 
 */

//定义对象
var zhongjiu = window.zhongjiu || {};
zhongjiu.integral = zhongjiu.integral || {};

/**
* @class 创建类
*/

(function (window) {
    function empty(string) { //去除空格
        return string.replace(/\s*/g, '');
    }
    window.Jser = {
        /**
        声明类型
        *@param {String} name          类名
        *@param {Object} base          基类(需要继承的父类)
        *@param {Object} members       非静态成员(javascript键值对)
        *@param {Object} staticMembers 静态成员(javascript键值对)
        *@return {Object} 声明的类
        */
        Class: function (name, base, members, staticMembers) {
            var names = empty(name).split('.'); // 字符串去空格，分割成字符串数组
            var klassName = names.pop();        // 删除并返回数组的最后一个元素
            var klass = members && members[klassName] ? eval('(function(){ return function(){ return this.' + klassName + '.apply(this, arguments);}})()') : eval('(function(){ return function(){}})()');
            var prototype = klass.prototype;    // klass → 匿名函数function(){this.klassName.apply(this,arguments);}  获取klass的原型对象
            klass.name__ = name;                // 静态属性 klass的name__为 类名
            klass.base__ = [];                  // 静态属性 klass的base__为 基类 （可以继承多个基类,所以为数组）
            if (base) {
                klass.base__ = klass.base__.concat(base.base__);    // 若基类存在 则合并继承的基类
                klass.base__.push(base);                            // 将基类也添加到基类数组中
                jQuery.extend(prototype, base.prototype);               // 继承基类的原型
            }
            for (var i in members) {
                var j = members[i];
                if (typeof j == "function") {
                    j.belongs = klass;
                    var o = prototype[i]        // o:继承来自基类的方法 i:方法名
                    if (o && o.belongs) {
                        prototype[o.belongs.name__.replace(/\./g, '$') + '$' + i] = o;
                    }
                }
                prototype[i] = j;
            }
            klass.fn = prototype;               // 静态属性 klass的fn为 klass的原型对象
            jQuery.extend(klass, staticMembers);    // 扩展klass的属性
            var _this = window;
            while (e = names.shift())           // 删除，并返回第一个元素的值 e:命名空间的名称，没有则为全局对象window
                _this = _this[e] || (_this[e] = {});
            if (_this[klassName])               // 判断类型是否重复定义
                throw Jser.Error(name + ' 类型重复定义'); // 抛出错误
            _this[klassName] = klass;
            if (klass[klassName])               // 执行初始化的类
                klass[klassName]();
            return klass;                       //返回当前类
        },
        noop: function () {
        },
        /**
        创建一个异常对像
        * @param {String} msg 创建异常对像所需的字符串
        * @return {Error}
        * @static
        */
        Error: function (msg) {
            return new Error(msg);
        }
    }
    window.Class = Jser.Class;
})(window);


zhongjiu.integral.confirmNew = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: jQuery.noop,
        state: "confirmNew" //弹出层
    };
    var initialize = function () {
        var confirm01 = new AlertNew(defaults);
        return confirm01;
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            return initialize();
        }
    }
});

Class('AlertNew', null, {
    AlertNew: function (options) {
        jQuery.extend(this, options);
        this.sure = options.sure || jQuery.noop;
        this.creatAlert();
    },
    creatAlert: function () {
        var Me = this;
        // 创建弹出层
        var oAlert = document.createElement("div"), aHTML = [];
        oAlert.className = "openWrap";
        var txt = Me.txt || Me.html;
        aHTML.push('<div class="opCon"><div class="opTitle ft16"><p class="g_txt-c">' + txt + '</p></div>');
        aHTML.push('<div class="openWrapCont mt20">');
        aHTML.push('<p class="txt-c  mt20 clearfix">');
        aHTML.push('</p>');
        aHTML.push('</div></div>');
        oAlert.innerHTML = aHTML.join("");
        $("#zj_article").append(oAlert);
        // oBg.appendChild(oAlert);
        Me.oAlert = oAlert;
        var jQueryoAlert = jQuery(oAlert);
        // 确定按钮
        Me.oSure = jQueryoAlert.find(".btnSure");
        // 添加className
        oAlert.className = "openWrap mt20" + Me.addClass;

        //调整弹出框位置
        Me.onResize();
        Me.bindEvent();
        Me.callback && Me.callback.call(Me, Me.oAlert);
    },
    bindEvent: function () {
        var Me = this;
        Me.iTimer = null;
        // 确认
        this.oSure.click(function () {
            //当标题显示为选择的内容
            $('.top-menu').text($(this).text());
            //赋值给文本框
            var content = "店主报告终端信息-" + $(this).text() + "-有误，请确认信息并在APP内修改";
            $('.txtarea').val(content);
            //发送通知标题
            $('#title').val("终端信息-" + $(this).text() + "-有误");
            //判断是否选择内容
            $('#resultType').val("1");          
            $('.item-mypage').css('display', 'none');
            //显示指定的内容
            var item = $(this).attr('showDiv');
            //如果选择的内容不是门头照，移除图片
            if (item != "showDiv1") {
                $("#file").val("");
                $('#showImg').html('<img src="/Images/header-logo.png" style="width: 131px; height: 114px;"/>');
            }
            //对应的内容显示
            $('.' + item).css('display', 'block');
            //关闭下拉框
            Me.closeAlert();
            var ret;
            ret = Me.sure.call(Me, Me.oSure); //回调函数            
            /* if (ret !== false) {
                 Me.closeAlert(); //关闭
             }*/
            return false;
        });
        //暂时不需要，弹出层立即消失
        /*if (Me.state === "alert") {
            Me.timer || (Me.timer = 3000);
            setTimeout(function () { if (Me.iTimer != null) { Me.closeAlert.call(Me) } }, Me.timer);
        }*/

        //窗口发生改变，触发onResize函数 调整弹出框
        jQuery(window).bind("resize", this.onResize);
    },
    onResize: function () {
        oAlert = this.oAlert;
        oAlert.style.zIndex = "9999";
        oAlert.style.display = "block";
        oAlert.style.width = (parseInt(document.documentElement.clientWidth || document.body.clientWidth) - 20) + "px";
    },
    closeAlert: function () {
        var Me = this;
        Me.iTimer = null;
        $(".top-menu").removeClass('dir_top');
        $(".openWrap").remove();
        return false;
    }
}, {});


