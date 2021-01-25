# AI Live Effects Functions

A set of ExtendScript convenience functions for applying Live Effects in Adobe Illustrator.

---
## Why these functions?
The pageItem.applyEffect method is difficult to use. It takes an XML string as its one parameter. And there is no official documentation for what the XMLs needs to contain to achieve the live effect. The knowledge of the XML string has been gleaned over years by many people, and passed on, often through the Adobe community forum. Finding the details can be laborious, and implementation can be a little painful.

My aim with these functions is to hide away all that esoteric complication behind a neat and tidy api.

---
## Important note

Some of the Live Effects functions simply don't work right, probably due to my lack of knowledge. See my [notes document](https://mark1bean.github.io/ai-live-effect-functions/) for the status of each function. Any help or improvements welcome!

---
## Installation

Download the [script files](https://github.com/mark1bean/ai-live-effect-functions/archive/master.zip) and use the LE functions in your own scripts.

> [!IMPORTANT]
> Each function in `LE_Functions.js` relies on `LE.js`, so you need them both.


---
## Usage

Every LE function takes two parameters: `item` and `options`.

`item` is the pageItem to which the Live Effect will apply. The functions will error if no item is supplied.

`options` is an object that holds all other parameters. If options is not supplied, the functions will simply use their default settings.


Internally, each function has a defaults object. Here is an example of the defaults object from `LE_InnerGlow`:

```
var defaults = {
    blendMode: 2,                /* 0 normal, 1 multiply, 2 screen, ... */
    glowType: 0,                 /* 0 center, 1 edge */
    opacity: 0.75,               /* 0...1 */
    blur: 5,                     /* px */
    glowColor: [255, 255, 255],  /* [C,M,Y,K], [R,G,B] or [K] */
    expandAppearance: false
}
```

So calling the function without options, means those defaults will apply.

```
LE_InnerGlow(item);
```

> [!TIP]
> Refer to the `defaults` object if you aren't sure what parameters it can take.

To override the defaults, populate an options object with any params you wish, like this:

```
var myOptions = {
    opacity: 0.6,
    blur: 10,
    glowColor: [0, 20, 100, 0],
}
LE_InnerGlow(item, myOptions);
```

or, if you prefer, like this:

```
LE_InnerGlow(item, {
    opacity: 0.6,
    blur: 10,
    glowColor: [0, 20, 100, 0],
});
```

For one or two parameters, inline works well:
```
LE_InnerGlow(item, {opacity: 0.5, blur: 15});
```

---
## Expand Appearance

Calling any function with option `expandAppearance: true` will expand the item's appearance (identical to Expand Appearance menu command) immediately after applying the effect.

---
## System requirements

Adobe Illustrator. As of 2021-01-25, tested only on version 25 (Mac OS 11.1).

---
## Acknowledgements

Thanks to lots of help and encouragement from CarlosCanto, Silly-V and femkeblanco at [community.adobe.com](https://community.adobe.com)

Thanks to the contributors at [gl-mat4](https://github.com/stackgl/gl-mat4) where I found some excellent 3D matrix functions that saved me a lot of time.