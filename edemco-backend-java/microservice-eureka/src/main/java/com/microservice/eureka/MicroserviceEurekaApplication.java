package com.microservice.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import io.github.cdimascio.dotenv.Dotenv;

@EnableEurekaServer
@SpringBootApplication
public class MicroserviceEurekaApplication {

	public static void main(String[] args) {
		Dotenv env =Dotenv.configure().load();
		env.entries().forEach(entries->System.setProperty(entries.getKey(),entries.getValue()));
		SpringApplication.run(MicroserviceEurekaApplication.class, args);
	}

}
