package org.algoritmed.amwf004.amdb;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public class AbstractDataNode {
    protected static final Logger logger = LoggerFactory.getLogger(AbstractDataNode.class);
    private NamedParameterJdbcTemplate dbParamJdbcTemplate;
    private JdbcTemplate dbJdbcTemplate;

    AbstractDataNode(JdbcTemplate dbJdbcTemplate, NamedParameterJdbcTemplate dbParamJdbcTemplate) {
        this.dbParamJdbcTemplate = dbParamJdbcTemplate;
        this.dbJdbcTemplate = dbJdbcTemplate;
        logger.info("16 - msg");
    }
    public String getX(){
        logger.info("19 - msg");
        return "--------";
    }
}
