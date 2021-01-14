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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("r/adn")
public class AbstractDataNodeRest {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractDataNodeRest.class);
    protected @Autowired @Qualifier("db1AbstractDataNode") AbstractDataNode abstractDataNode;

    @PostMapping("d/{doc_id}")
    public @ResponseBody Map<String, Object> updateElementStringValue(@PathVariable Long doc_id,
            @RequestParam(value = "value", required = true) String value) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("doc_id", doc_id);
        map.put("value", value);
        abstractDataNode.updateString(map);
        logger.info("msg "+map);
        return map;
    }

    @GetMapping("el/{doc_id}")
    public @ResponseBody Map<String, Object> getElementById(@PathVariable Long doc_id) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("doc_id", doc_id);
        abstractDataNode.exeQueryListFromSqlName("sql_app.SELECT_obj_with_i18n", map);
        return map;
    }

    @GetMapping("l/{parentsList}")
    public @ResponseBody Map<String, Object> getListByParentIds(@PathVariable List<Long> parentsList) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("parentsList", parentsList);
        abstractDataNode.exeQueryListFromSqlName("sql_app.SELECT_parentsList_with_i18n", map);
        return map;
    }

    @GetMapping("d/{doc_id}")
    public @ResponseBody Map<String, Object> getListDeepByParentIds(@PathVariable Long doc_id) {
        Map<String, Object> d = new HashMap<String, Object>();
        d.put("elMap", new HashMap<Long, Object>());
        d.put("clList", new HashMap<Long, List<Long>>());
        d.put("doc_id", doc_id);
        List<Long> parentsList1 = readSqlName("sql_app.SELECT_obj_with_i18n", Map.of("doc_id", doc_id), d);
        d.put("parentsList1", parentsList1);
        List<Long> parentsList2 = readSqlName("sql_app.SELECT_parentsList_with_i18n",
                Map.of("parentsList", parentsList1), d);
        d.put("parentsList2", parentsList2);
        if (parentsList2.size() > 0) {
            List<Long> parentsList3 = readSqlName("sql_app.SELECT_parentsList_with_i18n",
                    Map.of("parentsList", parentsList2), d);
            d.put("parentsList3", parentsList3);
            if (parentsList3.size() > 0) {
                List<Long> parentsList4 = readSqlName("sql_app.SELECT_parentsList_with_i18n",
                        Map.of("parentsList", parentsList3), d);
                d.put("parentsList4", parentsList4);
                if (parentsList4.size() > 0) {
                    List<Long> parentsList5 = readSqlName("sql_app.SELECT_parentsList_with_i18n",
                            Map.of("parentsList", parentsList4), d);
                    d.put("parentsList5", parentsList5);
                }
            }
        }
        return d;
    }

    private List<Long> readSqlName(String sqlName, Map<String, Object> mapParams, Map<String, Object> d) {
        List<Long> parentsList = new ArrayList<>();
        abstractDataNode.sqlNameToDataList(sqlName, mapParams).forEach(setEl(d, parentsList));
        return parentsList;
    }

    private Consumer<? super Map<String, Object>> setEl(Map<String, Object> d, List<Long> parentsList) {
        return el -> {
            // Long docId = (Long) d.get("doc_id");
            Long elDocId = (Long) el.get("doc_id");
            parentsList.add(elDocId);
            Map<Long, Object> elMap = (Map<Long, Object>) d.get("elMap");
            elMap.put(elDocId, el);
            Long parent = (Long) el.get("parent");
            if (elMap.containsKey(parent)) {
                Map<Long, Object> clList = (Map<Long, Object>) d.get("clList");
                if (!clList.containsKey(parent))
                    clList.put(parent, new ArrayList<Long>());
                List<Long> parentChildren = (List<Long>) clList.get(parent);
                parentChildren.add(elDocId);
            }
        };
    }

}
