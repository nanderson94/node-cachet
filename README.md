# node-cachet
This is a fairly simple no-dependency API to [Cachet](https://cachethq.io/), the
open source status page system.

## Progress
This is a fairly new project, and I haven't yet fully completed it. Notable
to-do items include:
  - Incident Updates endpoint
  - Metrics endpoint
  - Subscribers endpoint
  - Actions endpoint
  - Better Testing

## Usage

To setup the client,
```javascript
const Cachet = require("node-cachet");
const client = new Cachet("https://demo.cachethq.io/", "9yMHsdioQosnyVK4iCVR");
```

To receive a list of all components. [Refer to Advanced API usage](https://docs.cachethq.io/docs/advanced-api-usage).
```javascript
client.components.list({
  "per_page": 5,
  "status": 2
}).then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
```

TODO: Update doc to show all of:
`client.{components,componentGroups,incidents}.{list,get,add,update,delete}.then().catch();`

## License

Copyright 2016 Nicholas Anderson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
