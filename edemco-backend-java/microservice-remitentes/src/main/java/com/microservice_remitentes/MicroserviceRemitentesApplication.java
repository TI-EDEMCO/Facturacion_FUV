package com.microservice_remitentes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableDiscoveryClient
public class MicroserviceRemitentesApplication {

	public static void main(String[] args) {
		Dotenv env =Dotenv.configure().load();
		env.entries().forEach(entries->System.setProperty(entries.getKey(),entries.getValue()));
		SpringApplication.run(MicroserviceRemitentesApplication.class, args);
	}

}
