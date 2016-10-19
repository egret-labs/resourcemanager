//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module RES {

	/**
	 * @language en_US
	 * Resource term. One of the resources arrays in resource.json.
	 * @version Egret 2.4
	 * @platform Web,Native
	 */
	/**
	 * @language zh_CN
	 * 资源项。对应 resource.json 中 resources 数组中的一项。
	 * @version Egret 2.4
	 * @platform Web,Native
	 */

	export namespace ResourceItem {


		export const TYPE_IMAGE: string = "image";

		export function convertToResItem(r: ResourceInfo): ResourceItem {

			let name:string = "";
			let config: ResourceConfig = RES["configInstance"];
			if (!config.config) {
				name = r.url;
			}
			else {
				for (let aliasName in config.config.alias) {
					if (config.config.alias[aliasName] == r.url) {
						name = aliasName;
					}
				}
			}

			let result = {
				name,
				url: r.url,
				type: r.type,
				data: r
			}

			return result;
		}

	}



	export interface ResourceItem extends ResourceInfo {

		/**
		 * @language en_US
		 * Name of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 加载项名称。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		name: string;
		/**
		 * @language en_US
		 * URL of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 要加载的文件地址。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		url: string;
		/**
		 * @language en_US
		 * Type of resource term.
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 加载项文件类型。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		type: string;

		/**
		 * @language en_US
		 * The raw data object to be referenced.
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 被引用的原始数据对象。
		 * @version Egret 2.4
		 * @platform Web,Native
		 */
		data: ResourceInfo;

	}
}