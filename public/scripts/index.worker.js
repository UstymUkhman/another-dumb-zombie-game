!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="./",n(n.s="./node_modules/ts-loader/index.js!./node_modules/eslint-loader/dist/cjs.js?!./src/managers/worker/worker.ts")}({"./node_modules/ts-loader/index.js!./node_modules/eslint-loader/dist/cjs.js?!./src/managers/worker/worker.ts":function(e,t,n){"use strict";n.r(t),n.d(t,"worker",(function(){return i}));const r=(e,t)=>Math.random()*(t-e)+e,o=(Object.freeze({m2:2*Math.PI,d2:Math.PI/2,d3:Math.PI/3,d4:Math.PI/4,d6:Math.PI/6}),.5),s=e=>{const t=(e=>JSON.parse(JSON.stringify(e)))(e.bounds);t.push(t.shift());const n=t.filter((e=>e[0]<o)),s=t.filter((e=>e[0]>=o));let i=-Infinity,a=-Infinity,u=-Infinity,d=-Infinity,l=Infinity,f=Infinity,c=Infinity,p=Infinity;const y=e.minCoords[1]+o,m=e.maxCoords[1]-o;let h,b,M,j;do{j=r(y,m),b=Math.abs(j-e.player.z)<10}while(j<37&&b);n.forEach((e=>{const t=e[1];t<j&&t>u&&(i=e[0],u=t),t>j&&t<c&&(l=e[0],c=t)})),s.forEach((e=>{const t=e[1];t<j&&t>d&&(a=e[0],d=t),t>j&&t<p&&(f=e[0],p=t)}));const I=Math.max(i,l)+o,g=(j<37?Math.min:Math.max)(a,f)-o;do{M=r(I,g),h=Math.abs(M-e.player.x)<10}while(h&&b);return[M,j]},i=self;i.onmessage=e=>{const{event:t,params:n}=e.data,r=((e,t)=>{switch(e){case"Level:coord":return s(t);default:return}})(t,n);i.postMessage({response:r,name:t})},i.onerror=e=>{}}});