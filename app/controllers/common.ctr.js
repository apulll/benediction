/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-21 11:40:49
*/

import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage } from '../lib';
import validatorForm from '../lib/validator';
import config from '../config';
import { cos, qcloud_cod } from '../lib/upload';
var Promise = require("bluebird");
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/common');
const { check,validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var cosAsync = Promise.promisifyAll(cos);

class CommonCtr extends Controller {
	constructor() {
		super();
		this.uploadQcloud = this.uploadQcloud.bind(this)
		this.upload = this.upload.bind(this)
	}
	/**
	 * 图片上传 
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async upload(req, res, next){

		try {
			const _this = this;
			const files = req.files;
			console.log(files,'files')
			let newFiles = []
			const fileResults = await Promise.each(files, function(item, index, length){
				 _this.uploadQcloud(item)
			})
			console.log(fileResults,'fileResults')
			const results = await model.FileModel.bulkCreate(fileResults, { fields: ['filename','size','mimetype'] }, { validate: true })
			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
			res.status(200).send(jsonFormatter({ msg : "上传文件异常"+error},true));
		}

	}

	uploadQcloud(file){
		
		var params = {
	    Bucket : `${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}`,                        
	    Region : config.QCLOUD_REGION,                        
	    Key : file.filename, 
	    FilePath:  path.resolve(process.cwd(), file.path)                         
		};
		
		const aaa = cosAsync.sliceUploadFileAsync(params).then(function(res){
				return res
		}).catch(function(error){
				return error
		})
		return aaa
		
	}
	/**
	 * 文件上传，限定只能传图片
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async uploadImg(req, res, next) {
		const _this = this;
		const files = req.files;
		Logger.debug(req.body)
		files.map(function(file){
				const response = _this.uploadQcloud(file)
				// if(response) return;

		})
		res.status(200).send('jsonFormatter({ res : newResults})');
	}

}



export default new CommonCtr()