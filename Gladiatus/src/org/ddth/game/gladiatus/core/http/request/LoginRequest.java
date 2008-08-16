package org.ddth.game.gladiatus.core.http.request;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.log4j.Logger;
import org.ddth.http.core.connection.Request;
import org.ddth.http.core.handler.ConnectionEvent;
import org.ddth.http.core.handler.RequestHandler;
import org.ddth.http.impl.parser.ContentParser;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

public class LoginRequest extends Request implements RequestHandler {
	
	private static Logger logger = Logger.getLogger(LoginRequest.class);

	public LoginRequest(String serverAddress, String username, String password) {
		super("http://" + serverAddress + "/game/index.php?mod=login");
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("user", username);
		parameters.put("pass", password);
		setParamters(Request.POST_REQUEST, parameters);
	}

	@Override
	public void handleClose(ConnectionEvent event) {
	}

	@Override
	public void handleRequest(ConnectionEvent event) {
		logger.debug("Requesting url='" + event.request.getURL() + "'...");
	}

	@Override
	public void handleResponse(ConnectionEvent event) {
		byte[] buffer = consume(event.inputStream);
		
		FileOutputStream outputStream = null;
		try {
			outputStream = new FileOutputStream("login.html");
			outputStream.write(buffer);
			outputStream.flush();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			if (outputStream != null) {
				try {
					outputStream.close();
				}
				catch (IOException e) {
				}
			}
		}
		
		parse(buffer);
	}

	private void parse(byte[] buffer) {
		ByteArrayInputStream byteStream = new ByteArrayInputStream(buffer);
		ContentParser parser = new ContentParser();
		Document doc = parser.parse(byteStream, "utf-8");
		
		XPath xpath = XPathFactory.newInstance().newXPath();
		XPathExpression bodyExpression;
		try {
			bodyExpression = xpath.compile("/HTML/BODY");
			Node node = (Node) bodyExpression.evaluate(doc, XPathConstants.NODE);
			logger.debug(node.getTextContent());
		}
		catch (XPathExpressionException e) {
			logger.debug("XPath: ", e);
		}
	}
	
	private byte[] consume(InputStream inputStream) {
		ByteArrayOutputStream savedBytes = new ByteArrayOutputStream(64000);
		try {
			byte[] buffer = new byte[256];
			int bytesread = 0;
			do {
				bytesread = inputStream.read(buffer, 0, 256);
				if (bytesread > 0) {
					savedBytes.write(buffer, 0, bytesread);
				}
			} while (bytesread > 0);
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		return savedBytes.toByteArray();
	}
}
