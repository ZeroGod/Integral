/**
 * Author:zhouxiong
 * CreateTime:2017-05-23
 * QQ:978133539   
 * Email:zhouxiong@zhongjiu.cn 
 */

var htmlContent =
    "<p class='ft14 btnSure' showDiv='showDiv1'>门头照</p><p class='ft14 btnSure' showDiv='showDiv2'>供货商</p><p class='ft14 btnSure' showDiv='showDiv2'>终端名称</p><p class='ft14 btnSure' showDiv='showDiv3'>负责人</p>";
htmlContent +=
    "<p class='ft14 btnSure' showDiv='showDiv2'>联系方式</p><p class='ft14 btnSure' showDiv='showDiv2'>营业电话</p><p class='ft14 btnSure' showDiv='showDiv2'>经营年份</p>";
htmlContent +=
    "<p class='ft14 btnSure' showDiv='showDiv2'>终端类型</p><p class='ft14 btnSure' showDiv='showDiv2'>终端等级</p><p class='ft14 btnSure' showDiv='showDiv2'>地理归属</p>";
htmlContent +=
    "<p class='ft14 btnSure' showDiv='showDiv2'>营业面积</p><p class='ft14 btnSure' showDiv='showDiv2'>最大库存</p><p class='ft14 btnSure' showDiv='showDiv2'>详细地址</p>";
$(function () {
    $(":button").on("click", function () {
        /*if ($("#file").val().length > 0) {
            ajaxFileUpload();
        } else {
            alert("请选择图片");
        }*/
        ajaxFileUpload();
    });

    $(".top-menu").on("click",
        function () {
            if ($(".openWrap").length > 0) {
                $(this).removeClass('dir_top'); //为了改变箭头的方向
                $(".openWrap").remove();
            } else {
                $(this).addClass('dir_top');
                zhongjiu.integral.confirmNew().init({
                    html: (htmlContent),
                    sure: function () {
                    }
                });
            }
        });
    $("#link_file").on("click",
        function () {
            $("#file").click();
        });

    
});
function ajaxFileUpload() {
    $.ajaxFileUpload
    (
        {
            url: '/Integral/Upload', //用于文件上传的服务器端请求地址
            type: 'post',
            data: { storeId: $('#storeId').val(), title: $('#title').val(), txtarea: $('.txtarea').val(), resultType: $('#resultType').val() },
            secureuri: false, //一般设置为false
            fileElementId: 'file', //文件上传空间的id属性
            dataType: 'json',
            success: function (data, status) {
                $("#alertMessage").html(data.content);
            },
            error: function (data, status, e) //服务器响应失败处理函数
            {
                alert(e);
            }
        }
    );
    return false;
}