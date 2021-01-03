package org.algoritmed.amwf004.amdb;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:sql.properties")
public class DbCommon {
	protected static final Logger logger = LoggerFactory.getLogger(DbCommon.class);

	protected @Autowired Environment env;
	protected NamedParameterJdbcTemplate dbParamJdbcTemplate;
	protected JdbcTemplate dbJdbcTemplate;

	protected DbCommon(JdbcTemplate dbJdbcTemplate, NamedParameterJdbcTemplate dbParamJdbcTemplate) {
		this.dbParamJdbcTemplate = dbParamJdbcTemplate;
		this.dbJdbcTemplate = dbJdbcTemplate;
	}

	public String getEnvProperty(String propertie) {
		String val = env.getProperty(propertie);
		return val;
	}
	public List<Map<String, Object>> qForList(String sql, Map<String, Object> map) {
		List<Map<String, Object>> list = dbParamJdbcTemplate.queryForList(sql, map);
		return list;
	}

	public Map<String, Object> sqlParamToMap(HttpServletRequest request) {
		Map<String, String[]> parameterMap = request.getParameterMap();
		Map<String, Object> map = new HashMap<String, Object>();
		for (String key : parameterMap.keySet()) {
			String[] v = parameterMap.get(key);
			String val = v[0];
			map.put(key, val);
		}
		map.remove("sql");
		return map;
	}

}
