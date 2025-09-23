

pathCompilados="C:\edemco--pruebas\compilados-edemco"

for dir in */ ; do

    #Endicar que microservicio esta compilando
    echo "================================="
    echo "compilando microservicio : $dir"
    echo "================================="

    #Entrar a la ruta del microservicio
    cd "$dir" || exit

    #Ejecitar el comando para compilar
    mvn clean package -DskipTests 

    #Copiar todos los archivos .jar en la capeta designada
    cp target/*.jar "$pathCompilados"

    #Volver a la raiz
    cd ..
done
echo "================================="
echo "SE TERMINO DE COMPILAR LOS MICROSERVICIOS"
echo "================================="

sleep 10s
