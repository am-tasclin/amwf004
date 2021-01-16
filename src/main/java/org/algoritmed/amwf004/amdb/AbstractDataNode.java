package org.algoritmed.amwf004.amdb;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void sqlCmdMapToSql(Map<String, Object> sqlCmdMap) {
        int next_doc_ids = (int) sqlCmdMap.get("next_doc_ids");
        long[] idsForAction = new long[next_doc_ids];
        for (int i = 0; i < idsForAction.length; i++) {
            long l = nextDbId();
            idsForAction[i] = l;
        }
        logger.info("idsForAction = " + idsForAction);
        sqlCmdMap.put("idsForAction", idsForAction);
        Map<String, Object> map_insert_doc = (Map<String, Object>) sqlCmdMap.get("insert_doc");
        int calc_doc_id = (int) map_insert_doc.get("calc_doc_id");
        long doc_id = idsForAction[calc_doc_id];
        logger.info("doc_id = " + doc_id);
        map_insert_doc.put("doc_id", doc_id);
        String sql_insert_doc = "INSERT INTO doc (doc_id,parent,reference) VALUES (:doc_id,:parent,:reference); ";
        sql_insert_doc = sql_insert_doc.replace(":doc_id", "" + doc_id);
        sql_insert_doc = sql_insert_doc.replace(":parent", "" + map_insert_doc.get("parent"));
        sql_insert_doc = sql_insert_doc.replace(":reference", "" + map_insert_doc.get("reference"));
        Map<String, Object> map_insert_string = (Map<String, Object>) map_insert_doc.get("insert_string");
        if (map_insert_string != null) {
            logger.info("insert_string = " + map_insert_string);
            String sql_insert_string = "INSERT INTO string (string_id) VALUES (:doc_id); ";
            sql_insert_string = sql_insert_string.replace(":doc_id", "" + doc_id);
            sql_insert_doc += sql_insert_string;
        }
        map_insert_doc.put("sql", sql_insert_doc);
        int update = dbParamJdbcTemplate.update(sql_insert_doc, map_insert_doc);
        map_insert_doc.put("update", update);
        String sql_select = env.getProperty("sql_app.SELECT_obj_with_i18n");
        Map<String, Object> el = dbParamJdbcTemplate.queryForMap(sql_select, map_insert_doc);
        map_insert_doc.put("el", el);
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
