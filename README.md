<div style="text-align:center">

# Proyecto para la Automatización de Edemco

<div style="width:320px;margin:auto">

![Logo oficial de Edemco](./edemco-frontend-react/public/Logo-removebg-preview.png)

</div>

</div>

<details style="font-size:1.2rem">
<summary style="font-size:1.5rem;font-weight:bold">Tabla de contenidos</summary>

- [Backend](#backend)

  - [Java](#java)
  - [Python](#python)

- [Frontend](#frontend)

- [Variables de entorno](#uso-de-variables-de-entorno)
- [Virtual Envoronment](#virtual-environment)

</details>

## Proyecto edemco

- [Diagrama de flujo edemco](https://excalidraw.com/#room=afa1a9ae958201ddddbc,gJy30kOFJ6QPT8EbcXmQ1g)

## Backend

El Backend está desarrollado con una arquitectura de microservicios

### Java

1. Puertos de los microservicios en Java
    - microservice-security: 8050
    - microservice-factura: 8060
    - microservice-remitentes: 8070
    - microservice-gateway: 8080
    - microservice-eureka: 8761
    - microservice-config: 8888
    - microservice-facturacion-especial: 9081
    - microservice-integracion: 9090
    - microservice-operadores: 9091
    - microservice-generation: 9092

### Python
1. Puertos de los microservicios de Python
   - microservice_historic-factories: 8090
   - microservice_template-facturas: 8091
   - microservice_get-invoice: 8092
   - microservice_upload-file: 8093
   - microservice_growatt-generation: 8094


## Frontend

El Frontend está desarrollado en ReactJS con atomic design

### Instalación Front

1. Instala los paquetes de NPM

```sh
npm install
```

2. Ejecuta el proyecto
```sh
#desarrollo:
npm run dev
#produccion npm run serve
```

## Uso de variables de entorno 
Para la ejecucion del proyecto se deben tener varias cosas en cuenta, como variables de entorno, certificados SSL 

1. variables de entorno en microservicios de java, debe seguir la siguiente estructura y ubicarce en la misma ruta que el archivo .jar compilado (utilizando maven):
```
#VARIABLES GENERALES (utilizar http o https dependiendo de la configuracion)
IP_PROTOCOL_SERVE="http(s)://10.2..."
IP_SERVER="10.2...."
URL_FRONT="http(s)://frontend:5173/principal"

#VARIABLES PARA CERTIFICADO SSL EN FORMATO PKCS#12
KEY_RELATIVE_PATH="C:\ubicacion de certificado\ certificado.p12"
KEY_PASSWORD="PASSWORD DEL CERTIFICADO"
KEY_ALIAS="ALIAS DE CERTIFICADO"

#VARIABLES DE BD
SQL_URL="jdbc:sqlserver://IP_DB:PORT_BD;encrypt=true;trustServerCertificate=true;databaseName=NAME_BD"
SQL_USER_NAME="USUARIO_BD"
SQL_PASSWORD="PASSWORD_BD"

#VARIABLES PARA CONECCION CON SIESA
CONNI_TOKEN="..."
CONNI_KEY="..."


#SECRET KEY
SECRET_KEY="..."
#VARIABLES PARA INICIO DE SESSION 
CLIENT_ID="..."
CLIENT_SECRET="..."
```

2. variables de entorno en microservicios de python, deben seguir la siguiente estructura y su ruta de ubicacion se debe modificar en los archivos donde se utilizan variables de entorno:
- microservice_get-invoices: cufe.py--get_invoices.py
- microservice_template-facturas: connection_db.py--email_file.py--main.py
- microservice_historic-factories: conexionbd.py
- microservice_growatt-generation: microservice_1.py
```
#URL BD
SQL_URL="mssql+pyodbc://${USER_BD}:${PASSWORD_DB}@${IP_DB}/${NAME_BD}?driver=ODBC+Driver+17+for+SQL+Server"
SQL_URL_PYODBC="DRIVER={ODBC Driver 17 for SQL Server};SERVER=${IP_BD};DATABASE=${NAME_BD};UID=${USER_BD};PWD=${PASSWORD_BD}"

#SECRET KEY
SECRET_KEY="..."

#PROTOCOLO Y IP QUE SE UTILIZARA PARA CONSULTAS INTERNAS
IP_PROTOCOL_SERVE="http(s)://localhost"
CORREOS_FACTURAS="correo1@mail.co,email2@mail.co"

#GROWATT
USER_NAME="${USER GROWATT}"
PASSWORD="${PASSWORD GROWATT}"

#CORREOS DE CONTABILIDAD, UNA LISTA 
EMAILSCONTABILIDAD="correo1@mail.co,correo2@mail.co.correo3@...."

#CORREO GENERAL
USER_MAIL="correoG@mail.co"
PASSWORD_MAIL="PasswordMailGeneral"
```
3. variables de entorno en front end (seguir de ejemplo el .env.example)

# Ejecucion de microservicios
## Java 
Para la ejecucion de microservicios de java, se debe tener los requisitos previos y ejecutar el archivo `Compilar-copiar.sh` ubicado en la carpeta `edemco-backend-java` el cual compila los microservicios y copia el archivo .jar dentro de una ruta de la carpeta `compilados-edemco`, esta ruta se puede modificar en el archivo dependiendo de donde se instalo el repositorio.
Una vez complilados, dirigirse a la carpeta `compilados-edemco` y ejecutar el archivo `ejecutable-java.sh` que ejecuta los servicios compilados de java, se debe modificar este archivo para modificar la ip de donde se este ejecutando, este archivo mata cualquier tarea que este ocupando los puertos designados. Recuerde que el archivo con las variables de entorno de JAVA debe estar tambien dentro de esta carpeta.

## Python
el archivo main.py que se encuentra fuera de los ubicaciones de los microservicios es el encargado de ejecutar los microservicios, se debe modificar en para utilizar la ubicacion del entorno virtual a utilizar (se recomienda ubicarlo en la raiz):
```
├───venv
├───microservice_get-inoices
├───microservice_growatt-generation
├───microservice_historic-factories
├───microservice_template-factura
├───microservice_upload-file
├───.env
└───main.py

```
## Virtual Environment

El entorno virtual se debe crear en la raiz de la carpeta `edemco-backend-python`, se debe tener instalado de manera global la dependencia virtualenv o intalarla con la sigueinte linea
```
pip install virtualenv
```
Se debe crear e instalar las dependencias encontradas en el `requirements.txt`
```
#crear el entorno
py -m virtualenv venv

#iniciar el entorno
venv\scripts\activate

#instalar dependencias
pip install -r requirements.txt

```
