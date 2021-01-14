package org.algoritmed.amwf004.amdb;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public class AbstractDataNode extends DbCommon {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractDataNode.class);

    AbstractDataNode(JdbcTemplate dbJdbcTemplate, NamedParameterJdbcTemplate dbParamJdbcTemplate) {
        super(dbJdbcTemplate, dbParamJdbcTemplate);
    }

    public List<Map<String, Object>> sqlNameToDataList(String sqlName, Map<String, Object> mapParams) {
        String sql = env.getProperty(sqlName);
        return dbParamJdbcTemplate.queryForList(sql, mapParams);
    }

    public List<Map<String, Object>> exeQueryListFromSqlName(String sqlName, Map<String, Object> map) {
        List<Map<String, Object>> list = sqlNameToDataList(sqlName, map);
        map.put("sqlName", sqlName);
        map.put("list", list);
        return list;
    }

	public void updateString(Map<String, Object> map) {
        int update = dbParamJdbcTemplate.update("UPDATE string SET value=:value WHERE string_id=:doc_id", map);
        map.put("update", update);
	}

}
