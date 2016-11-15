# wagner-common

Fork of [spite/Wagner](http://github.com/spite/Wagner) in commonjs for browserify and glslify. The Passes are not all available yet i'm porting them as I need them, PR welcome (it's fairly easy to port).

[demo](http://superguigui.github.io/Wagner)

## Installation

```bash
npm install @superguigui/wagner glslify three --save
```

## Usage

```javascript
var THREE = require('three');
var WAGNER = require('@superguigui/wagner');
var BloomPass = require('@superguigui/wagner/src/passes/bloom/MultiPassBloomPass');

// ...

var composer = new WAGNER.Composer(renderer);
var bloomPass = new BloomPass({
  blurAmount: 2,
  applyZoomBlur: true
});

// ...

renderer.autoClearColor = true;
composer.reset();
composer.render(scene, camera);
composer.pass(bloomPass);
composer.toScreen();
```
