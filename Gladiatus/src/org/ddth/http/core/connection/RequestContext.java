package org.ddth.http.core.connection;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class RequestContext implements Context {

	private Map<String, String> attributes = new ConcurrentHashMap<String, String>();
	
	@Override
	public String getAttribute(String key) {
		return attributes.get(key);
	}

	@Override
	public void setAttribute(String key, String value) {
		attributes.put(key, value);
	}

}
