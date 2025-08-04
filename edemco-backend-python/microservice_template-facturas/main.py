from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from microservice_factura import microservice_factura
from microservice_email import microservice_email
import jwt
import base64
import os
from dotenv import load_dotenv
env_path="C:/edemco/edemco-backend-python/.env"
load_dotenv(env_path)
app = Flask(__name__)
CORS(app)


@cross_origin
@app.route("/api/generar_template", methods=["POST"])
def api():
    try:
        # Obtener el token del encabezado 'Authorization'
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            response = {"status-code": 400,
                        "error": "Authorization header is missing"}
            return jsonify(response), 400

        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = auth_header

        SECRET = os.getenv("SECRET_KEY")
        # Decodificar el token
        decoded_secret = base64.urlsafe_b64decode(
            SECRET + "=" * (-len(SECRET) % 4))
        decoded = jwt.decode(
            token,
            decoded_secret,
            algorithms=["HS256"],
            options={"verify_signature": False},
        )

        password = decoded.get("password")
        correo = decoded.get("sub")

        # Obtener los datos del cuerpo de la solicitud en formato JSON
        data = request.get_json()
        if data is None:
            response = {"status-code": 400, "error": "No JSON received"}
            return jsonify(response), 400

        # Comprobar que data es una lista
        if not isinstance(data, list):
            response = {
                "status-code": 400,
                "error": "JSON should be an array of objects",
            }
            return jsonify(response), 400

        microservice = microservice_factura()

        # Procesar cada objeto en el array
        for item in data:
            required_keys = [
                "cod_planta",
                "fecha_inicio",
                "fecha_fin",
                "dias_consumo",
                "consumo_actual",
                "consumo_acumulado",
                "concepto_facturado",
                "cantidad",
                "costo_unidad",
                "valor_total",
                "fecha_pago",
                "factura_mes",
                "numero_factura",
                "contrato_no",
                "ahorro_actual",
                "ahorro_acumulado",
                "periodo_actual",  # ahorro_codos_actual
                "periodo_acumulado",  # ahorro_codos_acumulado
                "cufe",
                "fecha_cufe",
            ]

            # Verificar que todas las claves requeridas están presentes en el objeto
            for key in required_keys:
                if key not in item:
                    response = {
                        "status-code": 400,
                        "error": f"Missing required field: {key}",
                    }
                    return jsonify(response), 400

            cod_planta = item.get("cod_planta")
            fechaIni = item.get("fecha_inicio")
            fechaFin = item.get("fecha_fin")
            diasConsumo = item.get("dias_consumo")
            consumoActual = item.get("consumo_actual")
            consumoAcumulado = item.get("consumo_acumulado")
            conceptoFacturado = item.get("concepto_facturado")
            Cantidad = item.get("cantidad")
            costoUnidad = item.get("costo_unidad")
            valorTotal = item.get("valor_total")
            fechaPago = item.get("fecha_pago")
            facturaMes = item.get("factura_mes")
            facturaNo = item.get("numero_factura")
            contratoNo = item.get("contrato_no")
            ahorroActual = item.get("ahorro_actual")
            ahorroAcumulado = item.get("ahorro_acumulado")
            periodoActual = item.get("periodo_actual")
            periodoAcumulado = item.get("periodo_acumulado")
            CUFE = item.get("cufe")
            fechaCUFE = item.get("fecha_cufe")

            # Llamar al método del microservicio
            microservice.seleccion_template(
                cod_planta,
                fechaIni,
                fechaFin,
                diasConsumo,
                consumoActual,
                consumoAcumulado,
                conceptoFacturado,
                Cantidad,
                costoUnidad,
                valorTotal,
                fechaPago,
                facturaMes,
                facturaNo,
                contratoNo,
                ahorroActual,
                ahorroAcumulado,
                periodoActual,
                periodoAcumulado,
                CUFE,
                fechaCUFE,
            )

            microservice_email.ejecucion(cod_planta, correo, password)

        response = {"status-code": 200,
                    "message": "Data processed successfully"}
        return jsonify(response), 200

    except Exception as e:
        response = {"status-code": 500, "error": str(e)}
        return jsonify(response), 500


