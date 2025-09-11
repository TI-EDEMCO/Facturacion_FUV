package com.microservice.generation.service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.microservice.generation.client.FacturacionEspecialClient;
import com.microservice.generation.client.IntegracionSiesaClient;
import com.microservice.generation.client.OperadorClient;
import com.microservice.generation.controller.sto.OperadorDto;
import com.microservice.generation.controller.sto.TarifaOperadorDto;
import com.microservice.generation.dto.DatosGeneracionDTO;
import com.microservice.generation.dto.DatosGeneracionExistentesDTO;
import com.microservice.generation.dto.GeneratorDTO;
import com.microservice.generation.dto.PlantasListDTO;
import com.microservice.generation.dto.ValorUnidadDTO;
import com.microservice.generation.entities.Generator;
import com.microservice.generation.persistence.GeneratorRepository;

@Service
public class GeneratorServiceImpl implements IGeneratorService {


    @Autowired
    private GeneratorRepository generatorRepository;

    @Autowired
    private IntegracionSiesaClient integracionSiesaClient;

    @Autowired
    private OperadorClient operadorClient;

    @Autowired
    private FacturacionEspecialClient facturacionEspecialClient;

    @Override
    public Double findGeneracionAcumuladaByDateAndPlanta(Integer anio, Integer mes, String planta) {
        return generatorRepository.findGeneracionAcumuladaByDateAndPlanta(anio, mes, planta);
    }

    @Override
    public Double findAhorroCodosAcumuladoByDateAndPlanta(Integer anio, Integer mes, String planta) {
        return generatorRepository.findAhorroCodosAcumuladoByDateAndPlanta(anio, mes, planta);
    }

    @Override
    public Double findAhorroAcumuladoByDateAndPlanta(Integer anio, Integer mes, String planta) {
        return generatorRepository.findAhorroAcumuladoByDateAndPlanta(anio, mes, planta);
    }

    @Override
    public GeneratorDTO findAllGeneracionData(Integer anio, Integer mes, String planta){
        return generatorRepository.findAllGeneracionData(anio, mes, planta);
    }

    @Override
    public ResponseEntity<?> calculate(List<DatosGeneracionDTO> datosGeneracionDTOList) throws Exception {
        for (int i = 0; i <= datosGeneracionDTOList.size() - 1; i++) {
            int mesActual = datosGeneracionDTOList.get(i).getFechaFactura().getMonthValue();
            Integer anio = datosGeneracionDTOList.get(i).getFechaFactura().getYear();

            // Obtener el nombre de la planta y verificar si está vacío o tiene valor 0
            String nombrePlanta = datosGeneracionDTOList.get(i).getPlantName();
            Double generacionActual = datosGeneracionDTOList.get(i).getMonthlyCumulativePowerGeneration();

            // Si la planta está vacía o la generación es 0, continuar con el siguiente elemento
            if (nombrePlanta == null || nombrePlanta.isEmpty() || generacionActual == null || generacionActual == 0) {
                System.out.println("Planta vacía o sin generación, se omite: " + nombrePlanta);
                continue;
            }

            if (!nombrePlanta.equals("Sede Edemco")) {
                String idPlanta = findIdPlantaByNombrePlanta(nombrePlanta);
                if (idPlanta == null) {
                    System.out.println("No se encontró la planta con el nombre: " + nombrePlanta);
                    continue;
                }

                if (!findGenerationsByDate(anio, mesActual, idPlanta).isEmpty()) {
                    continue;
                }

                Long idOperador = findIdOperadorByIdPlanta(idPlanta);
                TarifaOperadorDto tarifaOperadorDto = getTarifaOperadorByOperadorId(idOperador, mesActual);
                Double tarifaOperador = tarifaOperadorDto.getTarifaOperador();
                Double valorUnidad = findValorUnidadByIdPlanta(idPlanta);
                Double diferencia = tarifaOperador - valorUnidad;

                Double generacionAcumulada = generatorRepository.findGeneracionAcumuladaByDateAndPlanta(anio, mesActual - 1, idPlanta);
                if (generacionAcumulada != null) {
                    generacionAcumulada = generacionAcumulada + generacionActual;
                } else {
                    generacionAcumulada = generacionActual;
                }

                Double valorTotal = 0.0;
                try {
                    System.out.println(nombrePlanta);
                    if (Objects.equals(checkFacturacionEspecial(idPlanta), idPlanta) && checkFacturacionEspecial(idPlanta) != null) {
                        Float cantidadKwh = findCantidadKWhByIdPlantaAndDate(idPlanta, anio, mesActual);
                        if (cantidadKwh==null){
                            continue;
                        }
                        System.out.println(generacionActual - cantidadKwh);
                        valorTotal = (generacionActual - cantidadKwh) * valorUnidad;
                    } else {
                        valorTotal = generacionActual * valorUnidad;
                    }
                } catch (Exception e) {
                    throw new Exception(e.getMessage());
                }

                Double ahorroActual = diferencia * generacionActual;

                Double ahorroAcumulado = generatorRepository.findAhorroAcumuladoByDateAndPlanta(anio, mesActual - 1, idPlanta);
                if (ahorroAcumulado != null) {
                    ahorroAcumulado = ahorroAcumulado + ahorroActual;
                } else {
                    ahorroAcumulado = ahorroActual;
                }

                Double ahorroCodosActual = generacionActual * 0.504;
                Double ahorroCodosAcumulado = generatorRepository.findAhorroCodosAcumuladoByDateAndPlanta(anio, mesActual - 1, idPlanta);
                if (ahorroCodosAcumulado != null) {
                    ahorroCodosAcumulado = ahorroCodosAcumulado + ahorroCodosActual;
                } else {
                    ahorroCodosAcumulado = ahorroCodosActual;
                }

                Generator generator = new Generator();
                generator.setAhorroActual(ahorroActual);
                generator.setAhorroAcumulado(ahorroAcumulado);
                generator.setAhorroCodosActual(ahorroCodosActual);
                generator.setAhorroCodosAcumulado(ahorroCodosAcumulado);
                generator.setAnio(anio);
                generator.setDiferenciaTarifa(diferencia);
                generator.setGeneracionActual(generacionActual);
                generator.setGeneracionAcumulado(generacionAcumulada);
                generator.setMes(mesActual);
                generator.setValorUnidad(valorUnidad);
                generator.setValorTotal(valorTotal);
                generator.setIdTarifaOperador(tarifaOperadorDto.getIdTarifa());
                generator.setIdPlanta(idPlanta);
                generatorRepository.save(generator);
            }
        }
        return ResponseEntity.ok("Datos procesados correctamente");
    }

