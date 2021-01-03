package org.algoritmed.amwf004.rest;

import java.util.HashMap;
import java.util.Map;

import org.algoritmed.amwf004.amdb.AbstractDataNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AbstractDataNodeRest {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractDataNodeRest.class);
    protected @Autowired @Qualifier("db1AbstractDataNode") AbstractDataNode abstractDataNode;

    @GetMapping("/r/adn/{id}")
	public @ResponseBody Map<String, Object> getFooById(@PathVariable Integer id) {
        Map m = new HashMap<String, Object>();
        m.put("id", id);
        m.put("x", "y");
        logger.info("25 - "+m);
        logger.info("25 - "+abstractDataNode);
        abstractDataNode.getX();
        return m;
    }
}
