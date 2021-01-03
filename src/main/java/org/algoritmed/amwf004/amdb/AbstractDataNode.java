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
        logger.info("16 - msg");
    }
    
    public void exeQueryForSqlName(String sqlName, Map<String, Object> map) {
        map.put("sqlName", sqlName);
        String sql = getEnvProperty(sqlName);
        List<Map<String, Object>> list = super.qForList(sql, map);
        map.put("list", list);
    }

}