    @Override
    public ResponseEntity<?> modifyGeneration(List<DatosGeneracionExistentesDTO> datosGeneracionExistentesDTOsList) throws Exception {
        return ResponseEntity.ok("Buena url");
    }

    @Override
    public ResponseEntity<?> findAllGeneration(List<PlantasListDTO> plantasListDTOsList) throws Exception {
        List<Map<String,Object>> informacion=new ArrayList<>();
        for (int i=0;i<=plantasListDTOsList.size()-1;i++){
            PlantasListDTO plantaActual=plantasListDTOsList.get(i);
            String id_planta=plantaActual.getId_planta();
            Integer mes=plantaActual.getMes();
            Integer anio=plantaActual.getAnio();
            List<GeneratorDTO> generacionPlanta=findGenerationsByDate(anio,mes,id_planta);
            Map<String,Object> registro=new HashMap<>();
            DecimalFormat df=new DecimalFormat("#.##");
            String NombrePlanta=findNombrePlantaByIdPlanta(id_planta);
            registro.put("NombrePlanta", NombrePlanta);
            registro.put("id_generacion", generacionPlanta.get(0).getIdGeneracion());
            registro.put("generacion_actual", df.format(generacionPlanta.get(0).getGeneracionActual()));
            registro.put("generacion_acumulado", df.format(generacionPlanta.get(0).getGeneracionAcumulado()));
            registro.put("valor_unidad", df.format(generacionPlanta.get(0).getValorUnidad()));
            registro.put("valor_total", df.format(generacionPlanta.get(0).getValorTotal()));
            registro.put("diferencia_tarifa", df.format(generacionPlanta.get(0).getDiferenciaTarifa()));
            registro.put("ahorro_actual", df.format(generacionPlanta.get(0).getAhorroActual()));
            registro.put("ahorro_acumulado", df.format(generacionPlanta.get(0).getAhorroAcumulado()));
            registro.put("ahorro_codos_actual", df.format(generacionPlanta.get(0).getAhorroCodosActual()));
            registro.put("ahorro_codos_acumulado", df.format(generacionPlanta.get(0).getAhorroCodosAcumulado()));
            informacion.add(registro);
        }
        return ResponseEntity.ok(informacion);

    }

    @Override
    public List<Generator> findAll() {
        return (List<Generator>) generatorRepository.findAll();
    }

    @Override
    public void save(Generator generator) {
        generatorRepository.save(generator);
    }

    @Override
    public ValorUnidadDTO findLastValorUnidad() {
        return generatorRepository.findLastValorUnidad();
    }

    @Override
    public List<GeneratorDTO> findGenerationsByDate(Integer anio, Integer mes) {
        return List.of();
    }

    public List<GeneratorDTO> findGenerationsByDate(Integer anio, Integer mes, String planta) {
        return generatorRepository.findGenerationsByDate(anio, mes, planta);
    }

    @Override
    public String findIdPlantaByNombrePlanta(String nombrePlanta) {
        return integracionSiesaClient.findIdPlantaByNombrePlanta(nombrePlanta);
    }

    @Override
    public String findNombrePlantaByIdPlanta(String idPlanta) {
        return integracionSiesaClient.findNombrePlantaByIdPlanta(idPlanta);
    }

    @Override
    public Double findGeneracionActualByIdPlantaAndDate(Integer anio, Integer mes, String planta) {
        return generatorRepository.findGeneracionActualByIdPlantaAndDate(anio, mes, planta);
    }

    @Override
    public Long findIdOperadorByIdPlanta(String idPlanta) {
        return integracionSiesaClient.findIdOperadorByIdPlanta(idPlanta);
    }

    @Override
    public OperadorDto getOperadorById(Long idOperador) {
        return operadorClient.getOperadorById(idOperador);
    }

    @Override
    public TarifaOperadorDto getTarifaOperadorByOperadorId(Long idOperador, Integer mes) {
        return operadorClient.findTarifaOperadorByIdOperadorAndMonth(idOperador,mes);
    }

    @Override
    public Double findValorUnidadByIdPlanta(String idPlanta) {
        return integracionSiesaClient.findValorUnidadByIdPlanta(idPlanta);
    }

    @Override
    public Double findValorTotalByIdPlantaAndDate(Integer anio, Integer mes, String planta) {
        return generatorRepository.findValorTotalByIdPlantaAndDate(anio, mes, planta);
    }

    @Override
    public String checkFacturacionEspecial(String idPlanta) throws Exception {
        return integracionSiesaClient.checkFacturacionEspecial(idPlanta);
    }

    @Override
    public Float findCantidadKWhByIdPlantaAndDate(String idPlanta, Integer anio, Integer mes) throws Exception {
        return facturacionEspecialClient.findCantidadKWhByIdPlantaAndDate(idPlanta,anio,mes);
    }


}
