package org.ddth.game.gladiatus.core.http.request;

import java.util.HashMap;
import java.util.Map;

import org.ddth.game.gladiatus.core.http.handler.LoginRequestHandler;
import org.ddth.http.core.connection.Request;

public class LoginRequest extends Request {

	public LoginRequest() {
//		http://s1.gladiatus.vn/game/index.php?mod=login
//		POST /game/index.php?mod=login HTTP/1.1
//		Host: s1.gladiatus.vn
//		Referer: http://s1.gladiatus.vn/game/index.php?mod=login
//		Content-Type: application/x-www-form-urlencoded
//		Content-Length: 29
//		user=instcode&pass=p%40ssword
		
		super("http://s1.gladiatus.vn/game/index.php?mod=login", new LoginRequestHandler());
		Map<String, String> parameters = new HashMap<String, String>();
		parameters.put("user", "instcode");
		parameters.put("pass", "p@ssword");
		setParamters(Request.POST_REQUEST, parameters);
	}
}