@cross_origin
@app.route("/api/generar_template/prueba", methods=["POST"])
def apiPrueba():
    try:
        print("HOLA- ESTO ES UNA PRUEBA DE EMAIL CON GRAPH(AZURE PORTAL PERMISSION)")
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            response = {"status-code": 400,
                        "error": "Authorization header is missing"}
            return jsonify(response), 400
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = auth_header
        SECRET = os.getenv("SECRET_KEY")
        # Decodificar el token
        decoded_secret = base64.urlsafe_b64decode(
            SECRET + "=" * (-len(SECRET) % 4))
        decoded = jwt.decode(
            token,
            decoded_secret,
            algorithms=["HS256"],
            options={"verify_signature": False},
        )
        authorization = decoded.get("authorizationToken")
        headers = {
            "Authorization": f'Bearer {authorization}'
        }

    # Obtener los datos del cuerpo de la solicitud en formato JSON
        data = request.get_json()
        if data is None:
            response = {"status-code": 400, "error": "No JSON received"}
            return jsonify(response), 400

        # Comprobar que data es una lista
        if not isinstance(data, list):
            response = {
                "status-code": 400,
                "error": "JSON should be an array of objects",
            }
            return jsonify(response), 400

        microservice = microservice_factura()
        # Procesar cada objeto en el array
        for item in data:
            required_keys = [
                "cod_planta",
                "fecha_inicio",
                "fecha_fin",
                "dias_consumo",
                "consumo_actual",
                "consumo_acumulado",
                "concepto_facturado",
                "cantidad",
                "costo_unidad",
                "valor_total",
                "fecha_pago",
                "factura_mes",
                "numero_factura",
                "contrato_no",
                "ahorro_actual",
                "ahorro_acumulado",
                "periodo_actual",  # ahorro_codos_actual
                "periodo_acumulado",  # ahorro_codos_acumulado
                "cufe",
                "fecha_cufe",
            ]

            # Verificar que todas las claves requeridas están presentes en el objeto
            for key in required_keys:
                if key not in item:
                    response = {
                        "status-code": 400,
                        "error": f"Missing required field: {key}",
                    }
                    return jsonify(response), 400

            cod_planta = item.get("cod_planta")
            fechaIni = item.get("fecha_inicio")
            fechaFin = item.get("fecha_fin")
            diasConsumo = item.get("dias_consumo")
            consumoActual = item.get("consumo_actual")
            consumoAcumulado = item.get("consumo_acumulado")
            conceptoFacturado = item.get("concepto_facturado")
            Cantidad = item.get("cantidad")
            costoUnidad = item.get("costo_unidad")
            valorTotal = item.get("valor_total")
            fechaPago = item.get("fecha_pago")
            facturaMes = item.get("factura_mes")
            facturaNo = item.get("numero_factura")
            contratoNo = item.get("contrato_no")
            ahorroActual = item.get("ahorro_actual")
            ahorroAcumulado = item.get("ahorro_acumulado")
            periodoActual = item.get("periodo_actual")
            periodoAcumulado = item.get("periodo_acumulado")
            CUFE = item.get("cufe")
            fechaCUFE = item.get("fecha_cufe")

            # # Llamar al método del microservicio
            # microservice.seleccion_template(
            #     cod_planta,
            #     fechaIni,
            #     fechaFin,
            #     diasConsumo,
            #     consumoActual,
            #     consumoAcumulado,
            #     conceptoFacturado,
            #     Cantidad,
            #     costoUnidad,
            #     valorTotal,
            #     fechaPago,
            #     facturaMes,
            #     facturaNo,
            #     contratoNo,
            #     ahorroActual,
            #     ahorroAcumulado,
            #     periodoActual,
            #     periodoAcumulado,
            #     CUFE,
            #     fechaCUFE,
            # )

            microservice_email.prueba(cod_planta,headers)
        
        
        # attachments = []
        # image=[]
        # with open('C:\\Users\\jose.romero\\OneDrive - EDEMCO S.A.S\\Escritorio\\Doc\\imagen.png','rb') as png:
        #     img64=base64.b64encode(png.read()).decode("utf-8")
        #     image.append(
        #         {
        #             "@odata.type":"#microsoft.graph.fileAttachment",
        #             "name":"image.png",
        #             "contentId":"image1",
        #             "isInline":True,
        #             "contentBytes":img64
        #         }
        #     )
        # with open('C:\\PandasPY\\PruebaAutomatizacionExcel\\Excels\\Excel1.xlsx', 'rb') as file:
        #     # se obtiene el type para el envio en correo
        #     mime_type = mimetypes.guess_type(file.name)
        #     file_content = file.read()
        #     base64_encode = base64.b64encode(file_content)
        #     attachments.append({
        #         "@odata.type": "#microsoft.graph.fileAttachment",
        #         "name": file.name.split("\\")[-1],
        #         "contentType": mime_type[0],
        #         "contentBytes": str(base64_encode).split("b'")[1].replace('\'','')
        #     })
        # message = {
        #     "message": {
        #         "subject": "Correo desde microservicio Python",
        #         "body": {
        #             "contentType": "HTML",
        #             "content": '<img src="cid:image1" alt="Factura">'
        #         },
        #         "toRecipients": [
        #             {
        #                 "emailAddress": {
        #                     "address": "jose.romero@edemco.co"
        #                 }
        #             }
        #         ]
        #         ,
        #         "attachments": [*attachments,*image
        #         ]
        #     }
        # }

        return "response", 200
    except Exception as e:
        print(str(e))
        response = {"status-code": 500, "error": str(e)}
        return jsonify(response), 500


if __name__ == "__main__":
    app.run(debug=True, port=8091)
