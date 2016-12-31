"use strict";
/*
 *  Copyright 2016 Nicholas Anderson
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const url = require("url");
const querystring = require("querystring");

function Cachet(apiBase, apiKey) {
  let vm = this;
  let url_pieces = url.parse(apiBase);

  vm.api_url = url_pieces;
  vm.api_key = apiKey;
  vm.api_version = 1;
  vm.lib = url_pieces.protocol == "https:" ? require("https") : require("http");

  let endpoints = {
    components:"components/",
    componentGroups: "components/groups/",
    incidents: "incidents/"
  };
  for (let name in endpoints) {
    vm[name] = {
      get: function(id) {
        return vm._get(endpoints[name]+id);
      },
      list: function(options) {
        return vm._get(endpoints[name]+"?"+querystring.stringify(options));
      },
      add: function(options) {
        return vm._post(endpoints[name], options);
      },
      delete: function(id) {
        return vm._delete(endpoints[name]+id);
      },
      update: function(id, options) {
        return vm._put(endpoints[name]+id, options);
      }
    };
  }
}

Cachet.prototype = {
  /**
   * _req - Performs a HTTP/S request against an endpoint
   *
   * @param  {('GET'|'POST'|'PUT'|'DELETE')} method - HTTP method
   * @param  {String} path   Path of request
   * @param  {String} body   Text to be included in the HTTP body
   * @returns {Promise}
   * @resolves {Object}
   */
  _req: function(method, path, body) {
    let vm = this;

    // Remove preceding forward slash
    if (path.startsWith("/")) {
      path = path.substr(1);
    }
    return new Promise((resolve, reject) => {
      let opts = {};
      opts.method = method;
      opts.port = vm.api_url.port || vm.api_url.protocol == "https:" ? 443 : 80;
      opts.hostname = vm.api_url.hostname;
      opts.path = url.resolve(vm.api_url.href, "/api/v" + vm.api_version + "/" + path);
      opts.headers = {
        "Accept": "application/json,text/json",
        "Content-Type": "application/json",
        "User-Agent": "node-cachet",
        "X-Cachet-Token": vm.api_key
      };
      if (method == "POST" || method == "PUT") {
        opts.headers["Content-Length"] = body.length;
      }
      let request = vm.lib.request(opts, (response) => {
        let body = [];
        response.on("data", (chunk) => body.push(chunk));
        response.on("end", () => {
          let body_text = body.join("");
          try {
            let res = JSON.parse(body_text.length > 0 ? body_text : "\"\"");
            resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      });
      request.on("error", (err) => reject(err));
      request.end(body);
    });
  },
  _get: function(path) {
    return this._req("GET", path, null);
  },
  _post: function(path, body) {
    return this._req("POST", path, JSON.stringify(body));
  },
  _delete: function(path) {
    return this._req("DELETE", path);
  },
  _put: function(path, body) {
    return this._req("PUT", path, JSON.stringify(body));
  }
};

module.exports = Cachet;
