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

const Cachet = require("./index.js");

const client = new Cachet("https://demo.cachethq.io/", "9yMHsdioQosnyVK4iCVR");
const async = require("asyncawait/async");
const await = require("asyncawait/await");
const util = require("util");

const componentData = {
  name: "Testing node-cachet",
  description: "Test scripts to ensure the functionality of the node package.",
  status: 2,
  link: "https://github.com/nanderson94/node-cachet",
  order: 15,
  enabled: true
};

let test = async (function() {
  try {
    // Insert a new component
    console.log("Adding component");
    let newComponent = await (client.components.add(componentData));
    let newId = newComponent.data.id;

    // Get all components
    let listComponents = await (client.components.list());
    let foundItem = false;
    for (let i = 0, len = listComponents.data.length; i < len; i++) {
      let item = listComponents.data[i];
      if (item.id !== newId) {
        continue;
      }
      foundItem = true;
      for (let x in componentData) {
        if (item[x] !== componentData[x]) {
          console.log("Failure in data consistancy for %s. (Expected %s, got %s)", x, componentData[x], item[x]);
        }
        console.log("Data consistent for %s", x);
      }
      break;
    }
    if (!foundItem) {
      console.log("Failed to insert record");
    }

    // Testing getting component by ID
    let getComponent = await (client.components.get(newId));
    for (let x in componentData) {
      if (getComponent.data[x] !== componentData[x]) {
        console.log("Failure in data consistancy for %s. (Expected %s, got %s)", x, componentData[x], getComponent.data[x]);
      }
      console.log("Data consistent for %s", x);
    }

    // Testing updating a component by ID
    let updateComponent = await (client.components.update(newId, {name: "Testing the node-cachet package"}));

    let getComponent2 = await (client.components.get(newId));

    let deleteComponent = await  (client.components.delete(newId));

    console.log("---------- New Component ----------");
    console.log(util.inspect(newComponent));
    console.log("---------- List Components ----------");
    console.log(util.inspect(listComponents));
    console.log("---------- Get Component ----------");
    console.log(util.inspect(getComponent));
    console.log("---------- Update Component ----------");
    console.log(util.inspect(updateComponent));
    console.log("---------- Get Component (after update) ----------");
    console.log(util.inspect(getComponent2));
    console.log("---------- Delete Component ----------");
    console.log(util.inspect(deleteComponent));
  }
  catch (e) {
    console.log("Test 2 failed");
    console.log(e);
  }
});

test();
