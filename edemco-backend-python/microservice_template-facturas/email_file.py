import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage

import requests
from info_email import DTO_email
import os
import pyodbc
import base64
import mimetypes
from dotenv import load_dotenv
env_file="C:/edemco--pruebas/edemco-backend-python/.env"
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