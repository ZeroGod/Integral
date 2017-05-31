using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LCS.WeiXin.Web.Controllers
{
    public class IntegralController : BaseController
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="file">上传终端图片</param>
        /// <param name="title">错误标题</param>
        /// <param name="txtarea">错误内容</param>
        /// <param name="storeId"></param>
        /// <param name="resultType">返回结果</param>
        /// <returns></returns>
        public ActionResult Upload(HttpPostedFileBase file, string title, string txtarea, int storeId = 0, int resultType = 0)
        {
            int result = 0;
            return Json(new { Id = storeId, type = result }, "text/html", JsonRequestBehavior.AllowGet);
        }

    }
}