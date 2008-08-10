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

//http://s2.gladiatus.vn/game/index.php?mod=login
//
//			POST /game/index.php?mod=login HTTP/1.1
//			Host: s2.gladiatus.vn
//			User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.1) Gecko/2008070208 Firefox/3.0.1 Creative ZENcast v2.01.01
//			Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
//			Accept-Language: en-us,en;q=0.5
//			Accept-Encoding: gzip,deflate
//			Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
//			Keep-Alive: 300
//			Connection: keep-alive
//			Referer: http://s2.gladiatus.vn/game/index.php?mod=login
//			Content-Type: application/x-www-form-urlencoded
//			Content-Length: 27
//			user=instcode&pass=password
		
//			HTTP/1.x 200 OK
//			Date: Fri, 08 Aug 2008 17:51:17 GMT
//			Server: Apache
//			Set-Cookie: Gladiatus=%3B
//			Set-Cookie: Gladiatus=18668%3B013b0fc4da5c0966dde17bf7eabf6142; expires=Sat, 08 Aug 2009 17:51:17 GMT
//			Connection: close
//			Cache-Control: no-cache
//			Vary: Accept-Encoding
//			Content-Encoding: gzip
//			Content-Length: 1917
//			Content-Type: text/html; charset=utf8
//		http://s2.gladiatus.vn/game/index.php?mod=overview&sh=f7f6d6474d4c443aeb3e82fd3c0849ff&web_redirected=1
//
//			GET /game/index.php?mod=overview&sh=f7f6d6474d4c443aeb3e82fd3c0849ff&web_redirected=1 HTTP/1.1
//			Host: s2.gladiatus.vn
//			User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.1) Gecko/2008070208 Firefox/3.0.1 Creative ZENcast v2.01.01
//			Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
//			Accept-Language: en-us,en;q=0.5
//			Accept-Encoding: gzip,deflate
//			Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
//			Keep-Alive: 300
//			Connection: keep-alive
//			Cookie: Gladiatus=18668%3B013b0fc4da5c0966dde17bf7eabf6142
//
//			HTTP/1.x 200 OK
//			Date: Fri, 08 Aug 2008 17:51:19 GMT
//			Server: Apache
//			Connection: close
//			Cache-Control: no-cache
//			Vary: Accept-Encoding
//			Content-Encoding: gzip
//			Content-Length: 6236
//			Content-Type: text/html; charset=utf8
//			----------------------------------------------------------
//			http://s2.gladiatus.vn/game/index.php?mod=overview&sh=f7f6d6474d4c443aeb3e82fd3c0849ff
//
//			GET /game/index.php?mod=overview&sh=f7f6d6474d4c443aeb3e82fd3c0849ff HTTP/1.1
//			Host: s2.gladiatus.vn
//			User-Agent: Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.0.1) Gecko/2008070208 Firefox/3.0.1 Creative ZENcast v2.01.01
//			Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
//			Accept-Language: en-us,en;q=0.5
//			Accept-Encoding: gzip,deflate
//			Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
//			Keep-Alive: 300
//			Connection: keep-alive
//			Cookie: Gladiatus=18668%3B013b0fc4da5c0966dde17bf7eabf6142
//
//			HTTP/1.x 200 OK
//			Date: Fri, 08 Aug 2008 17:51:20 GMT
//			Server: Apache
//			Connection: close
//			Cache-Control: no-cache
//			Vary: Accept-Encoding
//			Content-Encoding: gzip
//			Content-Length: 6236
//			Content-Type: text/html; charset=utf8
public class LoginRequest extends Request implements RequestHandler {
	
	private static Logger logger = Logger.getLogger(LoginRequest.class);

	public LoginRequest(String serverAddress, String username, String password) {
		super("http://" + serverAddress + "/game/index.php?mod=login", null);
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
