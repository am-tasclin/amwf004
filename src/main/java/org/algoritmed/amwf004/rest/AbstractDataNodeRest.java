package org.algoritmed.amwf004.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
@RequestMapping("/r/adn")
public class AbstractDataNodeRest {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractDataNodeRest.class);
    protected @Autowired @Qualifier("db1AbstractDataNode") AbstractDataNode abstractDataNode;

    @GetMapping("l/{parentsList}")
    public @ResponseBody Map<String, Object> getListByParentIds(@PathVariable List<Integer> parentsList) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("parentsList", parentsList);
        abstractDataNode.exeQueryForSqlName("sql_app.SELECT_parentsList_with_i18n", map);
        return map;
    }

    @GetMapping("el/{doc_id}")
    public @ResponseBody Map<String, Object> getElementById(@PathVariable Integer doc_id) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("doc_id", doc_id);
        abstractDataNode.exeQueryForSqlName("sql_app.SELECT_obj_with_i18n", map);
        return map;
    }

}
