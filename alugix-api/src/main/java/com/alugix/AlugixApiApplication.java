package com.alugix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AlugixApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlugixApiApplication.class, args);
	}

}
