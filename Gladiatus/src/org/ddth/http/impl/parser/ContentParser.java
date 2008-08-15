/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 27, 2008 3:49:35 AM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.impl.parser;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import org.cyberneko.html.parsers.DOMParser;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class ContentParser {
	private static final String HTML_TAG_ATTR_HREF = "href";
	private static final String HTML_TAG_ANCHOR = "a";

	/**
	 * Parse the HTML content
	 * @param inputStream
	 * @param encoding
	 * @return
	 * 		org.w3c.dom.Document that's holding the HTML content
	 */
	public Document parse(InputStream inputStream, String encoding) {
		DOMParser parser = new DOMParser();
		InputSource inputSource = new InputSource(inputStream);
		inputSource.setEncoding(encoding);
		Document doc = null;
		try {
			parser.parse(inputSource);
			doc = parser.getDocument();
		}
		catch (SAXException e) {
			e.printStackTrace();
		}
		catch (IOException e) {
			e.printStackTrace();
		}
		return doc;
	}

	/**
	 * @param node
	 * @return
	 */
	public String extractLink(Node node) {
		String link = null;
		if (HTML_TAG_ANCHOR.equalsIgnoreCase(node.getNodeName())) {
			link = node.getAttributes().getNamedItem(HTML_TAG_ATTR_HREF).getNodeValue();
		}
		return link;
	}

	public String getHTML(Node node) {
		StringWriter writer = new StringWriter();
		HTMLNodeBuilder builder = new HTMLNodeBuilder(writer);
		try {
			builder.serialize(node);
		}
		catch (IOException e) {
		}
		return writer.getBuffer().toString();
	}
}
