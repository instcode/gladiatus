package org.ddth.game.gladiatus.core.auction;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpVersion;
import org.apache.http.NameValuePair;
import org.apache.http.client.CookieStore;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.params.ClientPNames;
import org.apache.http.client.params.CookiePolicy;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.impl.cookie.BasicClientCookie;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;
import org.apache.http.params.HttpProtocolParams;
import org.apache.http.protocol.HTTP;
import org.apache.log4j.Logger;
import org.ddth.http.core.connection.Request;
import org.ddth.http.impl.connection.ThreadSafeConnectionModel;
import org.ddth.http.impl.parser.ContentParser;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

public class AuctionMonitor {
	private static final String GLADIATUS_VN_SERVER = "s1.gladiatus.vn";

	private Logger logger = Logger.getLogger(ThreadSafeConnectionModel.class);

	private DefaultHttpClient httpClient;

	public static final Request TRAI_TAO = new Request(
			"http://" + GLADIATUS_VN_SERVER + "/game/index.php?mod=auction&f=7&qry=Qu%E1%BA%A3%20t%C3%A1o&sh=6bb3f975a1f2724d84ea501fd49d8f2a");
	public static final Request BUY_TRAI_TAO = new Request(
			"http://" + GLADIATUS_VN_SERVER + "/game/index.php?mod=auction&sh=6bb3f975a1f2724d84ea501fd49d8f2a");

	static {
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("auctionid", "282036");
		parameters.put("f", "7");
		parameters.put("bid_amount", "80");
		parameters.put("bid", "%C4%90%E1%BB%81+ngh%E1%BB%8B+mua");
		BUY_TRAI_TAO.setParamters(Request.POST_REQUEST, parameters);
	}
	
	public static void main(String[] args) {
		new AuctionMonitor();
	}
	
	public AuctionMonitor() {
		this("25908%3B018211c0e8a015dcb1f1d958f5cdce8c");
		sendRequest(BUY_TRAI_TAO);
	}
	
	public AuctionMonitor(String initialCookie) {
		SchemeRegistry supportedSchemes = new SchemeRegistry();

		supportedSchemes.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
		supportedSchemes.register(new Scheme("https", SSLSocketFactory.getSocketFactory(), 443));

		HttpParams params = new BasicHttpParams();
		HttpProtocolParams.setUserAgent(params, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.1) Gecko/2008070208 Firefox/3.0.1");
		HttpProtocolParams.setVersion(params, HttpVersion.HTTP_1_1);
		HttpProtocolParams.setContentCharset(params, HTTP.UTF_8);
		HttpProtocolParams.setUseExpectContinue(params, true);

		ClientConnectionManager ccm = new ThreadSafeClientConnManager(params, supportedSchemes);
		httpClient = new DefaultHttpClient(ccm, params);
		httpClient.getParams().setParameter(ClientPNames.COOKIE_POLICY, CookiePolicy.BROWSER_COMPATIBILITY);
		CookieStore cookieStore = createCookieStore(initialCookie);
		httpClient.setCookieStore(cookieStore);
	}
	
	private CookieStore createCookieStore(String value) {
		CookieStore cookieStore = new BasicCookieStore();

		BasicClientCookie basicClientCookie = new BasicClientCookie("Gladiatus", value);
		basicClientCookie.setDomain(GLADIATUS_VN_SERVER);
		basicClientCookie.setPath("/game/");
		basicClientCookie.setSecure(false);
		basicClientCookie.setExpiryDate(new Date(System.currentTimeMillis() + 31536000000L));
		cookieStore.addCookie(basicClientCookie);
		return cookieStore;
	}
	
	public void sendRequest(final Request request) {
		HttpEntity entity = null;
		try {
			HttpUriRequest httpRequest = createHttpRequest(request);
			HttpResponse httpResponse = httpClient.execute(httpRequest);
			entity = httpResponse.getEntity();
			if (entity != null) {
				InputStream inputStream = entity.getContent(); 
				if (entity.getContentEncoding() != null && "gzip".equals(entity.getContentEncoding().getValue())) {
					// Wrap content with GZIP input stream
					inputStream = new GZIPInputStream(inputStream);
				}
				handleResponse(inputStream);
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

	private HttpUriRequest createHttpRequest(final Request request) throws URISyntaxException, UnsupportedEncodingException {
		HttpUriRequest httpRequest = null;
		if (request.getType() == Request.POST_REQUEST) {
			HttpPost httpPost = new HttpPost(request.getURL());
			List <NameValuePair> nvps = new ArrayList<NameValuePair>();
			
			Map<String, String> parameters = request.getParameters();
			Iterator<String> iterator = parameters.keySet().iterator();
			while (iterator.hasNext()) {
				String parameter = iterator.next();
				String value = parameters.get(parameter);
				nvps.add(new BasicNameValuePair(parameter, value));
			}
			httpPost.setEntity(new UrlEncodedFormEntity(nvps, HTTP.UTF_8));
			httpRequest = httpPost;
		}
		else {
			HttpGet httpGet = new HttpGet(request.getURL());
			httpRequest = httpGet;
		}
		
		// Prefer GZIP for optimizing bandwidth
		httpRequest.addHeader("Referer", request.getURL());
		httpRequest.addHeader("Accept-Encoding", "gzip,deflate");
		httpRequest.addHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
		httpRequest.addHeader("Accept-Language", "en-us,en;q=0.5");
		httpRequest.addHeader("Accept-Charset", "ISO-8859-1,utf-8;q=0.7,*;q=0.7");
		httpRequest.addHeader("Keep-Alive", "300");
		printHeader(httpRequest.getAllHeaders());
		return httpRequest;
	}

	private void printHeader(Header[] headers) {
		logger.debug("----------------------------------------");
		for (int i = 0; i < headers.length; i++) {
			logger.debug(headers[i]);
		}
		logger.debug("----------------------------------------");
	}
	

	private void handleResponse(InputStream inputStream) {
		byte[] buffer = consume(inputStream);
		
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
