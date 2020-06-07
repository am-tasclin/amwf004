package org.algoritmed.amwf004.amdb;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HtmlRest {
	@RequestMapping("/r/text")
	public String text() {
		return "Greetings from Spring Boot!";
	}
	@RequestMapping("/r/html001")
	public String html001() {
		return "<p>Greetings from <b>Spring Boot!</b></p>";
	}
}
