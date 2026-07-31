package com.trackwise.exception;

/**
 * ResourceNotFoundException — Thrown when a requested resource (Transaction, Category, User) does not exist or does not belong to the user.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
