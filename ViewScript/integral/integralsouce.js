/**
 * Author:zhouxiong
 * CreateTime:2017-05-12
 * QQ:978133539   
 * Email:zhouxiong@zhongjiu.cn 
 */


//定义对象
var zhongjiu = window.zhongjiu || {};
zhongjiu.integral = zhongjiu.integral || {};

zhongjiu.integral.getintegral = (function () {
    var defaults = {
        pageIndex: 1,//当前页序号
        boxCollection: 'bg-white',//填充html盒子
        infoUrl: "GetIntegralDetailByCondition",//请求地址
        methName: "userIntegral",//方法名
        interId: 0,
        storeId: 0,
        id: 0,
        pageUrl: "",
        count: 1,//请求数
        loading: false,//加载情况，防止多次加载
        myScroll: null

    };

    function bindData() {
        var pullDown, pullUp;
        //下拉刷新
        function pullDownAction() {
            defaults.id = 0;
            //  defaults.pageIndex = 1;
            defaults.count = 1;
            $('.bg-white').html('');
            getData();
        }
        //上拉加载
        function pullUpAction() {
            if (defaults.count > 10) {
                defaults.myScroll.refresh();
                return;
            }
            if (defaults.loading) {
                defaults.myScroll.refresh();
                return;
            }
            defaults.loading = true;
            getData();
        }
        function Download() {
            setTimeout(function () {
                pullDownAction();
            }, 1000);

        }
        function Upload() {
            setTimeout(function () {
                pullUpAction();
            }, 1000);
        }
        pullDown = document.getElementById('pullDown'), pullUp = document.getElementById('pullUp'), bob = null, isMove = null;

        defaults.myScroll = new iScroll('wrapperscroll', {
            useTransition: true, momentum: true,
            hideScrollbar: true,
            fadeScrollbar: true,
            onRefresh: function () {
                pullDown.className = '';
                pullDown.innerHTML = '';
                pullUp.className = '';
                pullUp.innerHTML = '';
            },
            onScrollMove: function (e) {
                switch (true) {

                    case this.y > 40:
                        pullDown.innerHTML = '释放后刷新';
                        pullUp.innerHTML = '';
                        pullDown.className = 'loading';
                        pullUp.className = '';
                        bob = 1;
                        isMove = this.y - 30;
                        break;
                    case this.y < -30:
                        if (defaults.pageIndex < 4) {
                            pullUp.innerHTML = '释放后加载';
                            pullDown.innerHTML = '';
                            pullUp.className = 'loading';
                            pullDown.className = '';
                            bob = 2;
                            isMove = this.y - 30;
                        }
                        break;
                    default:
                        bob = 3;
                }

            },
            onScrollEnd: function () {
                switch (bob) {
                    case 1:
                        if (isMove > 10) {
                            pullDown.className = 'loading';
                            pullDown.innerHTML = '刷新中...';
                            pullUp.className = '';
                            pullUp.innerHTML = '';
                            Download();

                        } else {
                            pullDown.className = '';
                            pullDown.innerHTML = '';
                            pullUp.className = '';
                            pullUp.innerHTML = '';
                        }
                        break;
                    case 2:

                        if (isMove < this.maxScrollY - 60) {
                            pullUp.className = 'loading';
                            pullUp.innerHTML = '加载中...';
                            pullDown.className = '';
                            pullDown.innerHTML = '';
                            Upload();
                        } else {
                            pullDown.className = '';
                            pullDown.innerHTML = '';
                            pullUp.className = '';
                            pullUp.innerHTML = '';
                        }
                        break;
                    default:
                        pullDown.className = '';
                        pullDown.innerHTML = '';
                        pullUp.className = '';
                        pullUp.innerHTML = '';
                }
                isMove = null;
            }

        });

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        //首次加载页面调用方法
        pullDownAction();

    }

    //调用地址，获取数据
    function getData() {
        $.ajax({
            type: "post",
            url: defaults.infoUrl,
            jsonp: "callback",
            dataType: "json",
            data: { "id": defaults.id, "interId": defaults.interId, "storeId": defaults.storeId },
            success: function (data) {
                switch (defaults.methName) {
                    case "userIntegral":
                        userIntegral(data);
                        break;
                    default:;
                }
                defaults.myScroll.refresh();
            },
            error: function (errorStatus) {
                // alert("信息错误！");
            }
        });
    }


    //拼接html到页面
    function userIntegral(json) {
        var data = json;
        if (data.IntegralDetail.length > 0) {
            if ($(".noIntegral").length > 0) {
                $(".noIntegral").remove();
            }
            $.each(data.IntegralDetail, function (i, n) {
                var integral;
                if (n.IntegralType == 1 || n.IntegralType == 2 || n.IntegralType == 3) {
                    integral = "+" + n.Num + "";
                } else {
                    integral = "-" + n.Num + "";
                }
                var createDate = new Date(parseInt(n.CreateTime.replace("/Date(", "").replace(")/", ""), 10));
                var dtStr = createDate.getFullYear() + "-" + (createDate.getMonth() + 1) + "-" + createDate.getDate();
                var sec = $("<section class='mx-list'></section>");
                var str = " <div class='peo-rig'>\
	                    <div class='rank-rig-row1 clearfix'>\
	                    <p class='ft15 fl padL10 lef'>" + n.Title + "</p>\
	                    <p class='rt rig ft14'>" + integral + "</p></div>\
	                    <div class='rank-rig-row2  w-gray88 clearfix'>\
	                    <p class='fl lef padL10 ft14'>" + dtStr + "</p>\
	                    </div>\
	                    </div>";
                sec.append(str);
                $("." + defaults.boxCollection).append(sec);
                defaults.id = n.Id;


            });
        } else {
            //首次加载，如果没有积分记录，显示提示信息
            if (defaults.count === 1) {
                if ($(".noIntegral").length === 0) {
                    $("." + defaults.boxCollection).append("<div class='ft14 noIntegral' style='padding-bottom:20px;margin-top:20px;'>暂无积分记录</div>");
                }
            }
        }
        defaults.myScroll.refresh();
        defaults.loading = false;
        defaults.count++;
        //  defaults.pageIndex++;


    }

    var initialize = function () {
        bindData();
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            initialize();
        }
    };
});

