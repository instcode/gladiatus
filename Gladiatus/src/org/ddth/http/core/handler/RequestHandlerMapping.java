package org.ddth.http.core.handler;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

public class RequestHandlerMapping {

	class ChainRequestHandler implements RequestHandler {

		List<RequestHandler> handlers = new CopyOnWriteArrayList<RequestHandler>();
		
		public void add(RequestHandler handler) {
			handlers.add(handler);
		}

		public boolean remove(RequestHandler handler) {
			return handlers.remove(handler);
		}

		public void clear() {
			handlers.clear();
		}
		
		public int size() {
			return handlers.size();
		}
		
		@Override
		public void handleClose(ConnectionEvent event) {
			for (RequestHandler handler : handlers) {
				handler.handleClose(event);
			}
		}

		@Override
		public void handleRequest(ConnectionEvent event) {
			for (RequestHandler handler : handlers) {
				handler.handleRequest(event);
			}
		}

		@Override
		public void handleResponse(ConnectionEvent event) {
			for (RequestHandler handler : handlers) {
				handler.handleResponse(event);
			}
		}
	}
	
	private Map<String, ChainRequestHandler> handlers = new HashMap<String, ChainRequestHandler>();
	
	public void registerHandler(String path, RequestHandler handler) {
		ChainRequestHandler chainHandler = handlers.get(path);
		if (chainHandler == null) {
			chainHandler = new ChainRequestHandler();
			handlers.put(path, chainHandler);
		}
		chainHandler.add(handler);
	}
	
	public void unregisterHandler(RequestHandler handler) {
		Iterator<ChainRequestHandler> iterator = handlers.values().iterator();
		while (iterator.hasNext()) {
			ChainRequestHandler chainHandler = iterator.next();
			chainHandler.remove(handler);
		}
	}
	
	public void clear() {
		Iterator<ChainRequestHandler> iterator = handlers.values().iterator();
		while (iterator.hasNext()) {
			ChainRequestHandler chainHandler = iterator.next();
			chainHandler.clear();
			iterator.remove();
		}
	}
}
