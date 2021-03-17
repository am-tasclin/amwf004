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
    public void sqlCmdMapToSqlDelete(Map<String, Object> sqlCmdMap) {
        Map<String, Object> map_delete_doc = (Map<String, Object>) sqlCmdMap.get("delete_doc");
        logger.info("sqlCmdMap = " + sqlCmdMap + " | " + map_delete_doc + " | ");
        logger.info("sqlCmdMap = " + sqlCmdMap + " | " + map_delete_doc + " | " + map_delete_doc.get("doc_id"));
        String sql_delete_doc = "DELETE FROM doc WHERE doc_id=:doc_id; ";
        sql_delete_doc = sql_delete_doc.replace(":doc_id", "" + map_delete_doc.get("doc_id"));
        logger.info("sqlCmdMap = " + sqlCmdMap + " | " + map_delete_doc + " | " + sql_delete_doc);
        int update = dbParamJdbcTemplate.update(sql_delete_doc, map_delete_doc);
        map_delete_doc.put("update", update);
    }

    @Transactional
    public void sqlCmdMapToSqlInsert(Map<String, Object> sqlCmdMap) {
        long[] idsForAction = null;
        logger.info("sqlCmdMap = " + sqlCmdMap);
        if (sqlCmdMap.containsKey("next_doc_ids")) {
            int next_doc_ids = (int) sqlCmdMap.get("next_doc_ids");
            idsForAction = new long[next_doc_ids];
            for (int i = 0; i < idsForAction.length; i++) {
                long l = nextDbId();
                idsForAction[i] = l;
            }
            logger.info("idsForAction = " + idsForAction);
            sqlCmdMap.put("idsForAction", idsForAction);
        }

        if (sqlCmdMap.containsKey("insert_doc")) {
            Map<String, Object> map_insert_doc = (Map<String, Object>) sqlCmdMap.get("insert_doc");
            sqlCmdMapTo1Insert(map_insert_doc, idsForAction);
            logger.info("sqlCmdMap = " + sqlCmdMap);
        }
        if (sqlCmdMap.containsKey("update_string")) {
            Map<String, Object> map_update_string = (Map<String, Object>) sqlCmdMap.get("update_string");
            sqlCmdMapTo1UpdateString(map_update_string);
        }
        if (sqlCmdMap.containsKey("update_doc")) {
            Map<String, Object> map_update_doc = (Map<String, Object>) sqlCmdMap.get("update_doc");
            sqlCmdMapTo1UpdateDoc(map_update_doc);
        }
    }

    private void sqlCmdMapTo1UpdateString(Map<String, Object> map_update_string) {
        logger.info("map_update_string = " + map_update_string);
        String sql_update_string = "UPDATE string SET value = ':value' WHERE string_id = :string_id";
        sql_update_string = sql_update_string.replace(":value", "" + map_update_string.get("value"));
        sql_update_string = sql_update_string.replace(":string_id", "" + map_update_string.get("string_id"));
        int update = dbParamJdbcTemplate.update(sql_update_string, map_update_string);
        map_update_string.put("update", update);
    }

    private void sqlCmdMapTo1UpdateDoc(Map<String, Object> map_update_doc) {
        logger.info("map_update_doc = " + map_update_doc);
        String sql_update_doc = "UPDATE doc SET ";
        String sql_update_doc_set = "";
        String[] doc_att = { "reference", "reference2", "doctype" };
        for (String att : doc_att) {
            if (map_update_doc.containsKey(att)) {
                if (sql_update_doc_set.length() > 0)
                    sql_update_doc_set += ", ";
                sql_update_doc_set += att + " = '" + map_update_doc.get(att) + "'";
            }
        }
        sql_update_doc += sql_update_doc_set + " WHERE doc_id = " + map_update_doc.get("doc_id");
        logger.info("sql_update_doc = " + sql_update_doc);
        int update = dbParamJdbcTemplate.update(sql_update_doc, map_update_doc);
        map_update_doc.put("update", update);
    }

    private void sqlCmdMapTo1Insert(Map<String, Object> map_insert_doc, long[] idsForAction) {
        long doc_id;
        if (map_insert_doc.containsKey("calc_doc_id"))
            doc_id = idsForAction[(int) map_insert_doc.get("calc_doc_id")];
        else
            doc_id = nextDbId();
        logger.info("doc_id = " + doc_id);
        logger.info("r2 = " + map_insert_doc.get("reference2"));
        logger.info("i_d = " + map_insert_doc);
        map_insert_doc.put("doc_id", doc_id);
        String sql_insert_doc = "INSERT INTO doc (doc_id,parent,reference, reference2) VALUES (:doc_id, :parent, :reference, :reference2); ";
        sql_insert_doc = sql_insert_doc.replace(":doc_id", "" + doc_id);
        sql_insert_doc = sql_insert_doc.replace(":parent", "" + map_insert_doc.get("parent"));
        sql_insert_doc = sql_insert_doc.replace(":reference, ", "" + map_insert_doc.get("reference") + ", ");
        sql_insert_doc = sql_insert_doc.replace(":reference2", "" + map_insert_doc.get("reference2"));
        Map<String, Object> map_insert_string = (Map<String, Object>) map_insert_doc.get("insert_string");
        if (map_insert_string != null) {
            logger.info("insert_string = " + map_insert_string);
            String value = (String) map_insert_string.get("value");
            String sql_insert_string;
            if (value != null) {
                sql_insert_string = "INSERT INTO string (string_id, value) VALUES (:doc_id, :value); ";
                sql_insert_string = sql_insert_string.replace(":value", "'" + value + "'");
            } else {
                sql_insert_string = "INSERT INTO string (string_id) VALUES (:doc_id); ";
            }
            sql_insert_string = sql_insert_string.replace(":doc_id", "" + doc_id);
            sql_insert_doc += sql_insert_string;
        }
        map_insert_doc.put("sql", sql_insert_doc);
        int update = dbParamJdbcTemplate.update(sql_insert_doc, map_insert_doc);
        map_insert_doc.put("update", update);
        String sql_select = env.getProperty("sql_app.SELECT_obj_with_i18n");
        Map<String, Object> el = dbParamJdbcTemplate.queryForMap(sql_select, map_insert_doc);
        map_insert_doc.put("el", el);

        if (map_insert_doc.containsKey("insert_doc")) {
            Map<String, Object> map_insert_docInner = (Map<String, Object>) map_insert_doc.get("insert_doc");
            if (!map_insert_docInner.containsKey("parent"))
                map_insert_docInner.put("parent", doc_id);
            sqlCmdMapTo1Insert(map_insert_docInner, idsForAction);
        }
        if (map_insert_doc.containsKey("read_this_doc")) {
            Map<String, Object> map_read_this_doc = (Map<String, Object>) map_insert_doc.get("read_this_doc");
            String sql = (String) map_read_this_doc.get("sql");
            String doc_id_name = (String) map_read_this_doc.get("doc_id_name");
            sql = "SELECT * FROM (" + sql + ") x WHERE " + doc_id_name + "=" + doc_id;
            logger.info("sql = "+sql);
            Map<String, Object> r = dbJdbcTemplate.queryForList(sql).get(0);
            map_read_this_doc.put("r", r);
        }

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
