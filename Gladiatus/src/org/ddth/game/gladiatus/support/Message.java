package org.ddth.game.gladiatus.support;

import java.text.MessageFormat;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

public class Message {
	public static final String LANG_ENGLISH = "gladiatus_en";
	public static final String LANG_VIETNAMESE = "gladiatus_vi";
	
	private static Message instance = new Message();
	
	private ResourceBundle resources;
	
	private Message() {
		setLanguage(LANG_ENGLISH);
	}
	
	public static Message getInstance() {
		return instance;
	}
	
	/**
	 * Change the language
	 * 
	 * @param language
	 */
	public void setLanguage(String language) {
		try {
			resources = ResourceBundle.getBundle(language);
		}
		catch (MissingResourceException e) {
			// Empty
		}
	}
	/**
	 * Loads a string from a resource file using a key. If the key does not
	 * exist, it is used as the result.
	 * 
	 * @param key
	 *            the name of the string resource
	 * @return the string resource
	 */
	public String getMessage(String key) {
		if (resources == null) {
			return key;
		}
		try {
			return resources.getString(key);
		}
		catch (MissingResourceException e) {
			return key;
		}
	}

	/**
	 * Loads a string from a resource file using a key and formats it using
	 * MessageFormat. If the key does not exist, it is used as the argument to
	 * be format().
	 * 
	 * @param key
	 *            the name of the string resource
	 * @param args
	 *            the array of strings to substitute
	 * @return the string resource
	 */
	public String getMessage(String key, Object[] args) {
		return MessageFormat.format(getMessage(key), args);
	}
}
