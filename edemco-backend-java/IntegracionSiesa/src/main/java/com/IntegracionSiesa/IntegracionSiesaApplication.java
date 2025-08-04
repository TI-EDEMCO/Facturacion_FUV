package com.IntegracionSiesa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import io.github.cdimascio.dotenv.Dotenv;

@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class IntegracionSiesaApplication {

	public static void main(String[] args) {
		//Se cargan las variables de entorno (se pasan del env de Dotenv a propiedades del sistema)
		Dotenv env =Dotenv.configure().load();
		env.entries().forEach(entries->System.setProperty(entries.getKey(),entries.getValue()));
		SpringApplication.run(IntegracionSiesaApplication.class, args);
	}

}
