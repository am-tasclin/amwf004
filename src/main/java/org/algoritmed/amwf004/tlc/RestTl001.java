package org.algoritmed.amwf004.tlc;

import java.util.HashMap;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RestTl001 {
	@GetMapping("/v/f2")
	public String f2(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
		model.addAttribute("name", name);
		return "v/f2";
	}
	@GetMapping("/v/f1")
	public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
		model.addAttribute("name", name);
		HashMap<Object, Object> hashMap = new HashMap<>();
		
		return "v/f1";
	}
}
