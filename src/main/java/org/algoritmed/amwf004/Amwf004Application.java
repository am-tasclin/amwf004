package org.algoritmed.amwf004;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@SpringBootApplication
@ImportResource("classpath:config-app-spring.xml")
public class Amwf004Application {

	public static void main(String[] args) {
		SpringApplication.run(Amwf004Application.class, args);
	}

}
