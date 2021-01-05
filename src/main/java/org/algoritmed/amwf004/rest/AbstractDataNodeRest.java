package org.algoritmed.amwf004.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.algoritmed.amwf004.amdb.AbstractDataNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("r/adn")
public class AbstractDataNodeRest {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractDataNodeRest.class);
    protected @Autowired @Qualifier("db1AbstractDataNode") AbstractDataNode abstractDataNode;

    @GetMapping("el/{doc_id}")
    public @ResponseBody Map<String, Object> getElementById(@PathVariable Integer doc_id) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("doc_id", doc_id);
        abstractDataNode.exeQueryListFromSqlName("sql_app.SELECT_obj_with_i18n", map);
        return map;
    }

    @GetMapping("l/{parentsList}")
    public @ResponseBody Map<String, Object> getListByParentIds(@PathVariable List<Integer> parentsList) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("parentsList", parentsList);
        abstractDataNode.exeQueryListFromSqlName("sql_app.SELECT_parentsList_with_i18n", map);
        return map;
    }

    @GetMapping("d/{doc_id}")
    public @ResponseBody Map<String, Object> getListDeepByParentIds(@PathVariable Integer doc_id) {
        Map<String, Object> d = new HashMap<String, Object>();
        d.put("elMap", new HashMap<Integer, Object>());
        d.put("clList", new HashMap<Integer, Object>());
        d.put("doc_id", doc_id);
        List<Integer> parentsList = readSqlName("sql_app.SELECT_obj_with_i18n", Map.of("doc_id", doc_id), d);
        d.put("x1", parentsList);
        List<Integer> parentsList2 = readSqlName("sql_app.SELECT_parentsList_with_i18n", Map.of("parentsList", parentsList),
                d);
        d.put("x2", parentsList2);
        return d;
    }

    private List<Integer> readSqlName(String sqlName, Map<String, Object> mapParams, Map<String, Object> d) {
        List<Integer> parentsList = new ArrayList<>();
        abstractDataNode.sqlNameToDataList(sqlName, mapParams).forEach(setEl(d, parentsList));
        return parentsList;
    }

    private Consumer<? super Map<String, Object>> setEl(Map<String, Object> d, List<Integer> parentsList) {
        return el -> {
            Integer docId = (Integer) el.get("doc_id");
            parentsList.add(docId);
            Map<Integer, Object> elMap = (Map<Integer, Object>) d.get("elMap");
            elMap.put(docId, el);
            Map<Integer, Object> clList = (Map<Integer, Object>) d.get("clList");
        };
    }

}
