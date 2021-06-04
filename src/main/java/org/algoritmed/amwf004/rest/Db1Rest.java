package org.algoritmed.amwf004.rest;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.algoritmed.amwf004.amdb.ExecuteSqlBlock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class Db1Rest {
	protected static final Logger logger = LoggerFactory.getLogger(Db1Rest.class);
	protected @Autowired @Qualifier("db1ExecuteSqlBlock") ExecuteSqlBlock executeSqlBlock;

	@Transactional
	@PostMapping("/r/url_sql_read_db1")
	public @ResponseBody Map<String, Object> url_sql_read_db1(@RequestBody Map<String, Object> data,
			HttpServletRequest request, Principal principal) {
		logger.info("\n--35---Post-- " + "/r/url_sql_read_db1" + " SQL = \n" + data.get("sql")
		// + "\n" + data
		);
		executeSqlBlock.executeSql(data);
		data.remove("sql");
		return data;
	}

	@GetMapping("/r/url_sql_read_db1")
	public @ResponseBody Map<String, Object> url_sql_read_db1(@RequestParam(value = "sql", required = true) String sql,
			HttpServletRequest request) {
		Map<String, Object> map = executeSqlBlock.sqlParamToMap(request);
		// Map m = new HashMap();
		// m.put("k", "v");
		// m.put("sql", sql);
		// System.out.println(map);
		// System.out.println(sql);
		logger.info("\n--57-- /r/url_sql_read_db1" + " SQL = " + sql.length()
		// + "\n" + data
		);
		List<Map<String, Object>> list = executeSqlBlock.qForList(sql, map);
		map.put("list", list);
		return map;
	}

	@GetMapping("/r/docbodyjson/{doc_id}")
	public @ResponseBody Map<String, Object> getDocbodyjson(@PathVariable Long doc_id) {
		Map<String, Object> map = executeSqlBlock.getDocbodyjson(doc_id);
		Map m = new HashMap();
		m.put("k", "v");
		m.put("m", map);
		m.put("doc_id", doc_id);
		return map;
	}

	@GetMapping("/r/html/{id}")
	@ResponseBody
	public String getFooById(@PathVariable Integer id) {
		String sql = "SELECT value FROM string WHERE string_id = :id";
		Map<String, Object> map = new HashMap();
		map.put("id", id);
		List<Map<String, Object>> queryForList = dbParamJdbcTemplate.queryForList(sql, map);
		String value = (String) queryForList.get(0).get("value");
		return value;
	}

	protected @Autowired @Qualifier("db1ParamJdbcTemplate") NamedParameterJdbcTemplate dbParamJdbcTemplate;

}
