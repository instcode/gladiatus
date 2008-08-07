package org.ddth.game.gladiatus.support;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;

import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.widgets.Display;

public class ResourceLoader {
	/**
	 * Map image names to images
	 */
	private static HashMap<String, Image> imageMap = new HashMap<String, Image>();
	private static ResourceLoader m_instance = null;

	private ResourceLoader() {
		// Singleton
	}

	public InputStream loadResource(ClassLoader classLoader, String sPath) {
		return classLoader.getResourceAsStream(sPath);
	}
	
	public static ResourceLoader getInstance() {
		if (m_instance == null) {
			m_instance = new ResourceLoader();
		}
		return m_instance;
	}

	public Image getImage(ClassLoader classLoader, String sPath) {
		Image image = imageMap.get(sPath);
		if (image == null) {
			InputStream inputStream = loadResource(classLoader, sPath);
			image = loadImage(inputStream);
			imageMap.put(sPath, image);
		}
		return image;
	}

	private Image loadImage(InputStream inputStream) {
		return new Image(Display.getCurrent(), inputStream);
	}
	
	/**
	 * Returns an image stored in the file at the specified path relative to the
	 * specified class
	 *
	 * @param clazz
	 *            Class The class relative to which to find the image
	 * @param path
	 *            String The path to the image file
	 * @return Image The image stored in the file at the specified path
	 */
	public Image loadImage(String path) {
		return new Image(Display.getCurrent(), getClass().getClassLoader().getResourceAsStream(path));
	}
	
	public byte[] readStream(InputStream inputStream) throws IOException {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		int tempSize = 1024;
		byte[] temp = new byte[tempSize];
		int length = inputStream.read(temp);
		while (length != -1) {
			outputStream.write(temp, 0, length);
			length = inputStream.read(temp);
		}
		return outputStream.toByteArray();
	}
}
