/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 18:00:27
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';

class TemplateCtl extends Controller {
	constructor() {
		super();
		
	}
	async getTemplateAll(req, res, next) {
		const results = await model.TemplateModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
	//创建模板
	async createTemplate(req, res, next) {
		const data = getDataFromReq(req)
		const params = {
			catalog_id: data.catalog_id,
			bg_img: data.bg_img,
			bg_imgsumb: data.bg_imgsumb
		}

		var results = await model.TemplateModel.create(params);

		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new TemplateCtl()
