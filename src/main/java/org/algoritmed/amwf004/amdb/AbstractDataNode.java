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
        String sql = "UPDATE string SET value=:value WHERE string_id=:doc_id";
        int update = dbParamJdbcTemplate.update(sql, map);
        map.put("update", update);
    }

    public void sqlCmdMapToSql(Map<String, Object> sqlCmdMap) {
        int next_doc_ids = (int) sqlCmdMap.get("next_doc_ids");
        long[] idsForAction = new long[next_doc_ids];
        for (int i = 0; i < idsForAction.length; i++) {
            long l = nextDbId();
            idsForAction[i] = l;
        }
        logger.info("idsForAction = " + idsForAction);
        sqlCmdMap.put("idsForAction", idsForAction);
        Map<String, Object> insert_doc = (Map<String, Object>) sqlCmdMap.get("insert_doc");
        int calc_doc_id = (int) insert_doc.get("calc_doc_id");
        long doc_id = idsForAction[calc_doc_id];
        logger.info("doc_id = " + doc_id);
        insert_doc.put("doc_id", doc_id);
        String sql = "INSERT INTO doc (doc_id,parent,reference) VALUES (:doc_id,:parent,:reference); ";
        sql = sql.replace(":doc_id", "" + doc_id);
        sql = sql.replace(":parent", "" + insert_doc.get("parent"));
        sql = sql.replace(":reference", "" + insert_doc.get("reference"));
        Map<String, Object> insert_string = (Map<String, Object>) insert_doc.get("insert_string");
        if (insert_string != null) {
            logger.info("insert_string = " + insert_string);
            String sql_string = "INSERT INTO string (doc_id) VALUES (:doc_id); ";
            sql_string = sql_string.replace(":doc_id", "" + doc_id);
            sql += sql_string;
        }
        insert_doc.put("sql", sql);
        logger.info("sqlCmdMap = " + sqlCmdMap);
    }

    /**
     * Генератор наступного ID единого для всієї БД.
     * 
     * @return Наступний ID единий для всієй БД.
     */
    protected long nextDbId() {
        String sql_nextDbId = env.getProperty("sql_app.nextDbId");
        long nextDbId = dbJdbcTemplate.queryForObject(sql_nextDbId, Integer.class);
        return nextDbId;
    }
}
