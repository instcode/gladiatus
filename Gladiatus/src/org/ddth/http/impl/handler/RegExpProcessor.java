/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.impl.handler;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.ddth.http.core.connection.Request;
import org.ddth.http.core.handler.ConnectionListener;
import org.ddth.http.impl.parser.ContentParser;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

public class RegExpProcessor implements ConnectionListener {
	public static final int PATTERN_TYPE_EXCLUSIVE_LINK = 0;
	public static final int PATTERN_TYPE_INCLUSIVE_LINK = 1;
	
	private static final ContentParser HTML_PARSER = new ContentParser();
	
	private XPathExpression[] nodePaths;
	private XPathExpression bodyExpression;
	private Pattern[] patterns;
	private boolean isExclusive;
	private String encoding;

	public RegExpProcessor(String encoding, String[] linkPaths, int patternType, String[] regExps) {
		this.encoding = encoding;
		this.nodePaths = new XPathExpression[linkPaths.length];
		try {
			XPath xpath = XPathFactory.newInstance().newXPath();
			bodyExpression = xpath.compile("/HTML/BODY");
			for (int i = 0; i < linkPaths.length; i++) {
				nodePaths[i] = xpath.compile(linkPaths[i]);
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}

		this.isExclusive = (patternType == PATTERN_TYPE_EXCLUSIVE_LINK) ? true : false;
		this.patterns = new Pattern[regExps.length];
		for (int i = 0; i < regExps.length; i++) {
			patterns[i] = Pattern.compile(regExps[i]);
		}
	}

	private void parseForLinks(Node node) {
		String link = HTML_PARSER.extractLink(node);
		if (link == null || link.length() == 0) {
			return;
		}
		boolean isMatched = false;
		for (Pattern pattern : patterns) {
			Matcher matcher = pattern.matcher(link);
			if (matcher.find()) {
				isMatched = true;
				break;
			}
		}
		if (isMatched != isExclusive) {
			handleLink(link);
		}
		Node child = node.getFirstChild();
        while (child != null) {
        	parseForLinks(child);
            child = child.getNextSibling();
        }
	}

	@Override
	public void notifyFinished(Request request) {
		try {
			//FIXME request.getResponseStream();
			byte[] buffer = consume(null);
			ByteArrayInputStream byteStream = new ByteArrayInputStream(buffer);			
			Document doc = HTML_PARSER.parse(byteStream, encoding);
			Node body = (Node) bodyExpression.evaluate(doc, XPathConstants.NODE);
			
			// Check if we have the body content
			if (body == null || !checkBody(body)) {
				return;
			}
			handleContent(buffer);
			for (XPathExpression nodePath : nodePaths) {
				Node node = (Node) nodePath.evaluate(body, XPathConstants.NODE);
				if (node == null) {
					continue;
				}
				parseForLinks(node);
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void notifyRequesting(Request request) {
		
	}

	/**
	 * Check if the body data is valid
	 * @param body
	 * @return
	 */
	protected boolean checkBody(Node body) throws Exception {
		return true;
	}

	/**
	 * @param buffer
	 */
	protected void handleContent(byte[] buffer) {
	}

	/**
	 * @param link
	 */
	protected void handleLink(String link) {
		System.out.println(link);
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
