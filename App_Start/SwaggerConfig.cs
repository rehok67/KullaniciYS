using System.Web.Http;
using Swashbuckle.Application;

namespace KullaniciYS
{
    public class SwaggerConfig
    {
        public static void Register()
        {
            GlobalConfiguration.Configuration
                .EnableSwagger(c =>
                {
                    c.SingleApiVersion("v1", "Kullanıcı Yönetim Sistemi API");
                })
                .EnableSwaggerUi(c =>
                {
                    c.DocumentTitle("API Documentation");
                });
        }
    }
}
