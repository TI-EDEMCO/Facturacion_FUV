package com.microservice.generation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import io.github.cdimascio.dotenv.Dotenv;

@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class Application {

	public static void main(String[] args) {
		Dotenv env =Dotenv.configure().load();
		env.entries().forEach(entries->System.setProperty(entries.getKey(),entries.getValue()));
		SpringApplication.run(Application.class, args);
	}

}
