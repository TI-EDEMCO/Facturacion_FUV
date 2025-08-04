import { createBrowserRouter } from 'react-router-dom'

import EnviarEmails from './components/pages/EnviarEmails/EnviarEmails.jsx'
import Facturacion from './components/pages/Facturacion/Facturacion.jsx'
import FacturacionEspecial from './components/pages/FacturacionEspecial/FacturacionEspecial.jsx'
import Historicos from './components/pages/Historicos/Historicos.jsx'
import Home from './components/pages/Home/Home.jsx'
import IniciarFactura from './components/pages/IniciarFactura/IniciarFactura.jsx'
import Layout from './Layout.jsx'
import Login from './components/pages/Login/Login.jsx'
import NotFound404 from './components/pages/NotFound404/NotFound404.jsx'
import Plantas from './components/pages/Plantas/Plantas.jsx'
import ProtectedRoute from './components/layouts/ProtectedRoute/ProtectedRoute.jsx'
import Register from './components/pages/Register/Register.jsx'
import TarifaOperadores from './components/pages/TarifaOperadores/TarifaOperadores.jsx'
import VisualizacionArchivos from './components/pages/VisualizacionArchivos/VisualizacionArchivos.jsx'

/*
* Configuración de Rutas
*
* Función:
* Define las rutas de la aplicación utilizando `react-router-dom`.
*
* Estructura principal:
* - `/`: Página de inicio de sesión (`Login`).
* - `/register`: Página de registro (`Register`).
* - `/principal`: Ruta protegida con `ProtectedRoute`, que incluye las siguientes subrutas:
*   - `/principal`: Página principal (`Home`).
*   - `/principal/facturacion`: Facturación general (`Facturacion`).
*   - `/principal/tarifa-operadores`: Gestión de tarifas de operadores (`TarifaOperadores`).
*   - `/principal/facturacion-especial`: Facturación especial (`FacturacionEspecial`).
*   - `/principal/iniciar-factura`: Inicio del proceso de facturación (`IniciarFactura`).
*   - `/principal/plantas`: Gestión de plantas (`Plantas`).
*   - `/principal/enviar-emails`: Envío de correos electrónicos (`EnviarEmails`).
*   - `/principal/historicos`: Historial de datos (`Historicos`).
*   - `/principal/visualizacion-archivos`: Visualización de reportes (`VisualizacionArchivos`).
*
* Manejo de errores:
* - `NotFound404`: Página de error para rutas no encontradas.
*
* Ejemplo de uso:
* Se utiliza como proveedor en `RouterProvider` para gestionar las rutas de la aplicación.
*/


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <NotFound404 />
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <NotFound404 />
  },
  {
    path: '/principal',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <Layout />,
        children: [
          {
            path: '',
            element: <Home />
          },
          {
            path: 'facturacion',
            element: <Facturacion />
          },
          {
            path: 'tarifa-operadores',
            element: <TarifaOperadores />
          },
          {
            path: 'facturacion-especial',
            element: <FacturacionEspecial />
          },
          {
            path: 'iniciar-factura',
            element: <IniciarFactura />
          },
          {
            path: 'plantas',
            element: <Plantas />
          },
          {
            path: 'enviar-emails',
            element: <EnviarEmails />
          },
          {
            path: 'historicos',
            element: <Historicos />
          },
          {
            path: 'visualizacion-archivos',
            element: <VisualizacionArchivos />
          }
        ]
      }
    ],
    errorElement: <NotFound404 />
  }
])
