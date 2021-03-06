/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-30 23:13:15
*/
import moment from 'moment';
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Catalog = db.define('catalog', {
  catalog_name: {
    type: Sequelize.TEXT
  },
  catalog_icon: {
    type: Sequelize.TEXT,
    get: function(value) {
      const catalog_icon_name = this.getDataValue('catalog_icon');
      const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${
        config.QLOUD_CDN_URL_EXTEND
      }static/images/`;
      const url = `${urlOrigin}${catalog_icon_name}.png`;
      return url;
    }
  },
  catalog_bg: {
    type: Sequelize.TEXT
  },
  created_at: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD');
    }
  },
  updated_at: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD');
    }
  }
});

export default Catalog;
