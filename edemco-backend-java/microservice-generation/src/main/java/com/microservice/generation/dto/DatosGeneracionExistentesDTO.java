package com.microservice.generation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DatosGeneracionExistentesDTO {
    private Long idGeneracion;
    private Double valorGeneracion;
}
