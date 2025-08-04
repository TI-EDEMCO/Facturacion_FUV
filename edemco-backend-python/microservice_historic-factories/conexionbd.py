import pyodbc
import os
from dotenv import load_dotenv
env_file="C:/edemco/edemco-backend-python/.env"
load_dotenv(env_file)

class Conexion:
    @staticmethod
    def conectar():
        try:
            # Credenciales de conexión y rutas para SQL Server
            connection = pyodbc.connect(os.getenv("SQL_URL_PYODBC"))
        except Exception as ex:
            print(ex)

        # Creamos el cursor para manipular consultas en nuestra base de datos
        cur = connection.cursor()
        return cur
