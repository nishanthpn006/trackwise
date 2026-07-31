package com.trackwise.exception;

/**
 * DuplicateEmailException — Thrown when attempting to register an email address that already exists.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String message) {
        super(message);
    }
}
