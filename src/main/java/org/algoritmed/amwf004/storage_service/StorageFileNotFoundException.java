package org.algoritmed.amwf004.storage_service;

public class StorageFileNotFoundException extends StorageException{

    public StorageFileNotFoundException(String message) {
        super(message);
    }

	public StorageFileNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}
