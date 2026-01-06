
from process3 import AbstractAPI
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
class Microservice_3(AbstractAPI):
    def CheckFile(self):
        now = datetime.now()
        monthLast = now - relativedelta(months=2)
        previousMonth = monthLast.strftime("%B")
        formatDate = monthLast.strftime("%Y-%m")

        # Carpeta relativa donde se guardarán las descargas en el contenedor
        download_dir = "C:\\Users\\usuario\\Downloads"
        # download_dir = os.getenv("DOWNLOAD_DIR", "/downloads")  # Cambia "/app/downloads" a donde quieras que esté en el contenedor
        path_xlsx = f"{previousMonth}Generacion_{formatDate}.xls"

        File_Exist=os.path.isfile(os.path.join(download_dir, path_xlsx))

        return File_Exist