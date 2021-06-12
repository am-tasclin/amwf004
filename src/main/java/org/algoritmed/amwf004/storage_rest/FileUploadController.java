package org.algoritmed.amwf004.storage_rest;

import java.io.IOException;
import java.util.stream.Collectors;

import org.algoritmed.amwf004.storage_service.StorageFileNotFoundException;
import org.algoritmed.amwf004.storage_service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class FileUploadController {
    protected static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
	private final StorageService storageService;

	@Autowired
	public FileUploadController(StorageService storageService) {
		this.storageService = storageService;
	}
    @GetMapping("/r/storagem")
	public @ResponseBody ModelMap storageModel() throws IOException {
		logger.info("\n--39-- / - listUploadedFiles");
		ModelMap model = new ModelMap();
		model.addAttribute("files",
				storageService.loadAll()
						.map(path -> MvcUriComponentsBuilder
								.fromMethodName(FileUploadController.class, "serveFile", path.getFileName().toString())
								.build().toUri().toString())
						.collect(Collectors.toList()));

		return model;
	}
    @GetMapping("/r/storage")
	public String listUploadedFiles(Model model) throws IOException {
		logger.info("\n--39-- / - listUploadedFiles");
		model.addAttribute("files",
				storageService.loadAll()
						.map(path -> MvcUriComponentsBuilder
								.fromMethodName(FileUploadController.class, "serveFile", path.getFileName().toString())
								.build().toUri().toString())
						.collect(Collectors.toList()));

		return "uploadForm";
	}

	@GetMapping("/r/storage/files/{filename:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
		logger.info("\n--39-- /files/{filename:.+} - serveFile");

		Resource file = storageService.loadAsResource(filename);
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
				.body(file);
	}

	@PostMapping("/r/storagem")
	public ResponseEntity handleFileUploadStorageM(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
		logger.info("\n--75-- /r/storagem - handleFileUpload POST");
		storageService.store(file);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");
		return ResponseEntity.ok(HttpStatus.OK);
	}

	@PostMapping("/r/storage")
	public String handleFileUpload(@RequestParam("file") MultipartFile file, RedirectAttributes redirectAttributes) {
		logger.info("\n--63-- /r/storagem - handleFileUpload POST");
		storageService.store(file);
		redirectAttributes.addFlashAttribute("message",
				"You successfully uploaded " + file.getOriginalFilename() + "!");

		return "redirect:/r/storage";
	}

	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}

}
