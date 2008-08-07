/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 27, 2008 3:49:35 AM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.impl.parser;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Writer;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class HTMLNodeBuilder {

	private Writer writer = new PrintWriter(new OutputStreamWriter(System.out));

	public HTMLNodeBuilder() {
	}
	
	public HTMLNodeBuilder(Writer writer) {
		this.writer = writer;
	}
	
	public void serialize(Node node) throws IOException {
		if (node == null) {
			return;
		}
		
		String nodeName = node.getNodeName().toLowerCase();
		String nodeValue = node.getNodeValue();
		int nodeType = node.getNodeType();
		
		switch (nodeType) {
		case Node.DOCUMENT_NODE :
			Document doc = ((Document) node);
			serialize(doc.getDocumentElement());
			writer.flush();
			break;
			
		case Node.ELEMENT_NODE :
			writer.append('<');
			writer.append(nodeName);
			
			int attrCount = (node.getAttributes() != null) ? node.getAttributes().getLength() : 0;
			for (int i = 0; i < attrCount; i++) {
				Node attribute = node.getAttributes().item(i);
				writer.append(' ');
				writer.append(attribute.getNodeName());
				writer.append("=\"" + attribute.getNodeValue());
				writer.append('"');
			}
			NodeList children = node.getChildNodes();
			if (nodeValue == null && children.getLength() == 0) {
				writer.append("/>");
				break;
			}
			else {
				writer.append('>');
			}
		
			// Recursively serialize child-nodes
			for (int i = 0;i < children.getLength();i++) {
				serialize(children.item(i));
			}
			
			if (nodeValue != null) {
				writer.append(nodeValue);
			}
			writer.append("</");
			writer.append(nodeName);
			writer.append('>');
			break;
			
		case Node.TEXT_NODE :
			writer.append(nodeValue);
			break;
		}
	}
}
