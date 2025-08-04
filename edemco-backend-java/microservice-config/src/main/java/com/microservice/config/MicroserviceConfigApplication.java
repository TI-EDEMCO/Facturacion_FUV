package com.microservice.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import io.github.cdimascio.dotenv.Dotenv;
@EnableConfigServer
@SpringBootApplication
public class MicroserviceConfigApplication {

	public static void main(String[] args) {
		Dotenv env =Dotenv.configure().load();
		env.entries().forEach(entries->System.setProperty(entries.getKey(),entries.getValue()));
		SpringApplication.run(MicroserviceConfigApplication.class, args);
	}

}
