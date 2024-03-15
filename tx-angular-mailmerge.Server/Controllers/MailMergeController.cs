using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using TXTextControl.DocumentServer;

namespace tx_angular_mailmerge.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MailMergeController : ControllerBase
    {
        private readonly ILogger<MailMergeController> _logger;

        public MailMergeController(ILogger<MailMergeController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Route("MergeTemplate")]
        public MailMergeData MergeTemplate([FromBody] MailMergeData mailMergeData)
        {
            using (var tx = new TXTextControl.ServerTextControl())
            {
                tx.Create();

                byte[] templateData = Convert.FromBase64String(mailMergeData.Template);
                tx.Load(templateData, TXTextControl.BinaryStreamType.InternalUnicodeFormat);

                var merge = new MailMerge
                {
                    TextComponent = tx
                };
                merge.MergeJsonData(mailMergeData.Json);

                byte[] documentData;
                tx.Save(out documentData, TXTextControl.BinaryStreamType.InternalUnicodeFormat);

                mailMergeData.Document = Convert.ToBase64String(documentData);

                return mailMergeData;
            }
        }


        [HttpGet]
        [Route("GetJsonData")]
        public MailMergeData GetJsonData()
        {
            var mailMergeData = new MailMergeData();

            string json = System.IO.File.ReadAllText("App_Data/data.json");
            mailMergeData.Json = json;

            return mailMergeData;
        }

    }

   

}
