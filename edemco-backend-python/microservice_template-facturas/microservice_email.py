from email_file import EmailIntegracion

class microservice_email(EmailIntegracion):
    
    @staticmethod
    def ejecucion(cod_planta, correo, password):

        instance_email = EmailIntegracion()
        instance_email.email_credenciales(cod_planta, correo, password)
    @staticmethod
    def prueba(cod_planta,headers):
        instance_mail=EmailIntegracion()
        instance_mail.email_prueba(cod_planta,headers)
    @staticmethod
    def email_contabilidad(Plantas, headers):
        instance_mail=EmailIntegracion()
        instance_mail.email_contabilidad(Plantas,headers)
    @staticmethod
    def email_error_correos():
        instace_mail=EmailIntegracion()
        instace_mail.email_error_correos()
