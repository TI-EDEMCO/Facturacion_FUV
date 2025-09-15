import smtplib
from email.message import EmailMessage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage
from datetime import datetime,timedelta
import requests
from info_email import DTO_email
import os
import pyodbc
import base64
import mimetypes
from dotenv import load_dotenv
env_file="C:/edemco/edemco-backend-python/.env"
load_dotenv(env_file)

class EmailIntegracion:

    @staticmethod
    def email_credenciales(cod_planta, correo, password):
        """
        * cod_planta: Código de la planta para identificar destinatarios.
        * correo: Dirección de correo del remitente.
        * password: Contraseña del correo del remitente.
        * Función: Recupera una lista de correos asociados a la planta indicada y envía un correo
          electrónico con un archivo adjunto (PDF) y una imagen embebida.
        """

        conn = None
        cursor = None

        try:
            # Conexión a la base de datos
            conn_str = os.getenv("SQL_URL")
            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT e.email 
                FROM email e
                JOIN planta p ON e.id_planta = p.id_planta
                WHERE e.id_planta = ?
            """, (cod_planta,))
            result = cursor.fetchall()

            # Lista de correos electrónicos
            email_list = [row.email for row in result]

        except pyodbc.Error as e:
            print(f"Error para cod planta: {cod_planta}: {e}")
            return
        finally:
            # Cerrar cursor y conexión
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        # Obtener información del email
        info_email = DTO_email()
        asunto, route = info_email.execute(cod_planta)
        url_img = r'C:\\Users\\usuario\Desktop\\Encabezado_correo.png'

        name_archive = os.path.basename(route)
        sender_email = correo
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = ", ".join(email_list)
        msg['Subject'] = asunto

        # Cuerpo del mensaje en formato HTML
        html_body = """
        <html>
            <body>
                <img src="cid:image1" alt="Factura">
            </body>
        </html>
        """
        msg.attach(MIMEText(html_body, 'html'))

        # Adjuntar imagen al correo
        if url_img:
            with open(url_img, 'rb') as f:
                mime_image = MIMEImage(f.read())
                mime_image.add_header('Content-ID', '<image1>')  # Relacionado con el CID en el cuerpo del correo
                mime_image.add_header('Content-Disposition', 'inline', filename="Encabezado_correo.png")
                msg.attach(mime_image)

        # Adjuntar el archivo PDF
        with open(route, 'rb') as f:
            pdf_attachment = MIMEApplication(f.read(), _subtype='pdf')
            pdf_attachment.add_header('Content-Disposition', 'attachment', filename=name_archive)
            msg.attach(pdf_attachment)

        # Envío del correo
        smtp_server = 'smtp.office365.com'
        smtp_port = 587
        smtp_username = sender_email
        smtp_password = password
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(sender_email, email_list, msg.as_string())

    @staticmethod
    def email_prueba(cod_planta,headers):
        print("ESTO ES UNA PRUEBA DE CORREO")
        conn = None
        cursor = None

        try:
            # Conexión a la base de datos
            conn_str = os.getenv("SQL_URL_PYODBC")
            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT e.email 
                FROM email e
                JOIN planta p ON e.id_planta = p.id_planta
                WHERE e.id_planta = ?
            """, (cod_planta,))
            result = cursor.fetchall()

            # Lista de correos electrónicos
            email_list = [row.email for row in result]
            print(email_list,list(email_list))

        except pyodbc.Error as e:
            print(f"Error para cod planta: {cod_planta}: {e}")
            return
        finally:
            # Cerrar cursor y conexión
            if cursor:
                cursor.close()
            if conn:
                conn.close()

        # Obtener información del email
        info_email = DTO_email()
        asunto, route = info_email.execute(cod_planta)
        url_img = r'C:\\Users\\usuario\Desktop\\Encabezado_correo.png'
        print(asunto,"<--@@@")

        image=[]
        attachments=[]
        with open(url_img,'rb') as png:
            print(os.path.basename(url_img))
            img64=base64.b64encode(png.read()).decode("utf-8")
            image.append(
                {
                    "@odata.type":"#microsoft.graph.fileAttachment",
                    "name":"image.png",
                    "contentId":"image1",
                    "isInline":True,
                    "contentBytes":img64
                }
            )
        with open(route, 'rb') as file:
            # se obtiene el type para el envio en correo
            mime_type = mimetypes.guess_type(file.name)
            file_content = file.read()
            base64_encode = base64.b64encode(file_content)
            attachments.append({
                "@odata.type": "#microsoft.graph.fileAttachment",
                "name": file.name.split("\\")[-1],
                "contentType": mime_type[0],
                "contentBytes": str(base64_encode).split("b'")[1].replace('\'','')
            })
        toRecipients=[{"emailAddress":{"address":email}} for email in email_list]
        message = {
            "message": {
                "subject": asunto,
                "body": {
                    "contentType": "HTML",
                    "content": '<img src="cid:image1" alt="Factura">'
                },
                "toRecipients": toRecipients
                ,
                "attachments": [*attachments,*image
                ]
            }
        }
        response = requests.post(
            # usa /me para el usuario autenticado
            "https://graph.microsoft.com/v1.0/me/sendMail",
            headers=headers,
            json=message
        )
        print(response,response.text)

    @staticmethod
    def email_contabilidad(Plantas,headers):
        hoy = datetime.now()
        primer_dia_mes_actual = hoy.replace(day=1)
        mes_anterior = primer_dia_mes_actual - timedelta(days=1)
        mes_anterior_numero = mes_anterior.month
        año_mes_anterior = mes_anterior.year
        infoPlantas=[]
        try:
            conn_str = os.getenv("SQL_URL_PYODBC")
            conn = pyodbc.connect(conn_str)
            cursor = conn.cursor()
            for planta in Plantas:
                cursor.execute(f"""
                    select g.valor_total,p.nombre_planta 
                    from generacion g inner join planta 
                    p on g.id_planta=p.id_planta where anio={año_mes_anterior} and
                    mes={mes_anterior_numero} and p.nombre_planta='{planta}'
                """)
                result = cursor.fetchall()
                infoPlantas.append([str(row.nombre_planta)+' : '+f"${float(row.valor_total):,.2f}".replace(',', 'x').replace('.', ',').replace('x', '.')+'<br>' for row in result])
        except pyodbc.Error as e:
            print(f"Error para al realizar consulta de plantas seleccionadas: {e}")
            return
        finally:
            # Cerrar cursor y conexión
            if cursor:
                cursor.close()
            if conn:
                conn.close()
        email_list=os.getenv("EmailsContabilidad").split(",")
        toRecipients=[{"emailAddress":{"address":email}} for email in email_list]
        style="""<style> 
        .imagen{
      width:200px;
        display: block;
  margin-left: auto;
  margin-right: auto;  
    }
  .button{
    display: inline-block; 
    padding: 10px 30px; 
    font-size: 16px; 
    color: #fff; 
    background-color:#0cb645; 
    text-decoration: none; 
    border-radius: 5px;
  }
    .container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    .header {
      background-color: #0cb645;
      color: white;
      padding: 10px;
      text-align: center;
      font-size: 20px;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 15px;
      text-align: left;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 15px;
    }
    .text {
      text-align:center;
    }
  </style>"""
        content_email=f"""
  <div class="container">
    <img class="imagen" alt="Logo Edemco" src="https://www.edemco.co/uploads/files/logo-edemco.png" data-imagetype="External">
    <div class="header">Notificación Facturas Fotovoltaica</div>
    <div class="content">
      <p class="text"><strong>Cordial Saludo</strong></p>
      <p class="text">Se notifica que se acaba de registrar facturas de fotovoltaica para las siguientes plantas y su valor:</p>
      <p class="text">{str(infoPlantas).replace("[","").replace("],","").replace("'","").replace("]","")}</p>
    </div>
    <div class="footer">
          Seguimos mejorando con buena energía. <br>
          ¡Que tengas un excelente día!<br> 
      © 2025 Edemco. Todos los derechos reservados.
    </div>
  </div>"""
        try:
            message = {
            "message": {
                "subject": "Generacion de facturas de plantas PRUEBAS",
                "body": {
                    "contentType": "HTML",
                    "content": style+content_email
                },
                "toRecipients": toRecipients
            }
        }
            response = requests.post(
                # usa /me para el usuario autenticado
                "https://graph.microsoft.com/v1.0/me/sendMail",
                headers=headers,
                json=message
            )
            print(response,response.text)
        except pyodbc.Error as e:
            print(f"Error Al enviar correo de contabilidad: {e}")
            return
            
    @staticmethod
    def email_error_correos():
        mail_email=os.getenv("USER_MAIL")
        mail_password=os.getenv("PASSWORD_MAIL")
        mail=EmailMessage()
        mail["Subject"]="Error en Correos aplicativo Fotovoltica"
        mail["From"]=mail_email
        mail["To"]="jose.romero@edemco.co"
        mail.set_content("Ocurrio un error en el envio de facturas (microservicio de python en el puerto 8091{`microservice_template-facturas`}) por correo, por favor ingrese a verificar el error para el envio de facturas")
        with smtplib.SMTP("smtp.office365.com",587) as server:
            server.starttls()
            server.login(mail_email,mail_password)
            server.send_message(mail)
