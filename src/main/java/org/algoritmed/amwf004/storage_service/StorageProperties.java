package org.algoritmed.amwf004.storage_service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StorageProperties {
    @Value("${storage.location}")
	private String location = "upload-dir2";

	public String getLocation() {
		return location;
	}

}
