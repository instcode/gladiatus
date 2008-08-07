/****************************************************
 * $Project: DinoAge                     $
 * $Date:: Jan 5, 2008 1:36:31 PM                  $
 * $Revision: $	
 * $Author:: khoanguyen                           $
 * $Comment::                                      $
 **************************************************/
package org.ddth.http.impl.connection;

import java.io.IOException;
import java.util.zip.GZIPInputStream;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.client.CookieStore;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;
import org.apache.http.params.HttpProtocolParams;
import org.apache.log4j.Logger;
import org.ddth.http.core.connection.ConnectionModel;
import org.ddth.http.core.connection.Request;

public class ThreadSafeConnectionModel implements ConnectionModel {
	private Logger logger = Logger.getLogger(ThreadSafeConnectionModel.class);

	private DefaultHttpClient httpClient;
	
	public ThreadSafeConnectionModel() {
		SchemeRegistry supportedSchemes = new SchemeRegistry();

		supportedSchemes.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
		supportedSchemes.register(new Scheme("https", SSLSocketFactory.getSocketFactory(), 443));

		HttpParams params = new BasicHttpParams();
		HttpProtocolParams.setUserAgent(params, "Mozilla/5.0");
		HttpProtocolParams.setVersion(params, HttpVersion.HTTP_1_1);
		HttpProtocolParams.setContentCharset(params, "UTF-8");
		HttpProtocolParams.setUseExpectContinue(params, true);

		ClientConnectionManager ccm = new ThreadSafeClientConnManager(params, supportedSchemes);
		httpClient = new DefaultHttpClient(ccm, params);
	}
	
	public void setup(CookieStore cookieStore) {
		httpClient.setCookieStore(cookieStore);
	}

	public void sendRequest(final Request request) {
		String sURL = request.getURL();
	
		HttpEntity entity = null;
		try {
			HttpGet httpGet = new HttpGet(sURL);
			// Prefer gzip for optimising bandwidth
			httpGet.addHeader("Accept-Encoding", "gzip");
			printHeader(httpGet.getAllHeaders());
			
			HttpResponse rsp = httpClient.execute(httpGet);
			entity = rsp.getEntity();
			if (entity != null) {
				if (entity.getContentEncoding() != null && "gzip".equals(entity.getContentEncoding().getValue())) {
					request.setResponseStream(new GZIPInputStream(entity.getContent()));
				}
				else {
					request.setResponseStream(entity.getContent());
				}
			}
		}
		catch (Exception e) {
			logger.debug(e);
		}
		finally {
			// If we could be sure that the stream of the entity has been
			// closed, we wouldn't need this code to release the connection.
			// If there is no entity, the connection is already released
			if (entity != null && !entity.isStreaming()) {
				try {
					// Release connection gracefully
					entity.consumeContent();
				}
				catch (IOException e) {
					logger.debug(e);
				}
			}
		}
	}

	private void printHeader(Header[] headers) {
		logger.debug("----------------------------------------");
		for (int i = 0; i < headers.length; i++) {
			logger.debug(headers[i]);
		}
		logger.debug("----------------------------------------");
	}
}