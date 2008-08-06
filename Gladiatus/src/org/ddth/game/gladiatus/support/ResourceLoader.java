package org.ddth.game.gladiatus.support;

import java.text.MessageFormat;
import java.util.MissingResourceException;
import java.util.ResourceBundle;

import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Display;

public class ResourceLoader {
	public static final String LANG_DEFAULT = "gladiatus_en";
	private static ResourceBundle resources;
	
	static {
		try {
			ResourceLoader.resources = ResourceBundle.getBundle(LANG_DEFAULT);
		}
		catch (MissingResourceException e) {
			// Empty
		}
	}

	public Image getImage(String path) {
		return new Image(Display.getCurrent(), ResourceLoader.class.getResourceAsStream(path));
	}
	
	/**
	 * Loads a string from a resource file using a key. If the key does not
	 * exist, it is used as the result.
	 * 
	 * @param key
	 *            the name of the string resource
	 * @return the string resource
	 */
	public static String getMessage(String key) {
		if (resources == null)
			return key;
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
	public static String getMessage(String key, Object[] args) {
		return MessageFormat.format(getMessage(key), args);
	}
}
