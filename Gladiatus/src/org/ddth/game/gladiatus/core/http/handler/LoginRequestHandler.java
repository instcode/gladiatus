package org.ddth.game.gladiatus.core.http.handler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.log4j.Logger;
import org.ddth.http.core.handler.ConnectionEvent;
import org.ddth.http.core.handler.RequestHandler;
import org.ddth.http.impl.parser.ContentParser;
import org.w3c.dom.Document;
import org.w3c.dom.Node;


public class LoginRequestHandler implements RequestHandler {

	private static Logger logger = Logger.getLogger(LoginRequestHandler.class);
	
	@Override
	public void handleClose(ConnectionEvent event) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void handleRequest(ConnectionEvent event) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void handleResponse(ConnectionEvent event) {
		logger.debug("Handle: " + event.request);
		byte[] buffer = consume(event.inputStream);
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
