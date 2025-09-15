package com.microservice.generation.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class PlantasListDTO {
    
    public String id_planta;
    public Integer anio;
    public Integer mes;
}
