import pyodbc
import os
from dotenv import load_dotenv
env_file="C:/edemco/edemco-backend-python/.env"
load_dotenv(env_file)

#Prueba para conectar la bd
class connection_db():

    
# Inicialización del objeto antes de establecer conexión a la db
   def __init__(self):
         self.conn = None
         self.cursor = None

# Configuración de la conexión a la base de datos
   def connect_db(self):
        try:
            conn_str = os.getenv("SQL_URL_PYODBC")
            self.conn = pyodbc.connect(conn_str)
            self.cursor = self.conn.cursor()
        except Exception as e:
            print(f"Error al conectar a la base de datos: {e}")

# Cerrar conexión y cursor de la base de datos
   def close_db(self):
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()

# Ejecutar y obtener consultas
   def query_values_db(self, query):
        try:
            self.connect_db()
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            return result if result else None
        except Exception as e:
            print(f"Hubo un error en la consulta: {e}")
            return None
        finally:
            self.close_db()